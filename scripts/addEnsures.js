const { kStringMaxLength } = require("node:buffer");
const fs = require("node:fs/promises");

const test = async () => {
    fs.mkdir('./src/entities', { recursive: true }, (err) => {
        if (err) throw err;
    });

    const classes = await getClasses(processClass);
    for (i in classes){
      processClass(classes[i])
    }
}

const getClasses = async (callback) => {
    const file = await fs.readFile('./schema.graphql', "utf-8");
    const regex = RegExp(/type ([\w\d]*) @entity \{([\w\W]*?)\}/g)
    let cls;
    const classes = []
    do {
        cls = regex.exec(file)
        if(cls !== null){
            classes.push(
              {
                class: cls[1],
                paramList: cls[2]
              }
            )
        }
    } while (cls !== null)
    return classes
}

const getParams = async (className) => {
  const paramRegex = RegExp(/\b([\w\d]*?)\: ([\!\[\]\w\d]*)\b/g);
  const params = []
  let currParam;
  do {
    currParam = paramRegex.exec(className);
    if(currParam !== null){
      params.push({
        name: currParam[1],
        type: currParam[2],
      })
    }
  } while (currParam !== null)
  return params;
}

const processClass = async (cls) => {
  const params = await getParams(cls.paramList);
  const className = cls.class
  let paramString = '';
  let importString = '';
  let paramInputString = 'id: string';
  for (i in params){ 
    let param = params[i]
    const typeObj = getType(param.type);
    const array = typeObj.array;
    const type = typeObj.type;
    const paramName = param.name;
    if (paramName === 'id'){
      continue;
    }
    if (array){
        paramString = paramString.concat(`\n entity.${paramName} = []`)
    } else {
      if (!["string", "BigInt", "number", "Bytes", "boolean", "BigDecimal"].includes(type)){
        paramInputString = paramInputString.concat(`, ${paramName}Id: string`)

        paramString = paramString.concat(`\n entity.${paramName} = ensure${type}(${paramName}Id).id`)

        importString = importString.concat(`\nimport {ensure${type}} from './${type}'`);
      } else {
        paramInputString = paramInputString.concat(`, ${paramName}: ${type}`)

        paramString = paramString.concat(`\n entity.${paramName} = ${paramName}`)
      }
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

const getType = (rawType) => {
  if (rawType.includes("[")){
    const type = rawType.replace("[","");
    return {
      type: getType(type),
      array: true
    }
  }

  switch(rawType) {
    case "ID":
      return {
        type: "string",
        array: false
      }
    case "String":
      return {
        type: "string",
        array: false
      }
    case "BigInt":
      return {
        type: "BigInt",
        array: false
      }
    case "BigDecimal":
      return {
        type: "BigDecimal",
        array: false
      }
    case "Bytes":
      return {
        type: "Bytes",
        array: false
      }
    case "Int":
      return {
        type: "number",
        array: false
      }
    case "Boolean":
      return {
        type: "number",
        array: false
      }
    default:
      return {
        type: rawType,
        array: false
      }
  }
}

test();