if exist node_modules\ (
	ts-node ./src/index.ts
) else (
	npm i
	npm i -g typescript ts-node
)