import * as fs from 'fs';

/**
 * @description Función que comprueba si el id del funko es unico
 * @param path -- Path donde se va a crear el funko
 */
export function getIds(path:string): string[] {
  const files = fs.readdirSync(path).filter((file) => file.endsWith('.json')); // nos aseguramos que los ficheros leidos son solo los .json, para curarme en salud
  const ids: string[] = []; // array donde almacenaremos los ids de los funkos del usuario

  files.forEach((file) => {
    const content = fs.readFileSync(`${path}/${file}`);
    const funkoData = JSON.parse(content.toString());
    // console.log(funkoData.id);
    ids.push(funkoData._id);
  });

  // console.log(ids);
  return ids;
}

/**
 * @description Función que comprueba si el id del funko es unico
 * @param path -- Path donde se va a crear el funko
 */
export function checkValidCmd(cmd: string): boolean {
  if (cmd === 'get' || cmd === 'post' || cmd === 'delete' || cmd === 'patch') {
    return true;
  }
  return false;
}

/**
 * @description Función que comprueba si el id del funko existe en el array de ids
 */
export function checkIds(ids: string[], id: string): boolean {
  for (let i = 0; i < ids.length; i++) {
    //console.log( ids[i] + " " + id)
    if (ids[i] == id) {
      return true;
    }
  }
  return false;
}

/**
 * @Description Funcion que verifica si existe un directorio con el nombre del usuario en la base de datos
 * @param userNAme -- Nombre del usuario
 * @param path -- Path donde se va a buscar el directorio
 */
export function checkUserDirSync(userName: string, path: string) : boolean {
  // Leemos el directorio y almacenamos en una variable los archivos dentro de ella
  //? Tener en cuenta que pueden ser carpetas o archivos, para no olvidarme de manejar esto despues... 
  const pathDirectories = fs.readdirSync(path); 

  // variable booleana para retornar si existe o no el directorio
  //? lstatSync Mediante esta funcion podemos saber si es un directorio o un archivo, en caso de ser un archivo se retornara false
  const existDir = pathDirectories.some((dir) => dir === userName && fs.lstatSync(`${path}/${dir}`).isDirectory()) 

  return existDir;
}