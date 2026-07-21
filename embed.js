const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const { totalSongs } = require("./queue");

function createSongEmbed(song) {

    const today = new Date();

    const formattedDate =
        today.toLocaleDateString("en-GB", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });

    const embed = new EmbedBuilder()

        .setColor(0x1DB954)

        .setTitle("🎵 House of the Day")

        .setDescription(
`📅 **${formattedDate}**

# ${song.title}

🎤 ${song.artists}

💿 ${song.album}

⏱ ${song.duration}`
        )

        .setURL(song.spotify)

        .setImage(song.image)

        .setFooter({
            text: `🎧 Selected from ${totalSongs()} tracks`
        })

        .setTimestamp();

    const button = new ButtonBuilder()

        .setLabel("🎧 Listen on Spotify")

        .setStyle(ButtonStyle.Link)

        .setURL(song.spotify);

    const row = new ActionRowBuilder()

        .addComponents(button);

    return {
        embeds: [embed],
        components: [row]
    };

}

module.exports = {
    createSongEmbed
};
