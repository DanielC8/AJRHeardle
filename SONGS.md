## A simple way to get songs form Soundcloud

1. go to the artist's tracks page on soundcloud

2. keep scrolling to make sure all the tracks are loaded

3. run this in your browser's developer tools console  
(press F12 or similar and go to the `console` tab)

```
let songs = []
document.querySelectorAll('.soundList__item').forEach(item => {
    let artist = item.querySelector(':scope .soundTitle__usernameText').innerText;
    let track = item.querySelector(':scope .soundTitle__title span').innerText;
    let url = 'https://soundcloud.com' + item.querySelector(':scope a.soundTitle__title').getAttribute('href');
    let song = {url: url, answer: artist + ' - ' + track}
    songs.push(song)
})
let songs_json = JSON.stringify(songs)
songs_json
```

4. copy the json string - without the outer quotes - and paste it into the `songs.js` file
