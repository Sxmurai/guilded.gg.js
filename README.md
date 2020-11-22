# guilded.gg.js

A guilded.gg API wrapper.

---

## Installation

NPM:
```
npm i guilded.gg.js
```

Yarn:
```
yarn add guilded.gg.js
```

---

## Example

```js
const { Client } = require("guilded.gg.js"); // import the client from the module

const client = new Client({
  // you can opt out of the email and password data in the constructor and pass it though the login function.
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
    if (message.content[0].toLowerCase() === "!ping") {
      return client.sendMessage(message.channelID, `Pong! \`${client.ws.latency}ms\``);
    }
  });

client.login(); // connect to the guilded gateway
```

---

<h4 align="center">Licensed under GPL-3.0</h4>