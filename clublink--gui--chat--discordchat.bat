if exist node_modules\ (
	ts-node ./src/index.ts --gui --chat --discordchat
) else (
	npm i
	npm i -g typescript ts-node
        ts-node ./src/index.ts --gui --chat --discordchat
)
