import fetch from "node-fetch";

export class RestHandler {
  /**
   * The cookie
   * @type {string}
   */
  #cookie: string;

  public constructor(cookie: string) {
    this.#cookie = cookie
  }

  public request(method: string, endpoint: string, init: any = {}) {
    init = {
      ...init,
      headers: {
        Cookie: this.#cookie,
        "Content-Type": "application/json"
      },
      method
    };

    return fetch(`https://api.guilded.gg${endpoint}`, init);
  }
}