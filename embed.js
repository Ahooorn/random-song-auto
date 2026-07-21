const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

/**
 * Erstellt einen schönen Discord-Embed
 * für den House of the Day.
 */
function createSongEmbed(song) {

    const today = new Date();

    const formattedDate =
        today.toLocaleDateString(
            "en-GB",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );

    const embed =
        new EmbedBuilder()

        // Spotify-Grün
        .setColor(0x1DB954)

        .setAuthor({
            name: `🎵 House of the Day • ${formattedDate}`
        })

        .setTitle(song.title)

        .setURL(song.spotify)

        .setDescription(

`👤 **Artist${song.artists.includes(",") ? "s" : ""}**
${song.artists}

💿 **Album**
${song.album}

⏱ **Duration**
${song.duration}`

        )

        // Großes Albumcover
        .setImage(song.image)

        .setFooter({
            text: "🎧 Random House Track"
        })

        .setTimestamp();

    const spotifyButton =
        new ButtonBuilder()

        .setLabel("Open in Spotify")

        .setStyle(ButtonStyle.Link)

        .setURL(song.spotify);

    const row =
        new ActionRowBuilder()

        .addComponents(
            spotifyButton
        );

    return {

        embeds: [embed],

        components: [row]

    };

}

module.exports = {

    createSongEmbed

};
