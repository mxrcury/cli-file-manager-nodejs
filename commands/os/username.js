import os from 'node:os';
import { stdout } from 'node:process';

export default async () => {
    const currentUserName =  `${os.userInfo().username}\n` 
    stdout.write(currentUserName);
    return;

}