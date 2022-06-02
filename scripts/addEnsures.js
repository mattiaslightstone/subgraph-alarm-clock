const fs = require("node:fs/promises");

const test = async () => {
    fs.mkdir('./src/entities', { recursive: true }, (err) => {
        if (err) throw err;
    });

    const classNames = await getClasses(processClassName);
    for (i in classNames){
      processClassName(classNames[i])
    }
}

const getClasses = async (callback) => {
    const file = await fs.readFile('./generated/schema.ts', "utf-8");
    const regex = RegExp(/class ([\w\d\S]*) /g)
    let className;
    const classNames = []
    do {
        className = regex.exec(file)
        if(className !== null){
            classNames.push(className[1])
        }
    } while (className !== null)
    return classNames
}

const getParams = async (className) => {
  const file = await fs.readFile('./generated/schema.ts', "utf-8");
  const classRegex = RegExp(String.raw`(?<=${className} extends Entity) \{([\s\S])*?(?=export class [\w\d]* extends Entity|$)`, 'g')
  const functions = classRegex.exec(file);
  const paramRegex = RegExp(/get ([\w\d]*)\(\)\: ([\w\d]*) \{/g);
  const params = []
  let currParam;
  do {
    currParam = paramRegex.exec(functions[0]);
    if(currParam !== null){
      params.push({
        name: currParam[1],
        type: currParam[2],
      })
    }
  } while (currParam !== null)
  return params;
}

const processClassName = async (className) => {
  const params = await getParams(className);
  let paramString = '';
  let importString = '';
  let paramInputString = 'id: string';
  for (i in params){ 
    let param = params[i]
    if (param.name === 'id'){
      continue;
    }
    if (!["string", "BigInt", "number", "Bytes"].includes(param.type)){
      paramInputString = paramInputString.concat(`${param.name}Id: string, `)

      paramString = paramString.concat(`\n entity.${param.name} = ensure${param.type}(${param.name}Id)`)

      importString = importString.concat(`\nimport {ensure${className}} from './${className}'`);
    } else {
      paramInputString = paramInputString.concat(`, ${param.name}: ${param.type}`)

      paramString = paramString.concat(`\n entity.${param.name} = ${param.name}`)
    }
  }

    const schemaContent = `import {${className}} from '../../generated/schema';
import { BigInt } from '@graphprotocol/graph-ts';${importString}

export function ensure${className}(id: string): ${className}{
    let entity = ${className}.load(id);
    if (!entity) {
        entity = new ${className}(id);
        entity.save();
    }
    return entity;
}

export function add${className}(${paramInputString}): ${className}{
  let entity = ensure${className}(id)

  ${paramString}

  return entity
}
    `
    fs.writeFile(`./src/entities/${className}.ts`, schemaContent)

}

test();