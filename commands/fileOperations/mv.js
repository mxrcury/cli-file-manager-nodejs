import { createReadStream, createWriteStream } from 'node:fs';
import { rm } from 'node:fs/promises';
import { stderr } from 'node:process'
import { pipeline } from 'node:stream/promises';
import { join } from 'node:path';
import { OPERATION_FAILED } from '../../constants.js';


export default async (currentDirectory, commandValue) => {
  const fileName = commandValue.slice(0, commandValue.indexOf(" "));
  const filePath = join(currentDirectory, fileName);
  const copiedDirectory = commandValue.slice(
    commandValue.indexOf(" ") + 1,
    commandValue.length
  );
  const copiedFileName = fileName;
  const copiedFileNewPath = join(
    currentDirectory,
    copiedDirectory,
    copiedFileName
  );

  const readStream = createReadStream(filePath);
  const writeStream = createWriteStream(copiedFileNewPath);
  try {
    await pipeline(readStream, writeStream);
    await rm(filePath);
    return;
  } catch (error) {
    stderr.write(OPERATION_FAILED);
  }
};
