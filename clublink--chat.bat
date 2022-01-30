if exist node_modules\ (
	ts-node ./src/index.ts --chat
) else (
	npm i
	npm i -g typescript ts-node
        ts-node ./src/index.ts --chat
)
