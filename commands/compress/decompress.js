import { createBrotliDecompress } from 'node:zlib';
import { createWriteStream, createReadStream } from 'node:fs';
import { join } from 'node:path';
import { pipeline } from 'node:stream/promises';
import { stderr } from 'node:process';
import { OPERATION_FAILED } from '../../constants.js';

export default async (currentDirectory, commandValue) => {
  const compressedFile = commandValue.slice(0, commandValue.indexOf(" "));
  const decompressedFile = commandValue.slice(
    commandValue.indexOf(" ") + 1,
    commandValue.length
  );
  const compressedFilePath = join(currentDirectory, compressedFile);
  const decompressedFilePath = join(currentDirectory, decompressedFile);
  const readStream = createReadStream(compressedFilePath);
  const brotliDecompress = createBrotliDecompress();
  const writeStream = createWriteStream(decompressedFilePath);
  try {
    await pipeline(readStream, brotliDecompress, writeStream);
  } catch (error) {
    stderr.write(OPERATION_FAILED);
  }
  return;
};