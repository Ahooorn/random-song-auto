const fetch = require("node-fetch");

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

let token = null;
let tokenExpires = 0;

/**
 * Holt einen gültigen Spotify Access Token.
 * Der Token wird gespeichert und erst kurz vor Ablauf erneuert.
 */
async function getAccessToken() {

    if (token && Date.now() < tokenExpires) {
        return token;
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
            "Spotify Access Token konnte nicht geladen werden."
        );

    }

    const data = await response.json();

    token = data.access_token;

    // Token läuft normalerweise nach 3600 Sekunden ab.
    // Wir erneuern ihn bereits 60 Sekunden früher.
    tokenExpires =
        Date.now() +
        ((data.expires_in - 60) * 1000);

    return token;

}

/**
 * Extrahiert die Track-ID aus einem Spotify-Link.
 */
function extractTrackId(url) {

    const match =
        url.match(/track\/([A-Za-z0-9]+)/);

    if (!match) {

        throw new Error(
            "Ungültiger Spotify-Link."
        );

    }

    return match[1];

}

/**
 * Formatiert Millisekunden zu mm:ss
 */
function formatDuration(ms) {

    const seconds =
        Math.floor(ms / 1000);

    const minutes =
        Math.floor(seconds / 60);

    const remaining =
        String(seconds % 60)
            .padStart(2, "0");

    return `${minutes}:${remaining}`;

}

/**
 * Lädt alle Informationen eines Songs.
 */
async function getTrack(trackUrl) {

    const accessToken =
        await getAccessToken();

    const trackId =
        extractTrackId(trackUrl);

    const response =
        await fetch(
            `https://api.spotify.com/v1/tracks/${trackId}`,
            {
                headers: {
                    Authorization:
                        `Bearer ${accessToken}`
                }
            }
        );

    if (!response.ok) {

        throw new Error(
            `Spotify API Fehler (${response.status})`
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
            track.album.images.length
                ? track.album.images[0].url
                : null,

        spotify:
            track.external_urls.spotify

    };

}

module.exports = {

    getTrack

};
