import { MessageEmbed, WebhookClient } from "discord.js"
import { config } from "dotenv";
import mineflayer from "mineflayer";
import colors from "colors";
import readline from "node:readline";
import formatDuration from "format-duration";

import ConsoleCosmeticLib from "./resources/console";
import emojis from "./resources/emojis";
import sequences from "./resources/sequences";

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
const footer = "Powered by ClubLink | A GemDev Platform"

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

        playerData.UUID = Minecraft.player.uuid;
        Minecraft.acceptResourcePack();

        Discord.send({
            username: "ClubLink - " + Minecraft.username,
            avatarURL: `https://crafatar.com/renders/head/${playerData.UUID}?overlay`,
            embeds: [
                new MessageEmbed({
                    color: embedColor,
                    title: "Connection established",
                    footer: {
                        text: footer
                    }
                })
            ],
        }).then(() => {            
            console.log(colors.green("[+]") + colors.gray(" Successfully joined an available lobby server"));
            console.log(colors.red("[$]") + colors.gray(" ClubLink are not responsible for user modifications in our code - nor responsible for the accounts that are using this modified code."));
            sessionStats.sessionStart = new Date();
        })
    });

    Minecraft.on("kicked", (reason) => {
        if (reason === "{\"text\":\"You seem to be logged in already. Try again later!\"}") {
            console.log(colors.red("[-]") + colors.gray(" Account lost connection to the server. This is because it's already connected to MineClub. If you frequently restart this process, open your task manager to ensure you haven't got a " + colors.bold.red("'phantom process'") + " open by accident. Otherwise, make sure your Java Edition account isn't connected in any windows. If this doesn't solve your issue, change your account credentials immediately."));
        }
    });

    ChatBridge.on("line", (input) => {
        
        if (input.startsWith("?")) {
            switch (input) {
                case "?leave":
                    ChatBridge.close();
                    ChatBridge = readline.createInterface(process.stdin, process.stdout);
                    Minecraft.end();
                    console.log(colors.red("[-]") + colors.gray(" Disconnected from MineClub"));
                    ChatBridge.setPrompt("");
                    ChatBridge.prompt();
                case "?disconnect":
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
	} else if (input.startsWith("/hub")) {
	  console.log(colors.magenta("[*]") + colors.gray(" You cannot run this command! This violates TOS."));
	} else if (input.startsWith("/tpa")) {
        console.log(colors.magenta("[*]") + colors.gray(" You cannot run this command! This violates TOS."));
    } else if (input.startsWith("/tpahere")) {
        console.log(colors.magenta("[*]") + colors.gray(" You cannot run this command! This violates TOS."));
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
      if (logChatData) { 
        const formattedMessage = message
            .replace(sequences.SUS_TITLE, " [Sus]")
            .replace(sequences.BETA_TITLE, " [Beta]")
            .replace(sequences.MOD_TITLE, " [Mod]")
            .replace(sequences.ADMIN_TITLE, " [Admin]")
            .replace(sequences.MANAGER_TITLE, " [Manager]")
            .replace(sequences.OWNER_TITLE, " [Owner]")
            .replace(sequences.PRIDE_TITLE, " [Pride]")
            .replace(/[^a-zA-Z0-9 &/$£"^%&{}[\]@,<>/`!?~#:;\-_=+*.]/g, "")
            .replace(Minecraft.username, colors.blue(Minecraft.username))
            .replace("@everyone", colors.yellow("@everyone"))
            .replace(Minecraft.username, colors.blue(Minecraft.username))
            .replace("@everyone", colors.yellow("@everyone"));

        if (formattedMessage.length < 8) {
            console.log(colors.gray("CONSOLE: Receiving Tokens, Receiving Gems or Chat Messages being cleared"));
        } else {
            var chatMsg = formattedMessage.split(":");
            if(chatMsg[1] === undefined) {  // when receiving tokens, game duel request, etc. (so it would show "undefinded")
                console.log(colors.cyan("[<] " + formattedMessage));
            } else {
                console.log(
                    colors.cyan("[<]") +
                    colors.yellow(chatMsg[0]
                        .replace(" [Sus]", colors.magenta(" [Sus]"))
                        .replace(" [Pride]", colors.magenta(" [Pride]"))
                        .replace(" [Beta]", colors.magenta(" [Beta]"))
                        .replace(" [Mod]", colors.blue(" [Mod]"))
                        .replace(" [Admin]", colors.red(" [Admin]"))
                        .replace(" [Manager]", colors.yellow(" [Manager]"))
                        .replace(" [Owner]", colors.red(" [Owner]"))
                    ) + ":" +
                    colors.cyan(chatMsg[1])
                );
            }
      } else {
          console.log(colors.cyan("[<]") + colors.cyan(formattedMessage));
      }
     
      if (messagePosition == "system") {
          if (message.match(/[\W]* You won ([0-9]) (\w*) Token[s]?!/g) != null) {
              let amount = Number.parseInt(message.replace(/[^0-9]+/, "")) 

          sessionStats.totalTimesWon += 1;
              sessionStats.totalTokens += Number.parseInt(message.replace(/[^0-9]+/g, ""));

              Discord.send({
                  username: "ClubLink " + "[" + Minecraft.username + "] ",
                  avatarURL: `https://crafatar.com/renders/head/${playerData.UUID}?overlay`,
                  embeds: [
                      new MessageEmbed({
                          color: embedColor,
                          title: emojis.ANNIVERSARY_TOKEN + " YOU WON " + Number.parseInt(message.replace(/[^0-9]+/g, "")) + " ANNIVERSARY TOKEN(S)!",
                          description: `You've now won ${sessionStats.totalTimesWon} times out of the ${sessionStats.tokenMessages} during this session! Now totalling: ${sessionStats.totalTokens}`,
                          footer: {
                              text: footer
                          }
                      })
                  ],
              })

              console.log(colors.magenta("[#]") + colors.gray(" Account earned tokens"));

          }
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
                          description: `You've now earnt ${sessionStats.totalGems} in total during this session!`,
                          footer: {
                              text: footer
                          }
                      })
                  ],
              })
          }
     else if (message.includes("Purchase") && shouldSendGG) {
                if (shouldSendGG) {
                    const possibleGGs = [
                      "GG!",
                      "gg",
                      "GG",
                      "yooo gg!",
                      "ggs!",
                      "Ayy, GG!",
                      "Wooo, GG!",
                      "GG :P",
                      "gg dude",
                      "g to the g!"
                    ];

                    const index = Math.floor(Math.random() * possibleGGs.length)
                    Minecraft.chat(possibleGGs[index]); 
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
                  }
        
        }

        

        if (messagePosition == "system") {
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
                                title: emojis.ANNIVERSARY_TOKEN + " YOU WON " + Number.parseInt(message.replace(/[^0-9]+/g, "")) + " ANNIVERSARY TOKEN(S)!",
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
                                title: emojis.ANNIVERSARY_TOKEN + " YOU WON " + Number.parseInt(message.replace(/[^0-9]+/g, "")) + " ANNIVERSARY TOKEN(S)!",
                                description: `You've now won ${sessionStats.totalTimesWon} times out of the ${sessionStats.tokenMessages} during this session! Now totalling: ${sessionStats.totalTokens}`,
                                footer: {
                                    text: footer
                                }
                            })
                        ],
                    })
                }

            }
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
                            description: `You've now earnt ${sessionStats.totalGems}` + emojis.GEMS + ` in total during this session! \n \n **Activity Gems:** ${sessionStats.activityGems}` + emojis.GEMS + `\n **Market Gems:** ${sessionStats.marketGems}` + emojis.GEMS,
                            footer: {
                                text: footer
                            }
                        })
                    ],
                })
            }
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

	        else if (message.includes("這")) {

                const regex = RegExp(/[\W]+Purchase made by: [\W]+([\w]+)/g);
                const output = regex.exec(message)!

                const paymentAmount = Number.parseInt(message.replace(/[^0-9]+/, ""));
                const purchaser = output[1];

                sessionStats.marketGems += paymentAmount;
                sessionStats.totalGems += paymentAmount;

                Discord.send({
                    username: "ClubLink " + "[" + Minecraft.username + "] ",
                    avatarURL: `https://crafatar.com/renders/head/${playerData.UUID}?overlay`,
                    embeds: [
                        new MessageEmbed({
                            color: embedColor,
                            title: "MARKET - SELL",
                            description: `You sold an item which you had on the market! \n Buyer: ${purchaser} \n Amount: ${paymentAmount}` + emojis.GEMS,
                            footer: {
                                text: footer
                            }
                        })
                    ],
                })
            }
	        else if (message.includes("outbid")) {
                const match = /\[(?:Market|Housing)] You have been outbid by \W+(\w+) ([\d,]+)/.exec("[Market] You have been outbid by ;;;.;'/';';;''lol 69420")
                if (match) {
                    Discord.send({
                        username: "ClubLink " + "[" + Minecraft.username + "] ",
                        avatarURL: `https://crafatar.com/renders/head/${playerData.UUID}?overlay`,
                        embeds: [
                            new MessageEmbed({
                                color: embedColor,
                                title: "MARKET - OUTBID",
                                description: `You were outbid on the market! \n Outbid by: ${match![1]}, New Price: ${match![2].replace(/,/g, "")}`,
                                footer: {
                                    text: footer
                                }
                            })
                        ],
                    })
                }
            }
                
	        else if (message.includes("鳠")) {
                sessionStats.tokenMessages += 1;
            }

    } else if (messagePosition == "chat") {
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
    
            if ((message.match(/\bgoodnight\b/g) || message.match(/\bnight\b/g) || message.match(/\bnini\b/g) ||message.match(/\bgn\b/g)) && message.includes(Minecraft.username)) {
                sessionStats.goodnights += 1;
                console.log(colors.magenta("[#]") + colors.cyan(" Account recieved a goodnight from a player"));
            }
        }
    });

    Minecraft.on("end", (reason) => {

        sessionStats.sessionEnd = new Date();

        var formattedDiff = formatDuration(sessionStats.sessionEnd.valueOf() - sessionStats.sessionStart.valueOf());

        Discord.send({
            username: "ClubLink - " + Minecraft.username,
            avatarURL: `https://crafatar.com/renders/head/${playerData.UUID}?overlay`,
            embeds: [
                new MessageEmbed({
                    color: embedColor,
                    title: "**Disconnected from MineClub!**",
                    fields: [
                        {
                            name: "**Session Length:**",
                            value: formattedDiff
                        },
                        {
                            name: "**Gems Earnt:**",
                            value: sessionStats.totalGems + emojis.GEMS + " Total \n" + sessionStats.activityGems + emojis.GEMS + " From Activity \n" + sessionStats.marketGems + emojis.GEMS + " From Market"
                        },
                        {
                            name: "**Tokens Won:**",
                            value: sessionStats.totalTokens + emojis.ANNIVERSARY_TOKEN + " Total \n You won tokens **" + sessionStats.totalTimesWon + "/" + sessionStats.tokenMessages + "** total times"
                        },
			{
			    name: "**Extra:**",
			    value: "**Total Goodnights:** " + sessionStats.goodnights + "\n" + "**Total Pings:** " + sessionStats.pings + "\n" + "**Total Purchases:** " + sessionStats.purchases
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
            console.log(colors.gray("ClubLink is developed & maintained by " + colors.bold.cyan("hanatic (aka Hannah)") + ".\nWe'd like to thank " + colors.bold.magenta("xCrystalz_ (aka Josh)") + " for his work testing the bot and " + colors.bold.red("LostAndDead") + " accidentally for calming Hannah down when she thought her account had been hacked."));
        })
	setTimeout(processend,3000)
	function processend() { 
    	    console.log(colors.red("Shutting down Clublink...."));
	    process.exit()
	}
    });

});
