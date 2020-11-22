import axios from "axios";

export class RestManager {
  /**
   * The client
   * @type {any}
   */
  public client: any;

  /**
   * The cookies to use
   * @type {string}
   */
  #cookies?: string;

  public constructor(client: any, cookies?: string) {
    this.client = client;
    this.#cookies = cookies;
  }

  public setCookie(cookie:  string) {
    this.#cookies = cookie;
    return this;
  }

  public async request(
    method: "get" | "post" | "delete",
    endpoint: string,
    body: Record<string, any> = {},
    json?: boolean
  ) {
    const data: any = {
      method,
      ...body,
    };

    if (this.#cookies) {
      data.headers.Cookie = this.#cookies;
    }

    const res = await axios({
      url: `https://api.guilded.gg${endpoint}`,
      ...data
    })

    return json ? res.data: res;
  }
}
