if exist node_modules\ (
	ts-node ./src/index.ts --gui --chat
	pause
) else (
	npm i
	npm i -g typescript ts-node
	npm i fs
	npm i node-fetch
	npm i shelljs
	ts-node ./src/index.ts --gui --chat
	pause
)
