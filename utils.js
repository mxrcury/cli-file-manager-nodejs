import { argv } from 'node:process';
import { opendir } from 'node:fs/promises';


const parseArgs = async () => {
    let argValue;
    // ? argName - for check value of specific prop names, not only one like --your_username
    // let argName
    let argStartPoint;
    let argEndPoint;
    const commandArgs = argv.filter(arg=>arg.startsWith('--'))
    for (let i = 0; i < commandArgs.length; i++) {
        argStartPoint = commandArgs[i].indexOf("=") + 1;
        argEndPoint = commandArgs[i].length;
        argValue = commandArgs[i].slice(argStartPoint, argEndPoint);
        commandArgs[i] = argValue;
    }
    return commandArgs
}

const isDirectory = async (path) => {
    let status = true
    try {
        await opendir(path)

    } catch (error) {
        status = false
    }
    return status
}

const isEqual = (commandName) => {
    return (command)=>{
        return commandName.toLowerCase().startsWith(command.toLowerCase())
    }
}

export { parseArgs,isDirectory, isEqual }