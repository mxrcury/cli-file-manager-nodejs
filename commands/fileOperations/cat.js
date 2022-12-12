import { createReadStream } from 'node:fs';
import { stdout, stderr } from 'node:process'
import { OPERATION_FAILED } from '../../constants.js'

export default async (path) => {
  
  const filePath = path;
  const readStream = createReadStream(filePath);
  
  try {
    readStream.on("readable", () => {
      let data = readStream.read();
      if (data !== null) {
        data = data.toString();
        stdout.write(`${data}\n`);
      }
    });
  } catch (error) {
    stderr.write(OPERATION_FAILED);
  }
  return;
};