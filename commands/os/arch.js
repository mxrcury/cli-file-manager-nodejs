import { stdout } from "node:process";
import os from "node:os";

export default async () => {
  const architecture = `${os.arch()}\n`;
  stdout.write(architecture);
  return;
};
