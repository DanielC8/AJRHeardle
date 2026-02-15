# AJR Heardle

A daily music guessing game for AJR fans. Listen to the intro of an AJR song and try to guess the title in as few attempts as possible — Wordle-style.

## Features

- **Daily Song Rotation**: A new AJR song is selected each day based on a rotating catalog of songs.
- **Progressive Audio Reveal**: Each wrong guess unlocks a longer clip (1s, 2s, 4s, 7s, 11s, 16s).
- **Autocomplete Search**: Type to search through the full AJR discography with duplicate-free suggestions.
- **Shareable Results**: Copy an emoji grid summary of your game to share with friends.
- **SoundCloud Playback**: Audio is streamed via the SoundCloud Embed API with a manual fallback if the widget is blocked.

## Project Structure

```
index.html        Entry point. Loads styles, song data, and game logic.
main-fixed.js     Game engine. Handles song selection, playback, guessing, and UI.
songs.js          Song database. Array of ~2500 AJR tracks with SoundCloud URLs.
stylesheet.css    Base styles and CSS custom properties for theming.
```

## How It Works

1. **Song Selection** — `getTodaysSong()` calculates the number of days since a configured start date and picks a song by index.
2. **Audio Playback** — A hidden SoundCloud iframe is embedded. The SoundCloud Widget API controls play/pause and enforces the time limit for the current guess. If the API fails to load, a fallback reveals the iframe for manual control.
3. **Guessing** — The player types a song name into an input with autocomplete. On submit, the guess is compared (case-insensitive) to the correct answer. Wrong guesses are listed with a red border; a correct guess ends the game with a green border.
4. **Result Sharing** — Generates an emoji grid (red = wrong, green = correct, white = unused) and copies it to the clipboard or opens the native share dialog.

## Configuration

All configuration lives at the top of `main-fixed.js`:

| Variable | Purpose |
|---|---|
| `HEARDLE_GLITCH_NAME` | Glitch project name, used to build the game URL |
| `HEARDLE_ARTIST` | Artist name displayed in the UI |
| `HEARDLE_START_DATE` | Date the song rotation begins (format: `YYYY-M-D`) |
| `HEARDLE_GAME_COMMENTS` | Array of 7 messages shown at game end (index 0 = failed, 1-6 = guesses used) |

## Adding / Changing Songs

Edit `songs.js`. Each entry follows this format:

```js
{
  url: "https://soundcloud.com/ajrbrothers/bang",
  answer: "AJR - Bang!"
}
```

Songs rotate in array order. The answer string must match the format `Artist - Track Title` for autocomplete and guess matching to work.

To bulk-extract tracks from a SoundCloud artist page, open the browser console on their tracks page and run:

```js
let songs = [];
document.querySelectorAll('.soundList__item').forEach(item => {
  let artist = item.querySelector('.soundTitle__usernameText').innerText;
  let track = item.querySelector('.soundTitle__title span').innerText;
  let url = 'https://soundcloud.com' + item.querySelector('a.soundTitle__title').getAttribute('href');
  songs.push({ url, answer: artist + ' - ' + track });
});
JSON.stringify(songs);
```

## Usage

This is a static site with no build step or server required.

**Local development:**

```
npx serve .
```

**Glitch deployment:**

Upload or remix the project on [Glitch](https://glitch.com). The game URL will be `https://<project-name>.glitch.me/`.

## Customizing the Theme

Edit the CSS custom properties in `stylesheet.css`:

```css
:root {
  --color-positive: #1d7e05;  /* correct guess / submit button */
  --color-negative: #ff0000;  /* wrong guess */
  --color-fg: #ffffff;        /* text */
  --color-mg: #444444;        /* inactive elements */
  --color-bg: #121212;        /* page background */
  --color-line: #888888;      /* borders */
}
```

## Requirements

- A modern browser with JavaScript enabled
- Songs must be publicly accessible on SoundCloud
