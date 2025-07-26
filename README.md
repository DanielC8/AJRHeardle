[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/M4M2CHKFQ)
yoinked from:
# Harry Styles Heardle

Over 5000 people play this every day!

If you have any questions DM me on Twitter at [@derekahmedzai](https://twitter.com/derekahmedzai).

[See all my Heardle clones](https://glitch.com/@derekahmedzai/heardle-clones)

If you have a dead Heardle let me know and I can help you resurrect it.

## New faster version!

I updated this recently to avoid long load times. If you remixed this in the past and want to upgrade yours too, read UPGRADE.md

## Want to create your own Heardle?

A few things to know before you start

- you'll need to be comfortable editing some HTML, Javascript and CSS
- the songs need to be hosted on Soundcloud and be publicly accessible
- you'll need a Glitch account (free!) to remix and host yours (or you can download the code and host wherever)

## How to remix this app

1. Register a Glitch account.
2. Remix this project by clicking the `Remix` button in the header
3. To change the project title and URL go to Settings > Edit project details. If your project name is `cool-band-heardle` then your url will be `https://cool-band-heardle.glitch.me`

## Make it your own

1. In the `index.html` file, change every instance of *Harry Styles* to your artist's name. You can find and replace by hitting command+option+F on Mac, or ctrl+F on Windows.
2. Songs and answers are defined in the `songs.js` file. The songs should go in the order you want the game to go. You can manually enter the songs or if you know how to, you can write a separate script to randomize the tracks and then just copy and paste (see SONGS.md). **Note: These tracks have to follow the format `Artist - Track Title` for it to display correctly in the SoundCloud widget.**
3. In the `main.js` file, edit the details at the top. This should be enough to customise your game. If there is any other text you'd like to change, search for it and update it. **Important:** If you don't update the game URL then users who copy their results will copy the link to this Heardle instead.
4. Also in this section is the variable `HEARDLE_START_DATE`. Change this to the current date so that the game starts with the first track in your songs list.

Now you're done with all the necessary changes. Congrats! Read on for optional edits.

## Optional edits

1. If you want to track usage in Google Analytics, sign up for an account and create a property for this website. In the `main.js` file, add your tag id in the `HEARDLE_GOOGLE_ANALYTICS` bit.
2. If you don't want to use Google Analytics, delete the bit of code that is commented at the bottom of the page.
3. Go to Assets and upload an image. This'll be your app's icon.
4. In the `index.html` file, replace every instance of `https://cdn.glitch.global/c60bd441-357c-4ca2-8158-1443c0e5dfbe/favicon.png?v=1681058541048` with your new URL.
5. In the `bundle.css` file, go to line 788. Here you can change the different accent colors for your game. Simply replace the HEX color codes with ones you want.

## Good luck!

And don't forget to share your custom Heardle!

Reddit, WhatsApp, Facebook and Twitter are good places to share.
