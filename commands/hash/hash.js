import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { stderr, stdout } from 'node:process';
import { readFile } from 'node:fs/promises';
import { OPERATION_FAILED } from '../../constants.js';



export default async (currentDirectory, commandValue) => {
    const SHA256 = 'sha256'
        const HEX = 'hex'
        const filePath = join(currentDirectory,commandValue)
        const hash = createHash(SHA256)
        try {
          const file = await readFile(filePath)
          hash.update(file)
          const hashInHex = hash.digest(HEX)
          stdout.write(`${hashInHex}\n`);            
        } catch (error) {
          stderr.write(OPERATION_FAILED);
        }
        return;
}