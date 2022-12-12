import { stdout, exit } from 'node:process'

export default (username)=>{
    stdout.write(
        `Thank you for using File Manager, ${username}, goodbye!\n`
      );
      exit();
}