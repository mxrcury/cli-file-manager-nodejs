import { stdout } from 'node:process'
import os from 'node:os'

export default async () => {
    const cpus = os.cpus().map((cpu) => cpu.model);
    stdout.write(`Amount of CPUS:${cpus.length}\n`);
    const cpusListString = `${cpus.join("\n")}\n`;
    stdout.write(cpusListString);
    return;
}