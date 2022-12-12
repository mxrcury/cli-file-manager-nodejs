import { stdin, stdout } from 'node:process'
import { parseArgs } from "./utils.js";
import Commands from "./commands/Commands.js";

const main = async () => {
  const username = await parseArgs();
  const commands = new Commands(username);

  stdout.write(`Welcome to the File Manager, ${username}!\n`);

  stdin.on("data", async (data) => {
    await commands.handleCommand(data);
    stdin.emit('completed', commands.currentDirectory)
  });
  stdin.on("completed", (currentDirectory)=> {
      console.log(`You are currently in ${currentDirectory}\n`)
  })
};
main()