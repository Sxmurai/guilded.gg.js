import { Event, event } from "../../handler/Event";
import { Manager } from "../../Manager";

@event("40")
export default class HelloEvent extends Event {
  public execute(ws: Manager, _: any) {
    ws.debug(`Recieved ready.`);

    // emit the "ready" event.
    ws.client.emit("ready");
  }
}
