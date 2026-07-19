const fetch = require("node-fetch");

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

let accessToken = null;
let expiresAt = 0;

// ----------------------------
// Access Token
// ----------------------------
async function getAccessToken() {

    if (accessToken && Date.now() < expiresAt) {
        return accessToken;
    }

    const response = await fetch(
        "https://accounts.spotify.com/api/token",
        {
            method: "POST",
            headers: {
                Authorization:
                    "Basic " +
                    Buffer.from(
                        `${CLIENT_ID}:${CLIENT_SECRET}`
                    ).toString("base64"),

                "Content-Type":
                    "application/x-www-form-urlencoded"
            },

            body: "grant_type=client_credentials"
        }
    );

    if (!response.ok) {
        throw new Error(
            "Spotify Token konnte nicht geladen werden."
        );
    }

    const data = await response.json();

    accessToken = data.access_token;

    expiresAt =
        Date.now() +
        (data.expires_in - 60) * 1000;

    return accessToken;
}

// ----------------------------
// Track ID aus URL
// ----------------------------
function getTrackId(url) {

    const match =
        url.match(/track\/([A-Za-z0-9]+)/);

    if (!match) {
        throw new Error(
            "Ungültiger Spotify Link."
        );
    }

    return match[1];
}

// ----------------------------
// Millisekunden -> mm:ss
// ----------------------------
function formatDuration(ms) {

    const total =
        Math.floor(ms / 1000);

    const minutes =
        Math.floor(total / 60);

    const seconds =
        String(total % 60)
            .padStart(2, "0");

    return `${minutes}:${seconds}`;
}

// ----------------------------
// Song laden
// ----------------------------
async function getTrack(url) {

    const token =
        await getAccessToken();

    const trackId =
        getTrackId(url);

    const response =
        await fetch(
            `https://api.spotify.com/v1/tracks/${trackId}`,
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );

    if (!response.ok) {

        throw new Error(
            "Song konnte nicht geladen werden."
        );

    }

    const track =
        await response.json();

    return {

        title:
            track.name,

        artists:
            track.artists
                .map(a => a.name)
                .join(", "),

        album:
            track.album.name,

        duration:
            formatDuration(
                track.duration_ms
            ),

        image:
            track.album.images[0]?.url,

        spotify:
            track.external_urls.spotify

    };

}

module.exports = {
    getTrack
};
