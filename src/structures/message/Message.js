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
     * The ID of the channel the message was created in
     * @type {string}
     */
    this.channelID = data.channelId;

    /**
     * The time the message was created at
     * @type {number}
     */
    this.createdAt = Date.parse(data.createdAt) ?? Date.now();

    /**
     * The person who created the message
     * @type {string}
     */
    this.creator = data.createdBy;

    /**
     * The contents of the message
     * @type {string[]}
     */
    this.content = this.getMessageContent(data.message.content);
  }

  /**
   * Gets the correct message information
   * @param {Record<string, any>} content
   */
  getMessageContent(content) {
    const format = [];

    for (const line of content.document.nodes) {
      let text = "";

      switch (line.type) {
        case "paragraph":
          for (const node of line.nodes) {
            switch (node.object) {
              case "text":
                for (const leaf of node.leaves) {
                  text += leaf.text;
                }
            }
          }
          break;

        case "inline":
          for (const leaf of line.nodes[0].leaves) {
            switch (typeof leaf.text) {
              case "string":
                text += leaf.text;
                break;

              case "object":
                text += leaf.text.text;
                break;
            }
          }
          break;

        case "block-quote-container":
          for (const node of line.nodes) {
            for (const nodeLine of node.nodes) {
              switch (nodeLine.object) {
                case "text":
                  text += nodeLine.leaves[0].text;
                  break;

                case "inline":
                  text += nodeLine.nodes[0].leaves[0].text;
                  break;
              }
            }
          }
          break;
      }

      format.push(text);
    }

    return format;
  }
}

/* 
                case "markdown-plain-text":
                    lineContent.content.push( { "type": "text", "text": line.nodes[0].leaves[0].text } );
                    lineContent.text += line.nodes[0].leaves[0].text;

                    break;
                case "webhookMessage":
                    lineContent.content.push( { "type": "embed", "content": line.data.embeds } );
                
                    break;
            }

            formattedMsg.push( lineContent ); */
