# CLUB LINK SETUP TUTORIAL:

### Instructions (written for MacOS but should be universal)

#### Downloading
1. Download the file, unzip it & locate it.
2. Open Finder and at the top of your screen press "Go"
3. In the Go section press on "Go to Folder" then enter: /Users/<Your Mac User>/ and press Go
4. Open a New Finder Window and re-locate the unzipped bot - once done drag the bot folder into your users category.

#### Setup
1. Open the bot folder and do the shortcut: Ctrl + Shift + .
2. This shows hidden files (dotted files such as the .env file) open the .env file with a Text Editor and enter your credentials.
URL = Webhook URL
AUTH = Microsoft or Mojang (Depending on Minecraft Account)
EMAIL = Microsoft or Mojang email for Minecraft Account
PASSWORD = Microsoft or Mojang password for Minecraft Account
3. Open the Terminal App and run: cd <Folder Name> (eg. cd dist - this opens my bot folder)
4. Make sure you have node.js downloaded: https://nodejs.org/en/
5. Run: npm i (in your terminal) - this downloads all the packages needed for the bot.
6. Now, the bot SHOULD be ready to go.

#### Starting the bot
1. Open the Terminal App and run: cd <Folder Name> (eg. cd dist - this opens my bot folder)
2. Run: npm run start --gui --chat - THIS SHOULD BOOT UP THE BOT

Alternative (only use if the above option doesnt work):
1. Open the Terminal App and run: cd <Folder Name> (eg. cd dist - this opens my bot folder)
2. If the above option DOESNT work, you will need to download TS-Node globally, to do that run: npm i ts-node -g
3. Then run: ts-node ./src/index.ts --gui --chat

#### Usage
1. Typing in console and sending it once logged into the bot will allow you to send messages into MineClub!
2. By Running: ?list whilst in the console and logged in you can see how many players are online!
3. By Running: ?leave or ?disconnect you can see how many Tokens & Gems you've earnt in however long your session was! It also disconnects you from MineClub.

#### What is ClubLink used for?
1. Tracking Tokens & Gems
2. Being able to AFK with a rubbish PC!
3. Detects missed Private Messages!
4. And More!
