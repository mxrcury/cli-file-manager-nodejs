import os from 'node:os'
import { stdout } from 'node:process';

export default async () => {
    const eolINfo = os.EOL;
    stdout.write(`${JSON.stringify(eolINfo)}\n`);
    return;
}