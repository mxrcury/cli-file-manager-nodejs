import { stderr } from 'node:process'
import { join } from 'node:path'
import { appendFile } from 'node:fs/promises';
import { OPERATION_FAILED } from '../../constants.js';

export default async (currentDirectory, fileName) => {
    const pathToFile = join(currentDirectory,fileName)
        const emptyData = ''
        try {
          await appendFile(pathToFile,emptyData)
        } catch (error) {
          stderr.write(OPERATION_FAILED);
        }
        return;
}