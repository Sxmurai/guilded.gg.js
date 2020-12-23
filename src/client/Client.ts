import { EventEmitter } from "events";
import { LoginOptions } from "./websocket";
import { Manager } from "./websocket/Manager";

export class Client extends EventEmitter {
  /**
   * The websocket manager
   */
  public ws = new Manager(this);

  public constructor() {
    super();
  }

  public login(login: LoginOptions) {
    return this.ws.init(login);
  }
}