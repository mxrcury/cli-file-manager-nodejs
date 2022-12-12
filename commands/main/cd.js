import { chdir, cwd, stderr } from 'node:process'
import { OPERATION_FAILED } from '../../constants.js';

export default (path) =>{
  let currentDirectory;  
  try {
        chdir(path);
        currentDirectory = cwd()
      } catch (error) {
        stderr.write(OPERATION_FAILED);
      }
      return currentDirectory
}