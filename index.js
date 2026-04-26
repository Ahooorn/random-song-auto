const { Client, GatewayIntentBits } = require("discord.js");
const fetch = require("node-fetch");
const cron = require("node-cron");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// 🔑 HIER EINTRAGEN
const DISCORD_TOKEN = "MTQ5NzkxMDk1NzE2OTQ0NzAyMg.GLjQvf.by3Tljygyp-TpX3n_aYcujIIT1qY6VVuYpnNPc";
const CHANNEL_ID = "1497886585964855448";
const SPOTIFY_CLIENT_ID = "c883a72bc4784270acc49dd0665e9ae4";
const SPOTIFY_CLIENT_SECRET = "72d08a29dcc24691a3822d28fdd7cc0d";
const PLAYLIST_ID = "7xeMtyBtLEKb69NQObqarg?si=08feaf4e0925405f";

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

  const res = await fetch(
    `https://api.spotify.com/v1/playlists/${PLAYLIST_ID}/tracks`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  const data = await res.json();
  const tracks = data.items;

  const random = tracks[Math.floor(Math.random() * tracks.length)];
  return random.track.external_urls.spotify;
}

// 🕒 Zeit einstellen (z.B. 18:00 jeden Tag)
cron.schedule("0 18 * * *", async () => {
  const channel = await client.channels.fetch(CHANNEL_ID);
  const song = await getRandomTrack();

  channel.send("🎵 Song des Tages: " + song);
});

client.once("ready", () => {
  console.log("Bot ist online!");
});

client.login(DISCORD_TOKEN);