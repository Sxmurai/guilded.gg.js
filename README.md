# guilded.gg.js

A guilded.gg API wrapper.

---

## Example

**DISCLAIMER: this lib isnt done, so Message#channel.send and Client#ws.latency arent things yet.**

```js
const { Client } = require("guilded.gg.js"); // import the client from the module

const client = new Client({
  email: "your email", // your email
  password: "your password (KEEP THIS SAFE!)", // your password
  disabledEvents: ["ChatChannelTyping"], // the events to ignore
});

client
  .on("ready", () =>
    // when the connection is established, log that
    console.log("(Logging) :: Connected to guilded successfully.")
  )
  .on("messageCreate", (message) => {
    // if the command is !ping, return with the clients latency
    if (message.content.toLowerCase() === "!ping") {
      return message.channel.send(`Pong! \`${client.ws.latency}ms\``);
    }
  });

client.login(); // connect to the guilded gateway
```
