import { EventEmitter } from "events";

import { ClientUser } from "../structures/user/ClientUser";
import { Team } from "../structures/Team";

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
     * The teams the logged in user is in
     * @type {Map<string, Team>}
     */
    this.teams = new Map();

    /**
     * The user that is connected
     * @type {null | ClientUser}
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

    this.ws.connect().then(() => {
      this.getMe();
      this.getTeams();
    });
  }

  /**
   * Logs you out of guilded.gg
   */
  logout() {
    this.emit(
      "debug",
      `(Connection) :: You are going to be logged out in 5 seconds.`
    );

    return new Promise((res) => setTimeout(res, 5000)).then(() =>
      this.rest.request("post", "/logout")
    );
  }

  async getMe() {
    const user = await this.rest.request("get", "/me", {}, true);

    this.user = new ClientUser(user, this);
  }

  async getTeams() {
    const teams = await this.rest.request("get", "/teams/", {}, true);

    for (const team of teams.teams) {
      this.teams.set(team.id, new Team(team, this));
    }
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
        document: {
          object: "document",
          data: {},
          nodes: [
            {
              object: "block",
              type: "markdown-plain-text",
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
