import { exit, stdin, stdout, chdir, stderr, cwd } from 'node:process'
import { parseArgs } from './utils.js'
import { COMMANDS, DIRECTORY, FILE, OPTIONS } from './constants.js'
import { readdir, appendFile, rename, rm, rmdir, readFile } from 'node:fs/promises'
import { createReadStream, createWriteStream } from 'node:fs'
import path, { join } from 'node:path'
import { pipeline } from 'node:stream/promises'
import os from 'node:os'
import { createHash } from 'node:crypto'
import { createBrotliCompress, createBrotliDecompress } from 'node:zlib'

const main = async () => {
    // let commandValueStart;
    // let commandValueEnd;
    let commandValue;
    // !! after make command for changing directory ??
    // User can't go upper than root directory (e.g. on Windows it's current local drive root). If user tries to do so, current working directory doesn't change
    // !!
    // TODO: add operation failed in catch when some command execution failed
    const failedOperation = 'Operation failed\n'

    const username = await parseArgs()

    stdout.write(`Welcome to the File Manager, ${username}!\n`);

    stdin.on("data", async (data) => {
      const fullCommand = data.toString().trim().toLowerCase()
      const commandName = fullCommand.slice(0,fullCommand.indexOf(' '))
      const currentDirectory = cwd()
      if (fullCommand.length > commandName.length) {
      commandValue = fullCommand.slice(
          fullCommand.indexOf(" ") + 1,
          fullCommand.length
        );
      } else {
        commandValue = "";
      }
      if(!commandName.trim().length){
        // try to make this <error> reusable | refactor
        stdout.write("Invalid input\n");
        return;
      }

      if (fullCommand === COMMANDS.UP) {
        const upperDirectory = "../";
        chdir(upperDirectory);
        return;
      }
      if (fullCommand === COMMANDS.EXIT) {
        stdout.write(
          `Thank you for using File Manager, ${username}, goodbye!\n`
        );
        exit();
      }
      if (fullCommand.startsWith(COMMANDS.CD)) {
        try {
          chdir(commandValue);
        } catch (error) {
          stderr.write(failedOperation);
        }
        return;
      }
      if(fullCommand === COMMANDS.LS){
        const files = await readdir(currentDirectory,{withFileTypes:true})
        // TODO:Change -tabledFiles- variable name
        const tabledFiles = files.map(file =>{
            return {Name:file.name,Type:file.isDirectory() ? DIRECTORY : FILE}
        })
        console.table(tabledFiles)
        return;
      }
      // ---- COMMANDS WITH FILES ----
      if(fullCommand.startsWith(COMMANDS.CAT)){
        const filePath = commandValue
        const readStream = createReadStream(filePath)
        readStream.on("readable",()=>{
          let data = readStream.read()
          if(data !== null){
            data = data.toString()
            stdout.write(`${data}\n`)
          }
        })
        return;        
      }
      if(fullCommand.startsWith(COMMANDS.ADD)){
        const pathToFile = join(currentDirectory,commandValue)
        const emptyData = ''
        try {
          await appendFile(pathToFile,emptyData)
          return;
        } catch (error) {
          console.log(error);
        }
      }
      if(fullCommand.startsWith(COMMANDS.RN)){
          const oldFileName = commandValue.slice(0,commandValue.indexOf(' ')) 
          const newFileName = commandValue.slice(commandValue.indexOf(' ') + 1, commandValue.length)
          const oldFilePath = join(currentDirectory,oldFileName)
          const newFilePath = join(currentDirectory,newFileName)
        try {
            await rename(oldFilePath, newFilePath)
            return;
        } catch (error) {
          console.log(error)
        }
      }
      if(fullCommand.startsWith(COMMANDS.CP)){
          const fileName = commandValue.slice(0,commandValue.indexOf(' ')) 
          const copiedFileName = commandValue.slice(commandValue.indexOf(' ') + 1, commandValue.length)
          const filePath = join(currentDirectory,fileName)
          const copiedFileNewPath = join(currentDirectory,copiedFileName)

          const readStream = createReadStream(filePath)
          const writeStream = createWriteStream(copiedFileNewPath)
          try {
              pipeline(readStream, writeStream)
            // await copyFile(filePath, newFilePath)
            return;
        } catch (error) {
          console.log(error)
        }
      }
      if(fullCommand.startsWith(COMMANDS.MV)){
        const fileName = commandValue.slice(0, commandValue.indexOf(" "));
        const copiedDirectory = commandValue.slice(commandValue.indexOf(' ') + 1,commandValue.length)
        const copiedFileName = fileName
        const filePath = join(currentDirectory, fileName);
        const copiedFileNewPath = join(currentDirectory,copiedDirectory,copiedFileName);
        
        const readStream = createReadStream(filePath);
        const writeStream = createWriteStream(copiedFileNewPath);
        try {
          await pipeline(readStream, writeStream);
          await rm(filePath)
          return;
        } catch (error) {
          console.log(error);
        }
      }
      if(fullCommand.startsWith(COMMANDS.RM)){
        const filePath = join(currentDirectory,commandValue)
        try {
          // const isDirectory = await opendir(filePath) 
          await rm(filePath)
          return;
        } catch (error) {
          // ?? Need to fix check if it's directory but not file
          await rmdir(filePath)
          // console.log(error)
          return;
        }
      }
      if (
        fullCommand.startsWith(COMMANDS.OS) &&
        commandValue.toUpperCase().startsWith(OPTIONS.EOL)
      ) {
        const eolINfo = os.EOL
        stdout.write(`${JSON.stringify(eolINfo)}\n`);
        return;
      }
      if(fullCommand.startsWith(COMMANDS.OS) && commandValue.startsWith(OPTIONS.CPUS)){
        const cpus = os.cpus().map(cpu=>cpu.model)
        stdout.write(`Amount of CPUS:${cpus.length}\n`)
        stdout.write(`${cpus.join('\n')}\n`)
        return;
      }
      if(fullCommand.startsWith(COMMANDS.OS) && commandValue.startsWith(OPTIONS.HOMEDIR)){
        const homedir = os.homedir()
        stdout.write(`${homedir}\n`)
        return;
      }

      if(fullCommand.startsWith(COMMANDS.OS)&& commandValue.startsWith(OPTIONS.USERNAME)){
        const currentUserName = os.userInfo()
        stdout.write(`${currentUserName.username}\n`);
        return;
      }
      if(fullCommand.startsWith(COMMANDS.OS) && commandValue.startsWith(OPTIONS.ARCH)){
        const architecture = os.arch()
        stdout.write(`${architecture}\n`)
        return;
      }
      if(fullCommand.startsWith(COMMANDS.HASH)){
        const SHA256 = 'sha256'
        const HEX = 'hex'
        const filePath = join(currentDirectory,commandValue)
        const hash = createHash(SHA256)
        const file = await readFile(filePath)
        hash.update(file)
        const hashInHex = hash.digest(HEX)
        stdout.write(`${hashInHex}\n`);
        return;
      }
      if(fullCommand.startsWith(COMMANDS.COMPRESS)){
        
        console.log(commandValue)
        const file = commandValue.slice(0, commandValue.indexOf(' ')) 
        const compressedFile = commandValue.slice(commandValue.indexOf(' ') + 1, commandValue.length)
        const filePath = join(currentDirectory, file)
        const compressedFilePath = join(currentDirectory, compressedFile)
        const readStream = createReadStream(filePath)
        const brotliCompress = createBrotliCompress()
        const writeStream = createWriteStream(compressedFilePath)
        await pipeline(readStream,brotliCompress, writeStream)
        return;
      }
      if(fullCommand.startsWith(COMMANDS.DECOMPRESS)){
        const compressedFile = commandValue.slice(0, commandValue.indexOf(' ')) 
        const decompressedFile = commandValue.slice(commandValue.indexOf(' ') + 1, commandValue.length) 
        const compressedFilePath = join(currentDirectory, compressedFile)
        const decompressedFilePath = join(currentDirectory, decompressedFile)
        const readStream = createReadStream(compressedFilePath)
        const brotliDecompress = createBrotliDecompress()
        const writeStream = createWriteStream(decompressedFilePath)
        await pipeline(readStream,brotliDecompress,writeStream)
        return;
      }
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