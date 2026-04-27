const { Client, GatewayIntentBits } = require("discord.js");
const fetch = require("node-fetch");
const cron = require("node-cron");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// Werte kommen aus Railway "Variables"
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const PLAYLIST_ID = process.env.PLAYLIST_ID;

// Spotify Token holen
async function getSpotifyToken() {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Authorization":
        "Basic " +
        Buffer.from(
          SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET
        ).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "grant_type=client_credentials"
  });
  const data = await res.json();
  return data.access_token;
}

// Songs holen
async function getRandomTrack() {
  const token = await getSpotifyToken();
  console.log("Spotify Token:", token ? "OK" : "FEHLT");

  const res = await fetch(
    `https://api.spotify.com/v1/playlists/${PLAYLIST_ID}/tracks`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  const data = await res.json();
  console.log("Spotify Antwort:", JSON.stringify(data).slice(0, 300));

  if (!data.items || data.items.length === 0) {
    throw new Error("Keine Tracks gefunden!");
  }

  const tracks = data.items;
  const random = tracks[Math.floor(Math.random() * tracks.length)];
  return random.track.external_urls.spotify;
}

// 🕒 Jeden Tag um 9:00 österreichische Zeit (= 7:00 UTC im Sommer)
cron.schedule("02 9 * * *", async () => {
  try {
    const channel = await client.channels.fetch(CHANNEL_ID);
    const song = await getRandomTrack();
    channel.send("🎵 **House of the Day** 🎵\n" + song);
  } catch (err) {
    console.error("Fehler beim Senden:", err);
  }
});

client.once("ready", () => {
  console.log("Bot ist online!");
});

client.login(DISCORD_TOKEN);
