const fs = require("node:fs/promises");

const test = async () => {
    fs.mkdir('./src/entities', { recursive: true }, (err) => {
        if (err) throw err;
    });


    const file = await fs.readFile('./generated/schema.ts', "utf-8");
    const regex = RegExp(/class ([\w\d\S]*) /g)
    let className;
    do {
        className = regex.exec(file)
        if(className !== null){
            processClassName(className[1])
        }
    } while (className !== null)
}

const processClassName = async (className) => {
    const schemaContent = `import {${className}} from '../../generated/schema'

export function ensure${className}(id: string): ${className}{
    let entity = ${className}.load(id);
    if (!entity) {
        entity = new ${className}(id);
        entity.save();
    }
    return entity;
}
    `
    fs.writeFile(`./src/entities/${className}.ts`, schemaContent)
}

test();

var _cls_ = {};
function getClass(name){
  if (!_cls_[name]) {
    // cache is not ready, fill it up
    if (name.match(/^[a-zA-Z0-9_]+$/)) {
      // proceed only if the name is a single word string
      _cls_[name] = eval(name);
    } else {
      // arbitrary code is detected 
      throw new Error("Who let the dogs out?");
    }
  }
  return _cls_[name];
}