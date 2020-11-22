import { EventEmitter } from "events";

import { ClientUser } from "../structures/user/ClientUser";

import { RestManager } from "./rest/RestManager";
import { Connection } from "./ws/Connection";

export class Client extends EventEmitter {
  /**
   * Creates a new instance of a client
   * @param {ClientOptions} options
   */
  constructor(options) {
    super();

    this.email = options.email;
    this.password = options.password;

    this.rest = new RestManager(this);
    this.ws = new Connection(this, options.disabledEvents ?? []);

    /**
     * The user that is connected
     * @type {null | import("../structures/user/ClientUser").ClientUser}
     */
    this.user = null;
  }

  login() {
    this.emit(
      "debug",
      `(Connection) :: Logging in with email ${this.email
        .split("@")[0]
        .replace(/.+/g, (k) => "*".repeat(k.length))}@${
        this.email.split("@")[1]
      } and with password ${"*".repeat(this.password.length)}`
    );

    this.ws.connect().then(() => this.getMe());
  }

  async getMe() {
    const user = await this.rest.request(
      "get",
      "/me",
      { headers: { "Content-Type": "application/json" } },
      true
    );

    this.user = new ClientUser(user, this);
  }
}

/**
 * @typedef {Object} ClientOptions
 * @prop {string} email The email to login with
 * @prop {string} password The password to use with the email
 * @prop {?string[]} disabledEvents Events to not be processed by the gateway
 */