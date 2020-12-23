import { Event, event } from "../../handler/Event";
import { Manager } from "../../Manager";

@event("0")
export default class HelloEvent extends Event {
  public execute(ws: Manager, data: any) {
    data = JSON.parse(data);

    ws.startPing(data.pingInterval);
    ws.debug("Starting to send ping packets.");

    // force a first ping
    ws.startPing(0, true)
  }
}