import { isEqual } from "../utils.js";
import { cwd, stdout } from 'node:process';
import {
  getUpperDirectory,
  handleExit,
  changeDirectory,
  getList,
  catFile,
  addFile,
  renameFile,
  copyFile,
  moveFile,
  removeFile,
  getEOL,
  getCPUS,
  getHomedir,
  getUsername,
  getArchitecture,
  hash,
  compress,
  decompress,
} from "./index.js";
import { COMMANDS, INVALID_INPUT } from '../constants.js'

class Commands {
  constructor(username) {
    this.commands = {};
    this.commandValue = ''
    this.commandName = ''
    this.username = username
    this.currentDirectory = cwd()
  }
  async handleCommand(data) {

    const fullCommand = data.toString().trim().toLowerCase();

    this.commandValue = this._checkCommandValue(fullCommand);

    const isCommandEqual = isEqual(this.commandName);
    const isArgumentsEqual = isEqual(this.commandValue);
    this.currentDirectory= cwd();

    const isCommandEmpty = !this.commandName.trim().length;
    if (isCommandEmpty) {
      this._handleWarning();
    }

    if (isCommandEqual(COMMANDS.UP)) {
        this.currentDirectory = getUpperDirectory();
        return;
      }
    if (isCommandEqual(COMMANDS.EXIT)) {
      return handleExit(this.username);
    }
    if (isCommandEqual(COMMANDS.CD)) {
      this.currentDirectory = changeDirectory(this.commandValue);
      return;
    }
    if (isCommandEqual(COMMANDS.LS)) {
      return getList(this.currentDirectory);
    }
    if (isCommandEqual(COMMANDS.CAT)) {
      let path = this.commandValue;
      return catFile(path);
    }
    if (isCommandEqual(COMMANDS.ADD)) {
      let fileName = this.commandValue;
      return addFile(this.currentDirectory, fileName);
    }
    if (isCommandEqual(COMMANDS.RN)) {
      return renameFile(this.currentDirectory, this.commandValue);
    }
    if (isCommandEqual(COMMANDS.CP)) {
      return copyFile(this.currentDirectory, this.commandValue);
    }
    if (isCommandEqual(COMMANDS.MV)) {
      return moveFile(this.currentDirectory, this.commandValue);
    }
    if (isCommandEqual(COMMANDS.RM)) {
      return removeFile(this.currentDirectory, this.commandValue);
    }
    if (isCommandEqual(COMMANDS.OS) && isArgumentsEqual(OPTIONS.EOL)) {
      return getEOL();
    }
    if (isCommandEqual(COMMANDS.OS) && isArgumentsEqual(OPTIONS.CPUS)) {
      return getCPUS();
    }
    if (isCommandEqual(COMMANDS.OS) && isArgumentsEqual(OPTIONS.HOMEDIR)) {
      return getHomedir();
    }

    if (isCommandEqual(COMMANDS.OS) && isArgumentsEqual(OPTIONS.USERNAME)) {
      return getUsername();
    }
    if (isCommandEqual(COMMANDS.OS) && isArgumentsEqual(OPTIONS.ARCH)) {
      return getArchitecture();
    }
    if (isCommandEqual(COMMANDS.HASH)) {
      return hash(this.currentDirectory, this.commandValue);
    }
    if (isCommandEqual(COMMANDS.COMPRESS)) {
      return compress(this.currentDirectory, this.commandValue);
    }
    if (isCommandEqual(COMMANDS.DECOMPRESS)) {
      return decompress(this.currentDirectory, this.commandValue);
    }
    stdout.write(INVALID_INPUT);
  }
  _handleWarning() {
    stdout.write(INVALID_INPUT);
    return;
  }
  _checkCommandValue(command) {
    this.commandName = command.slice(0, ( command.includes(' ') ? command.indexOf(' ') : command.length))
    const hasCommandArgs = command.length - 1 > this.commandName.length
    if (hasCommandArgs) {
      const commandValueStart = command.indexOf(" ") + 1;
      const commandValueEnd = command.length;
      return command.slice(commandValueStart, commandValueEnd);
    } else {
        this.commandName = command
        return "";
    }
  }
}


export default Commands