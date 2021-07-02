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
    const prefix = "!";

    if (
      !message.content[0].toLowerCase().startsWith(prefix) ||
      message.creator !== client.user.id
    ) {
      return;
    }

    const [cmd, ...args] = message.content[0]
      .slice(prefix.length)
      .trim()
      .split(/ +/g);

    if (cmd && message.content[0].startsWith(prefix)) {
      client.deleteMessage(message.channelID, message.id);
    }

    switch (cmd.toLowerCase()) {
      case "ping":
        return client.sendMessage(
          message.channelID,
          `Pong! \`${client.ws.latency}ms\``
        );
        break;
    }
  });

client.login(); // connect to the guilded gateway
```

---

## Support

You may get support in the [Unofficial Guilded API](https://community.guildedapi.com) server.

You will have to then go to `#roles` and then press `guilded.gg.js` and add yourself to the role.

Give it a second, or refresh your client. You will see a new group. Click on the group, go to `#support` and ask for help.

---

<h4 align="center">Licensed under GPL-3.0</h4>
