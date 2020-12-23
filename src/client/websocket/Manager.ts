import ws from "ws";

import { Client } from "../Client";
import { LoginOptions } from "./index";

import fetch from "node-fetch";
import { EventHandler } from "./handler/EventHandler";

export class Manager {
  /**
   * The client used
   * @type {Client}
   */
  public client: Client;

  /**
   * The websocket connection
   * @type {ws}
   */
  public socket!: ws;

  /**
   * The time the websocket was created
   * @type {number}
   */
  public connectedAt!: number;

  /**
   * The latency
   * @type {number}
   */
  public latency = 0;

  /**
   * The last time we pinged guilded
   * @type {number}
   */
  public lastPinged = 0;

  /**
   * The event handler
   * @type {EventHandler}
   */
  public events!: EventHandler;

  /**
   * The cookie to use
   * @type {string}
   */
  #cookie!: string;

  public constructor(client: Client) {
    this.client = client;
  }

  public async init(login: LoginOptions) {
    const response = await fetch(`https://api.guilded.gg/login`, {
      method: "POST",
      body: JSON.stringify(login),
    });

    const cookie = response.headers.get("Set-Cookie")!;
    this.#cookie = cookie;

    this.socket = new ws(
      `wss://api.guilded.gg/socket.io/?jwt=undefined&EIO=3&transport=websocket`,
      {
        headers: {
          "Content-Type": "application/json",
          Cookie: cookie,
        },
      }
    );

    this.connectedAt = Date.now();

    this.events = new EventHandler(this);
    this.events.load();

    this.socket
      .on("close", (code, reason) => this.close(code, reason))
      .on("error", (err) => this.error(err))
      .on("open", () => this.open())
      .on("message", (data: any) => this.message(data));
  }

  public send(data: string) {
    this.socket.send(data);
  }

  public startPing(interval: number, force = false) {
    if (force) {
      this._ping()
      return
    }

    setInterval(() => this._ping(), interval)
  }

  private _ping() {
    this.lastPinged = Date.now();
    this.send("2");

    fetch(`https://api.guilded.gg/users/me/ping`, {
      headers: {
        Cookie: this.#cookie
      },
      method: "PUT"
    })
  }

  private open() {
    this.debug(`Connected to socket in ${Date.now() - this.connectedAt}ms`);
  }

  private message(data: string) {
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

    this.events.run(op, data)
    this.client.emit("raw", op, data);
  }

  private close(code: number, reason: string) {
    this.debug(`Closed connection with code ${code} and with reason ${reason}`);
  }

  private error(error: Error) {
    this.client.emit("error", error);
  }

  public debug(message: string) {
    this.client.emit("debug", `(Socket) :: ${message}`);
  }
}
