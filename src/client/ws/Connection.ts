import { EventEmitter } from "events";
import ws from "ws";

import { Client } from "../Client";
import { Ping } from "./Ping";

import { Message } from "../../structures/message/Message";

export class Connection extends EventEmitter {
  /**
   * The websocket
   * @type {ws}
   */
  #socket!: ws;

  /**
   * The client
   * @type {Client}
   */
  public client: Client;

  /**
   * The automated pinger
   * @type {Ping}
   */
  public ping!: Ping;

  /**
   * When the websocket was connected
   * @type {number | null}
   */
  public connectedAt: number | null = null;

  /**
   * The disabled events
   * @type {string[]}
   */
  public disabledEvents: string[] = [];

  /**
   * The latency of the connection to the guilded gateway
   * @type {number}
   */
  public latency = 0;

  public constructor(client: Client, disabledEvents?: string[]) {
    super();

    this.client = client;
    this.disabledEvents = disabledEvents ?? [];

    this.ping = new Ping(this);
  }

  public async connect() {
    if (this.#socket) {
      this._debug("Connection has been detected, aborting...");
      return;
    }

    const data = await this.client.rest.request(
      "post",
      "/login",
      {
        email: this.client.email,
        password: this.client.password,
      },
      false
    );

    const cookie = data.headers["set-cookie"]
      .map((cookie: string) => cookie.split(" ")[0])
      .join("");

    this.client.rest.setCookie(cookie);
    this.connectedAt = Date.now();

    this.#socket = new ws(
      `wss://api.guilded.gg/socket.io/?jwt=undefined&EIO=3&transport=websocket`,
      {
        headers: {
          "Content-Type": "application/json",
          Cookie: cookie,
        },
      }
    );

    this.#socket
      .on("open", this._open.bind(this))
      .on("close", (code, reason) => this._close(code, reason))
      .on("message", this._message.bind(this));
  }

  public send(data: string) {
    return this.#socket.send(data);
  }

  private _message(data: any) {
    // we gotta deconstruct this hellspawn of a mess
    let op: number | string = "";

    if (!Number.isInteger(Number(data))) {
      for (let i = 0; i < data.length; ++i) {
        if (isNaN(Number(data.charAt(0)))) break;

        op += data[0];
        data = data.substring(1);
      }
    }

    if (Number.isInteger(Number(data))) {
      op = data;
    }

    op = Number(op);

    try {
      data = JSON.parse(data);
    } catch {
      this._debug(`Couldn't parse the response.`);
      return;
    }

    switch (op) {
      case 0:
        //this.client.emit("ready");
        this._debug(`Recieved HELLO, now starting to heartbeat.`);

        this.ping.init(data.pingInterval);
        this.ping.send();
        break;

      case 3:
        this.latency = Date.now() - this.ping.sentAt!;

        this._debug(`Gateway aknowledged our ping. Latency: ${this.latency}ms`);
        break;

      case 40:
        this._debug(
          `Recieved the ready event from the gateway, marking as ready.`
        );

        this.client.emit("ready");
        break;

      case 42:
        if (this.disabledEvents.includes(data[0])) {
          this._debug(
            `Disabled event recieved [${data[0]}]. I will discard this event.`
          );
          break;
        }

        switch (data[0]) {
          case "ChatMessageCreated":
            this.client.emit(
              "messageCreate",
              new Message(data[1], this.client)
            );
            break;

          case "ChatMessageUpdated":
            //console.log(data[1]);
            break;
        }
        break;
    }

    this._debug(`Recieved OP code: ${op}.`);
  }

  private async _open() {
    this._debug(
      `Connected with guilded at ${this.#socket.url} in ${
        Date.now() - this.connectedAt!
      }ms`
    );
  }

  private _close(code: number, reason: string) {
    this._debug(
      `Closed connection with code ${code} with the reason of ${
        reason ?? "unknown"
      }`
    );
  }

  /**
   * Emits the debug event on the client
   * @param {string} message
   */
  public _debug(message: string) {
    return this.client.emit("debug", `(Connection) :: ${message}`);
  }
}
