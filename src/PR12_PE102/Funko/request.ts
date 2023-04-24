import { isNullOrUndefined } from 'util';
import {Funko} from './funkoInterface'
import {ResponseType} from './types'
import {createJsonFunkoFile, removeFunko} from './utilities'
import {checkUserDirSync, getIds, checkIds} from './utilities2'

import { MongoClient } from 'mongodb';

const dbURL = 'mongodb://127.0.0.1:27017';
const dbName = 'Funko-app';

export const getListRequest = (funko: Funko, callback: (
  err:ResponseType | undefined, data: ResponseType | undefined) => void ) => {

    MongoClient.connect(dbURL).then((client) => {
      const db = client.db(dbName);
    
      return db.collection<Funko>(`${funko._owner}`).find().toArray();
    }).then((result) => {
      console.log(result);
      const response: ResponseType = {
        type: 'list',
        success: true,
        message: 'Funkos listados',
      }
      callback(undefined, response);
    }).catch((error) => {
      console.log(error);
      const error_: ResponseType = {
        type: 'error',
        success: false,
        message: 'Error al listar los funkos',
      }
      callback(error_, undefined);
    });
  };

export const getReadRequest = (funko: Funko, callback: (
  err:ResponseType | undefined, data: ResponseType | undefined) => void ) => {
    if (checkUserDirSync(funko._owner, './database')) {
      MongoClient.connect(dbURL).then((client) => {
        const db = client.db(dbName);
      
        return db.collection<Funko>(`${funko._owner}`).find({
          _ownid: funko._ownid,
        }).toArray();
      }).then((result) => {
        if(result !== null || result !== undefined) {
          console.log(result);
          const response: ResponseType = {
            type: 'read',
            success: true,
            message: 'Funko encontrado',
          };
          callback(undefined, response);
        } else {
          const error_: ResponseType = {
            type: 'error',
            success: false,
            message: 'El funko no existe',
          };
          callback(error_, undefined);
        }
      }).catch((error) => {
        console.log(error);
        const error_: ResponseType = {
          type: 'error',
          success: false,
          message: 'Error al leer el funko',
        }
        callback(error_, undefined);
      });
    } else {
      const error_: ResponseType = {
        type: 'error',
        success: false,
        message: 'El usuario no existe',
      };
      callback(error_, undefined);
    }      
  };

export const postRequest = (funko: Funko, callback: (
  err:ResponseType | undefined, data: ResponseType | undefined) => void ) => {
    //const ids = getIds(`./database/${funko._owner}`);
    if (checkUserDirSync(funko._owner, './database')) {
      if(!funko._ownid || !funko._name || !funko._description || !funko._type || !funko._especialCaracteristics ||!funko._exclusive || !funko._franchise || !funko._franchise_number || !funko._genre || !funko._type ) {
        const error_: ResponseType = {
          type: 'error',
          success: false,
          message: 'No se ha especificado alguno de los parametros del funko',
        };
        callback(error_, undefined);
        return;
      }
      MongoClient.connect(dbURL).then((client) => {
        const db = client.db(dbName);
      
        return db.collection<Funko>(`${funko._owner}`).findOne({
          _ownid: funko._ownid,
        });
      }).then((result) => {
        if (result !== null) {
          //console.log(result);
          const error_: ResponseType = {
            type: 'error',
            success: false,
            message: 'El id ya existe',
          };
          callback(error_, undefined);
        } else {
          //console.log(result)
          createJsonFunkoFile(funko._owner, funko);
          const response: ResponseType = {
            type: 'add',
            success: true,
            message: 'Funko creado',
          };
          callback(undefined, response);
        }
      }).catch((error) => {
        console.log(error);
      });
    } else {
      const error_: ResponseType = {
        type: 'error',
        success: false,
        message: 'El usuario no existe',
      };
      callback(error_, undefined);
    }
  };

export const deleteRequest = (funko: Funko, callback: (
  err:ResponseType | undefined, data: ResponseType | undefined) => void ) => {
    if (checkUserDirSync(funko._owner, './database')) {
      MongoClient.connect(dbURL).then((client) => {
        const db = client.db(dbName);
      
        return db.collection<Funko>(`${funko._owner}`).findOne({
          _ownid: funko._ownid,
        });
      }).then((result) => {
        if (result !== null) {
          removeFunko('./database', funko._owner, funko);
          const response: ResponseType = {
            type: 'add',
            success: true,
            message: 'Funko eliminado',
          };
          callback(undefined, response);
        } else {
          //console.log(result);
          const error_: ResponseType = {
            type: 'error',
            success: false,
            message: 'El id no existe',
          };
          callback(error_, undefined);
          //console.log(result)
        }
      }).catch((error) => {
        console.log(error);
      });
    } else {
      const error_: ResponseType = {
        type: 'error',
        success: false,
        message: 'El usuario no existe',
      };
      callback(error_, undefined);
    }   
  };

export const patchRequest = (funko: Funko, callback: (
  err:ResponseType | undefined, data: ResponseType | undefined) => void ) => {
    if (checkUserDirSync(funko._owner, './database')) {
      if(!funko._ownid) {
        const error_: ResponseType = {
          type: 'error',
          success: false,
          message: 'No se ha especificado el id',
        };
        callback(error_, undefined);
        return;
      } 
      const ids = getIds(`./database/${funko._owner}`);
      //console.log(ids)
      //console.log(funko._id)
      if(checkIds(ids, funko._ownid)) {
        //removeFunko('./database', funko._owner, funko._ownid);
        createJsonFunkoFile(funko._owner, funko);
        const response: ResponseType = {
          type: 'update',
          success: true,
          message: 'Funko actualizado',
        };
        callback(undefined, response);
      } else {
        const error_: ResponseType = {
          type: 'error',
          success: false,
          message: 'El id no existe',
        };
        callback(error_, undefined);
      }
    } else {
      const error_: ResponseType = {
        type: 'error',
        success: false,
        message: 'El usuario no existe',
      };
      callback(error_, undefined);
    }      
  };