import { join } from 'node:path'
import { stderr } from 'node:process'
import { rename } from 'node:fs/promises';
import { OPERATION_FAILED } from '../../constants.js'

export default async (currentDirectory, commandValue) => {
  const oldFileName = commandValue.slice(0, commandValue.indexOf(" "));
  const oldFilePath = join(currentDirectory, oldFileName);
  const newFileName = commandValue.slice(
    commandValue.indexOf(" ") + 1,
    commandValue.length
  );
  const newFilePath = join(currentDirectory, newFileName);
  try {
    await rename(oldFilePath, newFilePath);
  } catch (error) {
    stderr.write(OPERATION_FAILED);
  }
  return;
}