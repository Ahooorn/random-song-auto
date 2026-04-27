const { Client, GatewayIntentBits } = require("discord.js");
const cron = require("node-cron");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;

// 🎵 PLAYLIST
const playlist = [
  "https://open.spotify.com/track/3IkdjPFThBcKciyAV94dYp",
  "https://open.spotify.com/track/40SBS57su9xLiE1WqkXOVr",
  "https://open.spotify.com/track/7hYW4hKuPkfaLbzTpg9hQB",
  "https://open.spotify.com/track/2EPbupudXMt2oYC3iyl31o",
  "https://open.spotify.com/track/2MymczAULhpJYbgyXwwiyw",
  "https://open.spotify.com/track/1WDxBPu47UpeWv6KV9QXOY",
  "https://open.spotify.com/track/1rY27iE5JYCVtqlfEdpOS1",
  "https://open.spotify.com/track/7AGGevGpCSJlkrKxvbcsSc",
  "https://open.spotify.com/track/1mv4lh1rW1K6xhxhJmEezy",
  "https://open.spotify.com/track/6ow9Iwh3H3ud5cRREiEX53",
  "https://open.spotify.com/track/2LalfWd4l2wcvHXtqOEIoM",
  "https://open.spotify.com/track/09bwwB0fpgLQbWQmQ5Q5sm",
  "https://open.spotify.com/track/6OYWH6FZgixV7e7VN14neq",
  "https://open.spotify.com/track/20Y4EAmSXru3foatDg4OqN",
  "https://open.spotify.com/track/436vZoxz08hX7DoimX6ppv",
  "https://open.spotify.com/track/7M4GUQ0CZU5A9CO2hkadG4",
  "https://open.spotify.com/track/3DLWVhaowApIGw1JnJj6GS",
  "https://open.spotify.com/track/1YwWHm6Ad1fizVPaQ8nrco",
  "https://open.spotify.com/track/1tXkSkbltR7XjRxkgMZSNW",
  "https://open.spotify.com/track/2oCShkda3AnUzwPzZPvQyf",
  "https://open.spotify.com/track/4xqtuTUaJMrzRv2NCJ7X72",
  "https://open.spotify.com/track/75aYWQdjwPoAD21zYDFo4r",
  "https://open.spotify.com/track/7eAGNIkuwnEfdIG0X4XzaP",
  "https://open.spotify.com/track/3yAZRpEbliOJUnZH3478xG",
  "https://open.spotify.com/track/4e6WG71BDyydX2fBwPjDv4",
  "https://open.spotify.com/track/5bdKaYnig6IqBsQQqBUjHm",
  "https://open.spotify.com/track/4zSGDW0XpVpjCyVfXrqteR",
  "https://open.spotify.com/track/0Z5iboHxPmyilWJQFnHZaY",
  "https://open.spotify.com/track/4dm4WW4QcPXj7x2Qc56L32",
  "https://open.spotify.com/track/4fErrQvOX1LPDIPFDFI4eM",
  "https://open.spotify.com/track/5cJZzpcqdwkUvD2f88wcgS",
  "https://open.spotify.com/track/5bYSqdcyJ74rLL299UJAcC",
  "https://open.spotify.com/track/5W0MG8q8pKaMS2TAiSQXBN",
  "https://open.spotify.com/track/2WCEzJ2pXmk5Wf6uZEk4ds",
  "https://open.spotify.com/track/3BM5hoJ168Kh4hYEhiNxwK",
  "https://open.spotify.com/track/5NTgGRmwrsUEEbplylBYN3",
  "https://open.spotify.com/track/57508shL0obX0KUOUL8CJk",
  "https://open.spotify.com/track/5Y7iHPwxeRlhsErLtQdbvD",
  "https://open.spotify.com/track/7qI88GDjmG9V4udS8fvYcG",
  "https://open.spotify.com/track/0xo7mG0uz0Zusz5DxLZVO0",
  "https://open.spotify.com/track/6DetvocRqx9ELX2aKmwj3g",
  "https://open.spotify.com/track/55HKUSEb1W0LbCa4Qs2La0",
  "https://open.spotify.com/track/6pMfUwTWJfhnqfjW020rNH",
  "https://open.spotify.com/track/10pfamFYvg5ftwq6rGJrWx",
  "https://open.spotify.com/track/6627Spowd3WLx581JUlrB9",
  "https://open.spotify.com/track/3eieIb30CTRx3DHRHOOcaR",
  "https://open.spotify.com/track/2CaSJocFwU8ef2KB332fRi",
  "https://open.spotify.com/track/1e20Z4j3nuQP35vFtyF1JU",
  "https://open.spotify.com/track/6Vd1DMK1agDDFoAJyvSSaI",
  "https://open.spotify.com/track/10bSjjKwOTvJhTQjKpD3Bc",
  "https://open.spotify.com/track/54cZlsOZGGwHPfItCcpKjU",
  "https://open.spotify.com/track/7AMTspKpoGlTHUbjtypIUA",
  "https://open.spotify.com/track/69mmMhQZ9lQMuPhXSfJq0E",
  "https://open.spotify.com/track/0rS9f6pdy49rLBVzyGyQYv",
  "https://open.spotify.com/track/7KQmzuHLxw8Td8qADpMaR2",
  "https://open.spotify.com/track/2jVi38UYf8lUhO6JZeJGWj",
  "https://open.spotify.com/track/67zr6xdiSAhsuyvL2Dczc1",
  "https://open.spotify.com/track/1LepWHpwtahzEQL0vNjpEt",
  "https://open.spotify.com/track/6TWbY1dq8eYtFiMiGdBlOa",
  "https://open.spotify.com/track/2libVw5xnVwelZ69K47bDz",
  "https://open.spotify.com/track/0ABFNHwvoIm3VzPbpLPyuN",
];

// 🕒 Jeden Tag um 9:00 österreichische Zeit (= 7:00 UTC im Sommer)
cron.schedule("30 10 * * *", async () => {
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
