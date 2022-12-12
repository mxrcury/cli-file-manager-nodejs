import { readdir } from 'node:fs/promises'
import { stderr } from 'process'
import { DIRECTORY, FILE, OPERATION_FAILED } from '../../constants.js'


export default async (currentDirectory)=>{

    try {
        const files = await readdir(currentDirectory,{withFileTypes:true})

        const outputFiles = files.map(file =>{
            return {Name:file.name,Type:file.isDirectory() ? DIRECTORY : FILE}
        })
        console.table(outputFiles)            
      } catch (error) {
        stderr.write(OPERATION_FAILED);
      }
      return;
}