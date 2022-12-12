import { join } from 'node:path';
import { rm, rmdir } from 'node:fs/promises';
import { stderr } from 'node:process';
import { OPERATION_FAILED } from '../../constants.js';
import { isDirectory } from '../../utils.js';


export default async (currentDirectory, commandValue) => {
  const filePath = join(currentDirectory, commandValue);
  if ( await isDirectory(filePath)) {
    try {
      await rmdir(filePath);
    } catch (error) {
      stderr.write(OPERATION_FAILED);
    }
  } else {
    try {
      await rm(filePath);
    } catch (error) {
      stderr.write(OPERATION_FAILED);
    }
  }
  return;
};