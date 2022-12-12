import os from 'node:os'
import { stdout } from 'node:process';

export default async () => {
    const homedir = `${os.homedir()}\n`;
    stdout.write(homedir);
    return;
}