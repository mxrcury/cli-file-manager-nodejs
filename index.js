import { exit, stdin, stdout, chdir, stderr, cwd } from 'node:process'
import process from 'node:process'
import { parseArgs } from './utils.js'
import { COMMANDS, DIRECTORY, FILE } from './constants.js'
import { dirname } from 'node:path'
import { readdir } from 'node:fs/promises'

const main = async () => {
    let commandValueStart;
    let commandValueEnd;
    let commandValue;
    // !! after make command for changing directory ??
    // User can't go upper than root directory (e.g. on Windows it's current local drive root). If user tries to do so, current working directory doesn't change
    // !!
    // TODO: add operation failed in catch when some command execution failed
    const failedOperation = 'Operation failed\n'

    const username = await parseArgs()

    stdout.write(`Welcome to the File Manager, ${username}!\n`);

    stdin.on("data", async (data) => {
      const command = data.toString().trim().toLowerCase();


      if (command === COMMANDS.UP) {
        const upperDirectory = "../";
        chdir(upperDirectory);
        return;
      }
      if (command === COMMANDS.EXIT) {
        stdout.write(
          `Thank you for using File Manager, ${username}, goodbye!\n`
        );
        exit();
      }
      if (command.startsWith(COMMANDS.CD)) {
        commandValueStart = COMMANDS.CD.length + 1;
        commandValueEnd = command.length;
        commandValue = command.slice(commandValueStart, commandValueEnd);
        try {
          chdir(commandValue);
        } catch (error) {
          stderr.write(failedOperation);
        }
        return;
      }
      if(command === COMMANDS.LS){
        const currentDirectory = cwd()
        const files = await readdir(currentDirectory,{withFileTypes:true})
        // TODO:Change -tabledFiles- variable name
        const tabledFiles = files.map(file =>{
            // console.log(file)
            return {Name:file.name,Type:file.isDirectory() ? DIRECTORY : FILE}
        })
        // stdout.write(tabledFiles.toString())
        console.table(tabledFiles)
        return;
        // stdout.write(files)
      }
      // ---- COMMANDS WITH FILES ----


      // validation if no command exists
      stdout.write("Invalid input\n");
    });

    // TODO:write text about current directory path after every command execute
    // ?? process.cwd - for getting current working directory 
    // process.on("SIGPIPE", ()=>{
    //     stdout.write(`You are currently in path_to_working_directory\n`)
    // })
}
main()