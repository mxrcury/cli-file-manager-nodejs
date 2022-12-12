import { stderr } from 'node:process';
import { pipeline } from 'node:stream/promises';
import { createWriteStream, createReadStream } from 'node:fs';
import { join } from 'node:path';
import { OPERATION_FAILED } from '../../constants.js';

export default async (currentDirectory, commandValue) => {
    const fileName = commandValue.slice(0, commandValue.indexOf(" "));
        const filePath = join(currentDirectory, fileName);
        const copiedFileName = commandValue.slice(
          commandValue.indexOf(" ") + 1,
          commandValue.length
        );
        const copiedFileNewPath = join(currentDirectory, copiedFileName);

        const readStream = createReadStream(filePath);
        const writeStream = createWriteStream(copiedFileNewPath);
        try {
          pipeline(readStream, writeStream);
        } catch (error) {
          stderr.write(OPERATION_FAILED);
        }
        return;
} 

