import { Client } from "../client/Client";

export class Team {
  /**
   * Creates a new instance of a user
   * @param {Record<string, any>} data
   * @param {Client} client
   */
  constructor(data, client) {
    this.client = client;

    this.update(data);
  }

  /**
   * Updates this Team
   * @param {Record<string, any>} data
   */
  update(data) {
    /**
     * The ID of this team
     * @type {string}
     */
    this.id = data.id;

    /**
     * The name of this team
     * @type {string}
     */
    this.name = data.name;

    /**
     * The images of this team
     */
    this.images = {
      pfp: data.profilePicture,
      dash: data.teamDashImage,
      banner: {
        small: data.homeBannerImageSm,
        medium: data.homeBannerImageMd,
        large: data.homeBannerImageLg
      }
    }

    /**
     * The member count
     * @type {number}
     */
    this.members = data.memberCount;
  }
}
