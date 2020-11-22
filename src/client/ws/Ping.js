export class Ping {
  /**
   * The current timeout
   * @type {any}
   */
  #interval;

  /**
   * A set of intervals
   * @type {Set<any>}
   */
  #intervals = new Set();

  /**
   * The connction
   * @type {import("./Connection").Connection}
   */
  connection;

  /**
   * @param {import("./Connection").Connection} connection
   * @param {?number} interval
   */
  constructor(connection, interval = null) {
    this.connection = connection;
    this.interval = interval;
  }

  /**
   * Inits the ping
   * @param {number} interval
   */
  init(interval) {
    this.interval = interval;

    this.connection._debug(
      `Now sending a ping packet to guilded every ${interval}ms`
    );

    const inv = setInterval(() => this.send(), this.interval ?? 10000);
    this.#interval = inv;
    this.#intervals.add(inv);
  }

  send() {
    this.sentAt = Date.now();
    this.connection.send("2");
    this.connection.client.rest.request("put", "/users/me/ping");

    this.connection._debug(`Sent a ping packet.`);
  }

  kill() {
    this.#intervals.delete(this.#interval);
    this.#interval = null;
  }
}
