import * as fs from 'fs';
import { Funko } from './funkoInterface';
import {getIds, checkIds} from './utilities2'

import { MongoClient } from 'mongodb';
import { Funko_genre } from './types';

const dbURL = 'mongodb://127.0.0.1:27017';
const dbName = 'Funko-app';

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

  //console.log("entra");
  fs.writeFileSync(newPath, datosJSON);

  // conexion a la bbdd para escribir
  MongoClient.connect(dbURL).then((client) => {
    const db = client.db(dbName);
  
    return db.collection<Funko>(`${user}`).insertOne({
      _owner: user,
      _ownid: funko._ownid,
      _name: funko._name,
      _description: funko._description,
      _type: funko._type,
      _genre: funko._genre,
      _franchise: funko._franchise,
      _franchise_number: funko._franchise_number,
      _exclusive: funko._exclusive,
      _especialCaracteristics: funko._especialCaracteristics,
      _price: funko._price,
    });
  }).then((result) => {
    console.log(result);
  }).catch((error) => {
    console.log(error);
  });
}

/**
 * @description Función que borra un funko por su id
 * @param path -- Path donde se va a crear el funko
 * @param user -- Usuario que crea el funko
 * @param id -- Id del funko
 * 
 */
export function removeFunko(path: string, user: string, funko: Funko) {
  MongoClient.connect(dbURL).then((client) => {
    const db = client.db(dbName);
  
    return db.collection<Funko>(user).deleteOne({
      _ownid: funko._ownid,
    });
  }).then((result) => {
    console.log(result.deletedCount);
  }).catch((error) => {
    console.log(error);
  });
}