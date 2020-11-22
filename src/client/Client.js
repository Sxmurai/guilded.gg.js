import { EventEmitter } from "events";

import { ClientUser } from "../structures/user/ClientUser";

import { RestManager } from "./rest/RestManager";
import { Connection } from "./ws/Connection";

import { v4 } from "uuid";

export class Client extends EventEmitter {
  /**
   * Creates a new instance of a client
   * @param {?ClientOptions} options
   */
  constructor(options) {
    super();

    if (options) {
      this.email = options.email;
      this.password = options.password;
    }

    this.rest = new RestManager(this);
    this.ws = new Connection(this, options?.disabledEvents ?? []);

    /**
     * The user that is connected
     * @type {null | import("../structures/user/ClientUser").ClientUser}
     */
    this.user = null;
  }

  /**
   * Logs into guilded
   * @param {?ClientOptions} options
   */
  login(options) {
    if (options) {
      this.email = options.email;
      this.password = options.password;
    }

    this.emit(
      "debug",
      `(Connection) :: Logging in with email ${this.email
        ?.split("@")[0]
        .replace(/.+/g, (k) => "*".repeat(k.length))}@${
        this.email?.split("@")[1]
      } and with password ${"*".repeat(this.password?.length ?? 0)}`
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

  /**
   * Sends a message
   * @param {string} channel
   * @param {string} content
   */
  async sendMessage(channel, content) {
    const message = {
      messageId: v4(),
      confirmed: false,
      content: {
        object: "value",
        //type: "markdown-plain-text",
        document: {
          object: "document",
          data: {},
          nodes: [
            {
              object: "block",
              type: "markdown-plain-text",
              //type: "block-quote-container",
              data: {},
              nodes: [
                {
                  object: "text",
                  leaves: [
                    {
                      object: "leaf",
                      text: content,
                      marks: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
    };

    return this.rest.request(
      "post",
      `/channels/${channel}/messages`,
      message,
      true
    );
  }

  /**
   * Deletes a message
   * @param {string} channel
   * @param {string} message
   */
  async deleteMessage(channel, message) {
    return this.rest.request(
      "delete",
      `/channels/${channel}/messages/${message}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

/**
 * @typedef {Object} ClientOptions
 * @prop {string} email The email to login with
 * @prop {string} password The password to use with the email
 * @prop {?string[]} disabledEvents Events to not be processed by the gateway
 */
