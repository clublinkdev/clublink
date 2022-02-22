if exist node_modules\ (
	ts-node ./src/index.ts --gui --chat --gg
	pause
) else (
	npm i
	npm i -g typescript ts-node
	ts-node ./src/index.ts --gui --chat --gg
	pause
)
