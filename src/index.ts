import { Emoji, MessageEmbed, WebhookClient } from "discord.js"
import { config } from "dotenv";
import mineflayer from "mineflayer";
import colors from "colors";
import readline from "node:readline";
import formatDuration from "format-duration";

import ConsoleCosmeticLib from "./resources/console";
import emojis from "./resources/emojis";
import sequences from "./resources/sequences";
import { parseEmojis } from "./resources/emojis";
import { parseTitleName } from "./resources/emojis";
import { getRank } from "./resources/emojis";

var Minecraft: mineflayer.Bot;
var Discord: WebhookClient;
var ChatBridge: readline.Interface = readline.createInterface(process.stdin, process.stdout);

const embedColor = "#ADD8E6";

/**
 * Under our license, you are required to keep this section of code in.
 * If you remove or modify it, you are legally liable and can be taken
 * to court. I don't mind you modifying my code to fit your needs, but
 * I don't at all give you permission to entirely take credit for my
 * work. If you want to take credit, write your own bot. No one likes
 * having their code stolen. Please don't do it to me <3 - Hannah
 */
const footer = "Powered by ClubLink | Maintained by xCrystalz_"

var sessionStats = {
    // Session Time Stats
    sessionStart: new Date(),
    sessionEnd: new Date(),
    // Tokens
    totalTokens: 0,
    tokenMessages: 0,
    totalTimesWon: 0,
    spinAmount: 0,
    // Gems
    totalGems: 0,
    activityGems: 0,
    marketGems: 0,
    // Extra
    goodnights: 0,
    purchases: 0,
    pings: 0
};

var playerData = {
    UUID: ""
};

var logGUIData = false;
var logChatData = false;
var shouldSendGG = false;

config();
console.clear();
ConsoleCosmeticLib.startUpSequence(() => {
 
    if (process.argv.includes("--gui")) {
        logGUIData = true;
        console.log(colors.red("[$]") + colors.gray(" GUI flag detected, logging GUI data"));
    }

    if (process.argv.includes("--chat")) {
        logChatData = true;
        console.log(colors.red("[$]") + colors.gray(" Chat flag detected, logging all chat messages"));
    }

    if (process.argv.includes("--gg")) {     
        shouldSendGG = true;
        console.log(colors.red("[$]") + colors.gray(" GG flag detected, sending GG messages on store purchase"));
    }


    Discord = new WebhookClient({ url: process.env.URL as string });
    console.log(colors.green("[+]") + colors.gray(" Webhook client created")); 

    const options = {
        host: "play.mineclub.com",
        username: process.env.EMAIL as string,
        password: process.env.PASSWORD as string,
        auth: process.env.AUTH as "microsoft" | "mojang",
        version: "1.17.1",
        brand: "ClubLink"
    };
    
    Minecraft = mineflayer.createBot(options);
    console.log(colors.green("[+]") + colors.gray(" Established MineClub connection on version 1.17.1"));

    
    console.log(colors.yellow("[@]") + colors.gray(" Connecting to lobby server..."));
    Minecraft.once("spawn", () =>  {
        // Start MineClub
        playerData.UUID = Minecraft.player.uuid;
        Minecraft.acceptResourcePack();

        Discord.send({
            username: "ClubLink [" + Minecraft.username + "]",
            avatarURL: `https://crafatar.com/renders/head/${playerData.UUID}?overlay`,
            embeds: [
                new MessageEmbed({
                    color: embedColor,
                    title: "<:mineclub:945347249578344508> Connection Established <:mineclub:945347249578344508>",
                    description: "Successfully connected to **MineClub** <:mineclub:945347249578344508> \n Account: **" + Minecraft.username + "**",
                    footer: {
                        text: footer
                    }
                })
            ],
        }).then(() => {            
            console.log(colors.green("[+]") + colors.gray(" Successfully joined an available lobby server"));
            console.log(colors.red("[$]") + colors.gray(" ClubLink is no longer being worked on publicly, all changes made are the players mistake."));
            sessionStats.sessionStart = new Date();
        })
    });

    Minecraft.on("kicked", (reason) => {
        if (reason === "{\"text\":\"You seem to be logged in already. Try again later!\"}") {
            console.log(colors.red("[-]") + colors.gray(" Account lost connection to the server. This is because it's already connected to MineClub. If you frequently restart this process, open your task manager to ensure you haven't got a " + colors.bold.red("'phantom process'") + " open by accident. Otherwise, make sure your Java Edition account isn't connected in any windows. If this doesn't solve your issue, change your account credentials immediately."));
        }
    });

    ChatBridge.on("line", (input) => {
        // Console -> Minecraft Chat + Commands + TOS Protection
        if (input.startsWith("?")) {
            switch (input) {
                case "?leave":
                    ChatBridge.close();
                    ChatBridge = readline.createInterface(process.stdin, process.stdout);
                    Minecraft.end();
                    console.log(colors.red("[-]") + colors.gray(" Disconnected from MineClub"));
                    ChatBridge.setPrompt("");
                    ChatBridge.prompt();
            }
        } else if (input.startsWith("/home")) {
	  console.log(colors.magenta("[*]") + colors.gray(" You cannot run this command! This violates TOS."));
	} else if (input.startsWith("/afk")) {
	  console.log(colors.magenta("[*]") + colors.gray(" You cannot run this command! This violates TOS."));
	} else if (input.startsWith("/stafflounge")) {
	  console.log(colors.magenta("[*]") + colors.gray(" You cannot run this command! This violates TOS."));
	} else if (input.startsWith("/staff")) {
        console.log(colors.magenta("[*]") + colors.gray(" You cannot run this command! This violates TOS."));
	} else if (input.startsWith("/hub")) {
	  console.log(colors.magenta("[*]") + colors.gray(" You cannot run this command! This violates TOS."));
	} else if (input.startsWith("/tpa")) {
        console.log(colors.magenta("[*]") + colors.gray(" You cannot run this command! This violates TOS."));
    } else if (input.startsWith("/tpahere")) {
        console.log(colors.magenta("[*]") + colors.gray(" You cannot run this command! This violates TOS."));
    } else if (input.startsWith("/joinadminevent")) {
        console.log(colors.magenta("[*]") + colors.gray(" Sorry! You are not allowed to join Admin Events on a Console Client!"));
	} else if (input.startsWith("/")) {
            Minecraft.chat(input);
            Discord.send({
                username: "ClubLink " + "[" + Minecraft.username + "] ",
                avatarURL: `https://crafatar.com/renders/head/${playerData.UUID}?overlay`,
                embeds: [
                    new MessageEmbed({
                        color: embedColor,
                        title: "USED COMMAND!",
                        description: `You have just ran a command via the panel.`,
                        footer: {
                            text: footer
                        }
                    })
                ],
            })
	} else {
            Minecraft.chat(input);
        }

    });

    Minecraft.on("windowOpen", (window) => {
        if (logGUIData) console.log(colors.cyan("[$]") + colors.gray(" GUI opened with title \"" + window.title + "\""));
    });

    Minecraft.on("messagestr", async (message, messagePosition, jsonMsg) => {
        // Message formatting
        if (message.includes(":")) {
            let [, author, content] = /([^:]*):(.*)/.exec(message)!
            let rank = getRank(author)
            rank = rank ? rank[0].toUpperCase() + rank.slice(1) : undefined
            let title = parseTitleName(author)
            author = rank && rank !== title ? `[${rank}/${title}] ${author.replace(/\W+/g, "")}` : `[${title}] ${author.replace(/\W+/g, "")}`
            content = parseEmojis(content.replace(/§\w/g, "")!)
                .replace(Minecraft.username, colors.blue(Minecraft.username))
                .replace("@everyone", colors.yellow("@everyone"))
                console.log(colors.blue(`${author}`) + colors.gray(":") + colors.white(`${content}`));
        }

        if (messagePosition == "system") {
            // Tokens Detector
            if (message.match(/[\W]* You won ([0-9]) (\w*) Token[s]?!/g) != null) {
                let spinner = Math.floor(sessionStats.totalTokens / 10)
                if (spinner !== sessionStats.spinAmount) {
                    console.log(colors.magenta("[#]") + colors.gray(" Account earned tokens"));
                    console.log(colors.magenta("[#]") + colors.gray(" Account is able to spin!"));

                    sessionStats.totalTimesWon += 1;
                    sessionStats.totalTokens += Number.parseInt(message.replace(/[^0-9]+/g, ""));
                    sessionStats.spinAmount += 1;

                    Discord.send({
                        content: `<@${process.env.USERID}> - You are able to spin! Now able to spin: ${sessionStats.spinAmount} time(s)`,
                        username: "ClubLink " + "[" + Minecraft.username + "] ",
                        avatarURL: `https://crafatar.com/renders/head/${playerData.UUID}?overlay`,
                        embeds: [
                            new MessageEmbed({
                                color: embedColor,
                                title: emojis.VALENTINES_TOKEN + " YOU WON " + Number.parseInt(message.replace(/[^0-9]+/g, "")) + " VALENTINES TOKEN(S)!",
                                description: `You've now won ${sessionStats.totalTimesWon} times out of the ${sessionStats.tokenMessages} during this session! Now totalling: ${sessionStats.totalTokens}`,
                                footer: {
                                    text: footer
                                }
                            })
                        ],
                    })
                } else {
                    console.log(colors.magenta("[#]") + colors.gray(" Account earned tokens"));

                    sessionStats.totalTimesWon += 1;
                    sessionStats.totalTokens += Number.parseInt(message.replace(/[^0-9]+/g, ""));

                    Discord.send({
                        username: "ClubLink " + "[" + Minecraft.username + "] ",
                        avatarURL: `https://crafatar.com/renders/head/${playerData.UUID}?overlay`,
                        embeds: [
                            new MessageEmbed({
                                color: embedColor,
                                title: emojis.VALENTINES_TOKEN + " YOU WON " + Number.parseInt(message.replace(/[^0-9]+/g, "")) + " VALENTINES TOKEN(S)!",
                                description: `You've now won ${sessionStats.totalTimesWon} times out of the ${sessionStats.tokenMessages} during this session! Now totalling: ${sessionStats.totalTokens}`,
                                footer: {
                                    text: footer
                                }
                            })
                        ],
                    })
                }

            }
            // Activity Gems Detector
            if (message.includes("阵")) {
                sessionStats.totalGems += 50;
		        sessionStats.activityGems += 50;
                Discord.send({
                    username: "ClubLink " + "[" + Minecraft.username + "] ",
                    avatarURL: `https://crafatar.com/renders/head/${playerData.UUID}?overlay`,
                    embeds: [
                        new MessageEmbed({
                            color: embedColor,
                            title: emojis.GEMS + " YOU EARNT 50 GEMS",
                            description: `You've now earnt ${sessionStats.activityGems}` + emojis.GEMS + ` from activity during this session!`,
                            footer: {
                                text: footer
                            }
                        })
                    ],
                })
            }
            // Purchases Detector
	        else if (message.includes("Purchase") && shouldSendGG) {
                if (shouldSendGG) {
                    setTimeout(storep,Math.floor(Math.random() * 10000) + 5000);
                    function storep() { 
                        Minecraft.chat("GG");
                    }
                    sessionStats.purchases += 1;
                    Discord.send({
                        username: "ClubLink " + "[" + Minecraft.username + "] ",
                        avatarURL: `https://crafatar.com/renders/head/${playerData.UUID}?overlay`,
                        embeds: [
                            new MessageEmbed({
                                color: embedColor,
                                title: "STORE PURCHASE",
                                description: `There have now been ${sessionStats.purchases} during this session!`,
                                footer: {
                                    text: footer
                                }
                            })
                        ],
                    })
                } else {
                    sessionStats.purchases += 1;
                    Discord.send({
                        username: "ClubLink " + "[" + Minecraft.username + "] ",
                        avatarURL: `https://crafatar.com/renders/head/${playerData.UUID}?overlay`,
                        embeds: [
                            new MessageEmbed({
                                color: embedColor,
                                title: "STORE PURCHASE",
                                description: `There have now been ${sessionStats.purchases} during this session!`,
                                footer: {
                                    text: footer
                                }
                            })
                        ],
                    })
                }
            }
           // Token Message Detector
	        else if (message.includes("鳠")) {
                sessionStats.tokenMessages += 1;
            }

    } else if (messagePosition == "chat") {
            // Message Detection
            if (message.match(/[\W]+(\w+) -> ME: ([\w\W]+)/g)) {
                Discord.send({
                    content: `<@${process.env.USERID}> - you got a private message!`,
                    username: "ClubLink " + "[" + Minecraft.username + "] ",
                    avatarURL: `https://crafatar.com/renders/head/${playerData.UUID}?overlay`,
                    embeds: [
                        new MessageEmbed({
                            color: embedColor,
                            description: "**" + message.replace(/[\W]+(\w+) -> ME: ([\w\W]+)/g, "$1") + "**: " + message.replace(/[\W]+(\w+) -> ME: ([\w\W]+)/g, "$2"),
                            footer: {
                                text: footer
                            }
                        })
                    ],
                })
                
                console.log(colors.magenta("[#]") + colors.cyan(" Account recieved private message from " + message.replace(/[\W]+(\w+) -> ME: ([\w\W]+)/g, "$1")));
            }
        }

    });

    Minecraft.on("chat", async (username, message) => {
        if (logChatData) {
            if (username == Minecraft.username) {
                return;
            }
            // Mention Detection
            if ((message.includes(Minecraft.username)) || (message.includes("@everyone"))) {
                sessionStats.pings += 1
                Discord.send({
                    content: `<@${process.env.USERID}>, you were mentioned in public chat!`,
                    username: "ClubLink " + "[" + Minecraft.username + "] ",
                    avatarURL: `https://crafatar.com/renders/head/${playerData.UUID}?overlay`,
                    embeds: [
                        new MessageEmbed({
                            color: embedColor,
                            description: username + ": " + message,
                            footer: {
                                text: footer
                            }
                        })
                    ],
                })
                
                console.log(colors.magenta("[#]") + colors.cyan(" Account was mentioned in public chat either by username or by use of @everyone"));
            }
            // Goodnight Detection
            if ((message.match(/\bgoodnight\b/g) || message.match(/\bnight\b/g) || message.match(/\bnini\b/g) ||message.match(/\bgn\b/g)) && message.includes(Minecraft.username)) {
                sessionStats.goodnights += 1;
                console.log(colors.magenta("[#]") + colors.cyan(" Account recieved a goodnight from a player"));
            }
        }
    });

    Minecraft.on("end", (reason) => {
        // Leave
        sessionStats.sessionEnd = new Date();
        
        var formattedDiff = formatDuration(sessionStats.sessionEnd.valueOf() - sessionStats.sessionStart.valueOf());
        let ratio = sessionStats.totalTimesWon / sessionStats.tokenMessages
        Discord.send({
            username: "ClubLink " + "[" + Minecraft.username + "] ",
            avatarURL: `https://crafatar.com/renders/head/${playerData.UUID}?overlay`,
            embeds: [
                new MessageEmbed({
                    color: embedColor,
                    title: "**Disconnected from MineClub! <:mineclub:945347249578344508>**",
                    fields: [
                        {
                            name: "**Session Length:**",
                            value: formattedDiff
                        },
                        {
                            name: "**Gems Earnt:**",
                            value: "Total Gems: " + sessionStats.totalGems + emojis.GEMS + "\n Activity Gems: " + sessionStats.activityGems + emojis.GEMS + "\n Market Gems: " + sessionStats.marketGems + emojis.GEMS
                        },
                        {
                            name: "**Tokens Won:**",
                            value: sessionStats.totalTokens + emojis.VALENTINES_TOKEN + ` Total (${sessionStats.totalTimesWon}/${sessionStats.tokenMessages})` + `\n **Ratio:** ${ratio}`
                        },
			{
			    name: "**Extra:**",
			    value: "<:sleepy2:931356445553885284> **Total Goodnights:** " + sessionStats.goodnights + "\n" + "<:Ping:776635199136071720> **Total Pings:** " + sessionStats.pings + "\n" + "<a:money_face_gif:871944957185896478> **Total Purchases:** " + sessionStats.purchases
			},
                    ],
                    footer: {
                        text: footer
                    }
                })
            ],
        })
    	process.on("SIGINT", () => {
            console.clear();
            console.log(colors.red("[-]") + colors.gray(" Process ended"));
            console.log(colors.bold.gray("Thank you for using ClubLink!"));
            console.log(colors.gray("ClubLink is developed & maintained by " + colors.bold.cyan("xCrystalz_ (aka Josh)")));
        })
	setTimeout(processend,3000)
	function processend() { 
    	    console.log(colors.red("Shutting down Clublink...."));
	    process.exit()
	}
    });

});
