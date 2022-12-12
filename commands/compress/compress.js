import { createBrotliCompress } from 'node:zlib';
import { createWriteStream, createReadStream } from 'node:fs';
import { join } from 'node:path';
import { pipeline } from 'node:stream/promises';
import { stderr } from 'node:process';
import { OPERATION_FAILED } from '../../constants.js';

export default async (currentDirectory, commandValue) => {
    const file = commandValue.slice(0, commandValue.indexOf(' ')) 
        const compressedFile = commandValue.slice(commandValue.indexOf(' ') + 1, commandValue.length)
        const filePath = join(currentDirectory, file)
        const compressedFilePath = join(currentDirectory, compressedFile)
        const readStream = createReadStream(filePath)
        const brotliCompress = createBrotliCompress()
        const writeStream = createWriteStream(compressedFilePath)
        try {
          await pipeline(readStream,brotliCompress, writeStream)          
        } catch (error) {
          stderr.write(OPERATION_FAILED);
        }
        return;
}