import { Client } from "../../client/Client";

export class Message {
  /**
   * Creates a new instance of a Message
   * @param {Record<string, any>} data
   * @param {Client} client
   */
  constructor(data, client) {
    this.client = client;

    this.update(data);
  }

  /**
   * Updates this message
   * @param {Record<string, any>} data
   */
  update(data) {
    /**
     * The ID of the message
     * @type {string}
     */
    this.id = data.message.id;

    /**
     * The time the message was created at
     * @type {number}
     */
    this.createdAt = Date.parse(data.createdAt) ?? Date.now();

    /**
     * The content of the message
     * @type {string}
     */
    this.content =
      data.message.content.document.nodes[0].nodes[0].leaves[0].text ?? null;
  }
}
