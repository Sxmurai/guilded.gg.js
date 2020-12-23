import { readdirSync, lstatSync } from "fs";
import { join } from "path";

import { Manager } from "../Manager";

export class EventHandler {
  /**
   * The websocket
   * @type {Manager}
   */
  public socket: Manager;

  /**
   * The events
   * @type {Map<string, any>}
   */
  public modules = new Map();

  public constructor(socket: Manager) {
    this.socket = socket;
  }

  public load() {
    for (const file of this.read(join(__dirname, "..", "events"))) {
      let event = require(file);
      
      if (!event) {
        return;
      }
      
      event = new event.default();
      this.modules.set(event.id, event);
    }
  }

  public run(event: string, data?: any) {
    const found = [...this.modules.values()].find((mod) => mod.id === event);
    
    if (found) {
      found.execute(this.socket, data);
    }
  }

  public read(dir: string, files: any[] = []): string[] {
    for (const file of readdirSync(dir)) {
      const path = join(dir, file);
      if (lstatSync(path).isDirectory()) {
        files.concat(this.read(path, files));
      } else {
        files.push(path);
      }
    }

    return files;
  }
}