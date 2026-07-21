const { Client, GatewayIntentBits } = require("discord.js");
const cron = require("node-cron");

const { getTrack } = require("./spotify");
const { createSongEmbed } = require("./embed");
const {
    getNextSong,
    songsRemaining,
    totalSongs
} = require("./queue");

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;

/**
 * Sendet den nächsten Song.
 */
async function sendHouseOfTheDay() {

    try {

        const channel =
            await client.channels.fetch(CHANNEL_ID);

        const songUrl =
            getNextSong();

        const song =
            await getTrack(songUrl);

        const message =
            createSongEmbed(song);

        await channel.send(message);

        console.log(
            `✅ Gesendet: ${song.title} | Noch ${songsRemaining()} von ${totalSongs()} Songs übrig.`
        );

    } catch (error) {

        console.error(
            "❌ Fehler beim Senden:",
            error
        );

    }

}

/**
 * Bot gestartet
 */
client.once("clientReady", () => {

    console.log("🤖 House Bot ist online!");

    // Jeden Tag um 09:00 Uhr Europa/Berlin
    cron.schedule(
        "0 9 * * *",
        () => {

            sendHouseOfTheDay();

        },
        {
            timezone: "Europe/Berlin"
        }
    );

});

/**
 * Discord Login
 */
client.login(DISCORD_TOKEN);
