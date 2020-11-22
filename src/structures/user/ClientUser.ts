import { Client } from "../../client/Client";
import { User } from "./User";

export enum Status {
  ONLINE = 1,
  IDLE,
  DND,
  OFFLINE,
}

interface UserEditOptions {
  email?: string;
  subdomain?: string;
  name?: string;
  aboutInfo?: About;
}

interface About {
  tagLine?: string;
  bio?: string;
}

export class ClientUser extends User {
  /**
   * The users that have been blocked by the user
   * @type {any[]}
   */
  public blocked: any[] = [];

  /**
   * The devices the user is on
   * @type {any[]}
   */
  public devices: any[] = [];

  /**
   * Creates a new instance of a client user
   * @param {Record<string, any>} data
   * @param {Client} client
   */
  public constructor(data: Record<string, any>, client: Client) {
    super(data, client);

    this.client = client;
  }

  public setUsername(username: string) {
    this.client.emit(
      "debug",
      `(Connection) :: You are changing your username to: ${username}`
    );

    return this.edit({ name: username });
  }

  public setEmail(email: string) {
    this.client.emit(
      "debug",
      `(Connection) :: You are changing your email to: ${email}`
    );

    return this.edit({ email });
  }

  public setSubdomain(subdomain: string) {
    return this.edit({ subdomain });
  }

  public setPassword(newPassword: string) {
    this.client.emit(
      "debug",
      `(Connection) :: You are changing your password to: ${newPassword}`
    );

    return this.client.rest.request("post", "/users/me/passwowrd", {
      newPassword,
    });
  }

  public setAbout(options: About) {
    return this.edit({
      aboutInfo: Object.assign(
        {
          tagLine: this.about?.customStatus,
          bio: this.about?.bio,
        },
        options
      ),
    });
  }

  public setPresence(status: Status) {
    if (
      typeof status !== "number" ||
      Number(status) < 1 ||
      Number(status) > 4
    ) {
      this.client.emit(
        "error",
        new Error("Presence must return a type of number (1-4)")
      );
      return;
    }

    return this.client.rest.request("post", "/users/me/presence", { status });
  }

  public setStatus(text: string) {
    const data = {
      content: {
        object: "value",
        document: {
          object: "document",
          data: {},
          nodes: [
            {
              object: "block",
              type: "paragraph",
              data: {},
              nodes: [
                {
                  object: "text",
                  leaves: [{ object: "leaf", text: text, marks: [] }],
                },
              ],
            },
          ],
        },
      },
      customReactionId: 90002547,
      //customReactionId: null,
      expireInMs: 0,
    };

    return this.client.rest.request("post", "/users/me/status", data);
  }

  public clearStatus() {
    return this.client.rest.request("delete", "/users/me/status");
  }

  public edit(options: UserEditOptions) {
    return this.client.rest.request("put", `/users/${this.id}/profilev2`, {
      userId: this.id,
      ...options,
    });
  }

  /**
   * Updates this client user
   * @param {Record<string, any>} data
   */
  public update(data: Record<string, any>) {
    super.update(data);

    const { user } = data;

    /**
     * The users that have been blocked by the user
     * @type {any[]}
     */
    this.blocked = user.blocked ?? [];

    /**
     * The devices the user is on
     * @type {any[]}
     */
    this.devices = user.devices ?? [];
  }
}

/* 
    "updateMessage": null,
    "user": { // As the endpoint says, this is all stuff about you, the logged-in user.
        "id": "userId",
        "name": "",
        "profilePictureSm": "https://s3-us-west-2.amazonaws.com/www.guilded.gg/UserAvatar/randomNonsenseHash-Large.png?w=450&h=450",
        "profilePicture": "https://s3-us-west-2.amazonaws.com/www.guilded.gg/UserAvatar/randomNonsenseHash-Large.png?w=450&h=450",
        "profilePictureLg": "https://s3-us-west-2.amazonaws.com/www.guilded.gg/UserAvatar/randomNonsenseHash-Large.png?w=450&h=450",
        "profilePictureBlur": "https://s3-us-west-2.amazonaws.com/www.guilded.gg/UserAvatar/randomNonsenseHash-Large.png?w=450&h=450",
        "profileBannerBlur": "https://s3-us-west-2.amazonaws.com/www.guilded.gg/UserBanner/randomNonsenseHash-Hero.png?w=1422&h=600",
        "profileBannerLg": "https://s3-us-west-2.amazonaws.com/www.guilded.gg/UserBanner/randomNonsenseHash-Hero.png?w=1422&h=600",
        "profileBannerSm": "https://s3-us-west-2.amazonaws.com/www.guilded.gg/UserBanner/randomNonsenseHash-Hero.png?w=1422&h=600",
        "joinDate": "yyyy-mm-ddThh:mm:ss.milisecondsZ",
        "steamId": null,
        "userStatus": { // Your custom status
            "content": {
                "object": "value",
                "document": {
                    "data": {},
                    "nodes": [
                        {
                            "data": {},
                            "type": "paragraph",
                            "nodes": [
                                {
                                    "leaves": [
                                        {
                                            "text": "",
                                            "marks": [],
                                            "object": "leaf"
                                        }
                                    ],
                                    "object": "text"
                                }
                            ],
                            "object": "block"
                        }
                    ],
                    "object": "document"
                }
            },
            "customReactionId": emojiId, // The custom emoji you're using in your status
            "customReaction": {
                "id": emojiId,
                "name": "",
                "png": "https://s3-us-west-2.amazonaws.com/www.guilded.gg/CustomReaction/randomNonsenseHash-Full.webp?w=120&h=120",
                "webp": "https://s3-us-west-2.amazonaws.com/www.guilded.gg/CustomReaction/randomNonsenseHash-Full.webp?w=120&h=120",
                "apng": null
            }
        },
        "subdomain": "", // Your user subdomain (really they shouldn't call it a subdomain, that would be subdomain.guilded.gg. This is infuriating)
        "moderationStatus": null, // If you're Guilded staff?
        "aboutInfo": {
            "bio": "", // "About" section on your profile
            "tagLine": "" // The line of text under your name on your profile
        },
        "lastOnline": "yyyy-mm-ddThh:mm:ss.milisecondsZ",
        "aliases": [],
        "email": "",
        "blockedUsers": [],
        "socialLinks": [],
        "userPresenceStatus": "3",
        "badges": [],
        "canRedeemGold": boolean,
        "isUnrecoverable": boolean,
        "devices": [],
        "userChannelNotificationSettings": [],
        "upsell": {
            "type": "UserSetupUpsell",
            "activationType": "userCreation",
            "topic": "user",
            "includedUpsellSpecs": [],
            "localStageStats": {
                "getDesktopApp": "incomplete",
                "getMobileApp": "incomplete"
            },
            "entityId": "", // Not quite sure what this is. Formatted like any other ID though (not an int)
            "includedUpsells": []
        }
    },
    "teams": [
        {
            "createdAt": "yyyy-mm-ddThh:mm:ss.milisecondsZ",
            "id": "teamId",
            "ownerId": "userId",
            "name": "",
            "subdomain": "", // Again, not really a subdomain >:/
            "rankNames": null,
            "profilePicture": "https://s3-us-west-2.amazonaws.com/www.guilded.gg/TeamAvatar/randomNonsenseHash-Large.png?w=450&h=450",
            "teamDashImage": "https://s3-us-west-2.amazonaws.com/www.guilded.gg/TeamBanner/randomNonsenseHash-Hero.png?w=1443&h=481",
            "status": null,
            "teamPreferences": null,
            "additionalGameInfo": {},
            "discordGuildId": null,
            "discordServerName": null,
            "customizationInfo": {},
            "homeBannerImageSm": "https://s3-us-west-2.amazonaws.com/www.guilded.gg/TeamBanner/randomNonsenseHash-Hero.png?w=1443&h=481",
            "homeBannerImageMd": "https://s3-us-west-2.amazonaws.com/www.guilded.gg/TeamBanner/randomNonsenseHash-Hero.png?w=1443&h=481",
            "homeBannerImageLg": "https://s3-us-west-2.amazonaws.com/www.guilded.gg/TeamBanner/randomNonsenseHash-Hero.png?w=1443&h=481",
            "insightsInfo": {},
            "alphaInfo": {},
            "timezone": "America/New York (EST/EDT)",
            "isRecruiting": boolean,
            "isVerified": boolean,
            "isPublic": boolean,
            "alwaysShowTeamHome": boolean,
            "isPro": boolean,
            "autoSyncDiscordRoles": boolean,
            "type": "community",
            "memberCount": "",
            "followerCount": "",
            "baseGroup": {
                "id": "groupId",
                "teamId": "teamId",
                "gameId": null,
                "visibilityTeamRoleId": roleId,
                "membershipTeamRoleId": roleId,
                "isBase": boolean,
                "name": "Server home",
                "description": null,
                "additionalGameInfo": {},
                "createdBy": null,
                "createdAt": "yyyy-mm-ddThh:mm:ss.miliseconds+00:00",
                "updatedBy": null,
                "updatedAt": null,
                "deletedAt": null,
                "priority": null,
                "customReactionId": null,
                "isPublic": boolean,
                "type": "team",
                "avatar": null,
                "banner": null
            },
            "membershipRole": "member",
            "roleIds": [
                roleId
            ],
            "rolesById": {
                "roleId": {
                    "id": roleId,
                    "name": "",
                    "color": "#hexval",
                    "isBase": boolean,
                    "teamId": "teamId",
                    "priority": 4,
                    "createdAt": "yyyy-mm-ddThh:mm:ss.miliseconds+00:00",
                    "updatedAt": "yyyy-mm-ddThh:mm:ss.miliseconds+00:00",
                    "permissions": {
                        "chat": 119,
                        "docs": 15,
                        "forms": 18,
                        "lists": 63,
                        "media": 15,
                        "voice": 8179,
                        "forums": 123,
                        "general": 15412,
                        "calendar": 31,
                        "scheduling": 11,
                        "matchmaking": 1,
                        "recruitment": 55,
                        "announcements": 7,
                        "customization": 49
                    },
                    "isMentionable": boolean,
                    "discordRoleId": null,
                    "discordSyncedAt": null,
                    "isSelfAssignable": boolean
                }
            },
            "isFavorite": boolean,
            "canInviteMembers": boolean,
            "canUpdateTeam": boolean,
            "canManageTournaments": boolean,
            "viewerIsMember": boolean,
            "isAdmin": boolean,
            "games": [],
            "flair": [
                {
                    "id": 2
                }
            ],
            "subscriptionInfo": null
        }
    ],
    "customReactions": [ // A list of all emojis you have access to
        {
            "createdBy": "userId",
            "teamId": "teamId",
            "png": "https://s3-us-west-2.amazonaws.com/www.guilded.gg/CustomReaction/randomNonsenseHash-Full.webp?w=120&h=120",
            "webp": "https://s3-us-west-2.amazonaws.com/www.guilded.gg/CustomReaction/randomNonsenseHash-Full.webp?w=120&h=120",
            "apng": "https://s3-us-west-2.amazonaws.com/www.guilded.gg/CustomReaction/randomNonsenseHash-Full.webp?w=120&h=120",
            "name": "",
            "id": emojiId,
            "aliases": []
        }
    ],
    "reactionUsages": [ // List of all emojis you've used
        {
            "id": emojiId,
            "total": 9 // The amount of times you've used it
        }
    ]
 */
