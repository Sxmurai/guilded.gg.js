import { Event, event } from "../../handler/Event";
import { Manager } from "../../Manager";

@event("3")
export default class HelloEvent extends Event {
  public execute(ws: Manager, _: any) {
    ws.latency = Date.now() - ws.lastPinged;

    ws.debug(`Gateway aknowledged our ping! ${ws.latency}ms`);
  }
}
