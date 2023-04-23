import * as fs from 'fs';
import { Funko } from './funkoInterface';
import {getIds, checkIds} from './utilities2'

/**
 * @description Función que comprueba si un usuario existe en la base de datos
 * @description Haciendo uso de lo aprendido en el ejercicio 1 de esta práctica
 * @param filePath 
 * @param callback 
 */
export function userExistOnBD(filePath: string, callback: (exists: boolean) => void): void {
  fs.access(filePath, fs.constants.F_OK, (err) => {
  if (err) {
    callback(false);
  } else {
    callback(true);
  }
  });
}

/**
 * Función que lista los funkos de un usuario
 * @param path -- Path donde se va a crear el funko
 * @param user -- Usuario que crea el funko
 */
export function listFunko(path: string, user: string): Funko[] {
  const newPath = `${path}/${user}`;
  const files = fs.readdirSync(newPath).filter((file) => file.endsWith('.json'));

  const funkos: Funko[] = [];
  files.forEach((file) => {
    const data = fs.readFileSync(`${newPath}/${file}`, 'utf-8');
    const jsonData = JSON.parse(data);
    funkos.push(jsonData);
  });
  return funkos;
}

/**
 * @description Función que busca un funko por su id
 * @param path -- Path donde se va a crear el funko
 * @param user -- Usuario que crea el funko
 * @param id -- Id del funko
 */
export function findFunkoByID(path: string, user: string, id: string): Funko {
  const newPath = `${path}/${user}`;
  let funko: Funko = {
    _owner: user,
    _description: 'Se ha decidido buscar un funko por su id',
  }

  const files = fs.readdirSync(newPath).filter((file) => file.endsWith('.json'));
    files.forEach((file) => {
      const data = fs.readFileSync(`${newPath}/${file}`, 'utf-8');
      const jsonData = JSON.parse(data);

      if (jsonData.id === id) {
        funko = jsonData;
      }
  });
  return funko;
}

/**
 * @description Función que genera un fichero JSON con la información del funko
 * @param funko 
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createJsonFunkoFile(user:string, funko: Funko): void {
  const datosJSON = JSON.stringify(funko);
  // creamos el path donde se va a crear el fichero con el nombre del funko y extension .json
  const newPath = `./database/${user}/${funko._name}.json`; 

  fs.writeFileSync(newPath, datosJSON);
}

/**
 * @description Función que borra un funko por su id
 * @param path -- Path donde se va a crear el funko
 * @param user -- Usuario que crea el funko
 * @param id -- Id del funko
 * 
 */
export function removeFunko(path: string, user: string, id: string): boolean{
  const newPath = `${path}/${user}`;
  const ids = getIds(newPath);

  if (checkIds(ids, id)) {
    const files = fs.readdirSync(newPath).filter((file) => file.endsWith('.json'));
    files.forEach((file) => {
      const data = fs.readFileSync(`${newPath}/${file}`, 'utf-8');
      const jsonData = JSON.parse(data);

      if (jsonData._id == id) {
        // console.log("Entra aqui")
        const newpath_and_file = `${newPath}/${file}`;
        //console.log("borra")
        fs.unlinkSync(newpath_and_file);
      }
    });
    // console.log("Funko eliminado correctamente");
    return true;
  } else {
    return false;
  }
}