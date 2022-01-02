# ClubLink: the future of MineClub.
With ClubLink, you can track tokens and gems earnt while AFKing without even having to open Minecraft. More features coming soon! Built using Discord.JS, Mineflayer & Typescript.

### Dev Team
- Hannah: Lead Developer (works on ClubLinker)
- Josh: Developer & Discord Manager (works on ClubLink client)

### Setup Instructions (written for MacOS but should be universal)

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
USERID = Discord UserID for the user you're running for
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
2. Run ?list whilst in the console and logged in you can see how many players are online!
3. Run ?leave or ?disconnect you can see how many Tokens & Gems you've earnt in however long your session was! It also disconnects you from MineClub.
  
### Bugs
Report bugs in our Discord: https://discord.gg/zmc7neES
