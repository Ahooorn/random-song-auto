const { Client, GatewayIntentBits } = require("discord.js");
const cron = require("node-cron");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;

// 🎵 DEINE PLAYLIST – füge hier deine Songs ein (YouTube oder Spotify Links)
const playlist = [
  "https://www.youtube.com/watch?v=BEISPIEL1",
  "https://www.youtube.com/watch?v=BEISPIEL2",
  "https://www.youtube.com/watch?v=BEISPIEL3",
  // beliebig viele weitere Links...
];

// 🕒 Jeden Tag um 9:00 österreichische Zeit (= 7:00 UTC im Sommer)
cron.schedule("0 7 * * *", async () => {
  try {
    const channel = await client.channels.fetch(CHANNEL_ID);
    const randomSong = playlist[Math.floor(Math.random() * playlist.length)];
    channel.send("🎵 **House of the Day** 🎵\n\n" + randomSong);
    console.log("Song gesendet:", randomSong);
  } catch (err) {
    console.error("Fehler beim Senden:", err);
  }
});

client.once("ready", () => {
  console.log("Bot ist online!");
});

client.login(DISCORD_TOKEN);
