
const songs = require("./songs.json");

// Fisher-Yates Shuffle
function shuffle(array) {
    const arr = [...array];

    for (let i = arr.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [arr[i], arr[j]] = [arr[j], arr[i]];

    }

    return arr;
}

let queue = shuffle(songs);

function getNextSong() {

    if (queue.length === 0) {

        console.log("🎵 Alle Songs gespielt – Playlist wird neu gemischt.");

        queue = shuffle(songs);

    }

    return queue.shift();

}

function songsRemaining() {
    return queue.length;
}

function totalSongs() {
    return songs.length;
}

module.exports = {
    getNextSong,
    songsRemaining,
    totalSongs
};
