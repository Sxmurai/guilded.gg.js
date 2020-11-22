import { Client } from "../../client/Client";
import { User } from "./User";

export class ClientUser extends User {
  /**
   * Creates a new instance of a client user
   * @param {Record<string, any>} data
   * @param {Client} client
   */
  constructor(data, client) {
    super(data, client);

    this.client = client;
  }

  /**
   * Updates this client user
   * @param {Record<string, any>} data 
   */
  update(data) {
    super.update(data);

    const { user } = data;

    /**
     * The users that have been blocked by the user
     * @type {any[]}
     */
    this.blocked = user.blocked ?? []

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