
const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

function createSongEmbed(song) {

    const today = new Date();

    const date =
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

        .setColor("#1DB954")

        .setAuthor({
            name: `🎵 House of the Day • ${date}`
        })

        .setTitle(song.title)

        .setURL(song.spotify)

        .setDescription(
            `👤 **${song.artists}**\n\n` +
            `💿 ${song.album}\n` +
            `⏱ ${song.duration}`
        )

        .setThumbnail(song.image)

        .setFooter({
            text: "🎧 Random House Track"
        });

    const button =
        new ButtonBuilder()

        .setLabel("Open in Spotify")

        .setStyle(ButtonStyle.Link)

        .setURL(song.spotify);

    const row =
        new ActionRowBuilder()

        .addComponents(button);

    return {

        embeds: [embed],

        components: [row]

    };

}

module.exports = {
    createSongEmbed
};
