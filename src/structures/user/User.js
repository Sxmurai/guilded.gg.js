import { Client } from "../../client/Client";

export class User {
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
   * Updates this user
   * @param {Record<string, any>} data 
   */
  update(data) {
    const { user } = data;

    /**
     * This users ID
     * @type {string}
     */
    this.id = user.id;

    /**
     * This users username
     * @type {string}
     */
    this.username = user.name;

    /**
     * The images associated with the account
     */
    this.images = {
      pfp: {
        small: user.profilePictureSm,
        normal: user.profilePicture,
        large: user.profilePictureLg,
        blur: user.profilePictureBlur
      },
      banner: {
        small: user.profileBannerSm,
        normal: user.profileBanner,
        large: user.profileBannerLg,
        blur: user.profileBannerBlur
      }
    }

    /**
     * When the user joined guilded
     * @type {number}
     */
    this.createdAt = Date.parse(user.joinDate);

    /**
     * The users "subdomain," which is just a vanity URL
     * @type {string}
     */
    this.vanityURL = user.subdomain;

    /**
     * About this user
     */
    this.about = {
      bio: user.aboutInfo?.bio,
      customStatus: user.aboutInfo?.tagLine
    }

    /**
     * The time the user was last online
     * @type {number}
     */
    this.lastOnline = Date.parse(user.lastOnline);

    /**
     * The users email
     * @type {string | null}
     */
    this.email = user.email ?? user.serviceEmail ?? null;
  }
}