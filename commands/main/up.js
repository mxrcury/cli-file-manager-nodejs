import { chdir, stderr, cwd } from 'node:process';
import { OPERATION_FAILED } from '../../constants.js';

export default ()=>{
    const upperDirectory = "../";
    let currentDirectory;  
        try {
          chdir(upperDirectory);
          currentDirectory = cwd()
        } catch (error) {
          stderr.write(OPERATION_FAILED);
        }
        return currentDirectory;
}