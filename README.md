# archived_packages
Archived steamclient package server (Version fixing system)

## Why?
This is required, since Valve's package servers semi-regularly clean up the old packages and keeping up with the latest steamclient binaries may not always be possible.
This could also be useful for areas with bad/no internet, as downloading Steam Client updates can take quite some time on a 1/4mbps connection.

## Redistribution
Don't expose your service to the public internet.
Valve probably won't like if you go around redistributing the Steam Client, especially an old version of it.

## Auto-update (Important, please read)
This setup doesn't provide any auto-update functionality. 
You're responsible for keeping up the packages and rerunning the scripts as updates come.

## Dependendies (Step 0) 
You'll need NodeJS and npm.
Make sure they're in your PATH.

## Downloading packages (Step 1)
You have a couple options for getting packages:
 - downloadver (this is the preferred one)
   - Downloads specific packages based off the manifests in the `ver` subdirectory
   - This may fail, as the packages may get deleted from Valve's servers every now and then!
 - downloadcurrent
   - Downloads the newest steam client beta packages
   - Will probably be incompatible with `ValveSteam -> OpenSteamClient` IPC
 - downloadia
   - Downloads a fixed (pretty out of date) version of the packages from the Internet Archive
   - To change the version, change the `timestamp` property inside the script
   - Incompatible with `ValveSteam -> OpenSteamClient` IPC
 - downloadfamily
   - Downloads the newest family beta packages.
   - Does not replace any existing files, instead makes it so you can use the family beta from ValveSteam.
To use these, run `node download<variant>.js`
 
## Running the server (Step 2)
Run:
 - npm i
 - node index.js

## Persisting the server (Step 2.5, Optional) Linux only, but recommended
If you configure Steam as below, if your package server isn't running you will not be able to run Steam.
Don't blame Valve (or us), instead do the following:
1. Open up archiveserver.service in your favorite text editor
2. Replace `PATH_TO_DIR` with the path to where you put this folder, like `/home/<your username>/Documents/`
3. Put the modified archiveserver.service in .config/systemd/user/
4. Run systemctl --user daemon-reload 
5. Run systemctl --user enable --now archiveserver.service

## Configuring Steam (Step 3)
Steam doesn't use your package server by default, as that'd be completely stupid.
Instead, you'll need to specify the following arguments when launching Steam:
`-overridepackageurl http://localhost:8125/client`
On Linux, edit your .desktop file to include it, and if you launch Steam from the command line set an alias.
On Windows, edit whatever shortcut you use to launch Steam, and add the arguments there.