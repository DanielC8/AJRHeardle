## New faster version!

This app used to use the nodejs starter, which sometimes meant long startup times.

My more recent Heardles used the static site starter, which load instantly.

If you made a Hearle by remixing this in the past and want to upgrade yours too, just follow these steps

> In these examples replace `yourappname` with the name of your app
> For example, replace `yourappname` with `harry-styles-heardle`

1. remix your app and call the new one something like `yourappname-static` (for example `taylor-swift-static`)

2. change the game name and details in `index.html` and `main.js`  
   there are full customisation details in `README.md`

3. copy the songs array into `songs.js`

4. test it to make sure it's still working

5. switch the sites over
   - go to Settings > Edit project details and change the name of your old app to `yourappname-node`
   - go to Settings > Edit project details and change the name of your new app to the existing name `yourappname`
