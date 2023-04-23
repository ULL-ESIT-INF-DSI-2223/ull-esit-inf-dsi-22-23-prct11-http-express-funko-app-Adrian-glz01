import {Funko} from './funkoInterface'
import {ResponseType} from './types'
import {listFunko, findFunkoByID, createJsonFunkoFile, removeFunko} from './utilities'
import {checkUserDirSync, getIds, checkIds} from './utilities2'

export const getListRequest = (funko: Funko, callback: (
  err:ResponseType | undefined, data: ResponseType | undefined) => void ) => {
    if (checkUserDirSync(funko._owner, './database')) {
      const funkoPops: Funko[] = listFunko('./database',funko._owner);
      const response: ResponseType = {
        type: 'list',
        success: true,
        message: 'Lista de Funkos',
        funkoPops: funkoPops,
      };
      callback(undefined, response);
    } else {
      const error_: ResponseType = {
        type: 'error',
        success: false,
        message: 'El usuario no existe',
      };
      callback(error_, undefined);
    }
  };

export const getReadRequest = (funko: Funko, callback: (
  err:ResponseType | undefined, data: ResponseType | undefined) => void ) => {
    if (checkUserDirSync(funko._owner, './database')) {
      if(!funko._id) {
        const error_: ResponseType = {
          type: 'error',
          success: false,
          message: 'No se ha especificado el id',
        };
        callback(error_, undefined);
        return;
      } 
      const ids = getIds(`./database/${funko._owner}`);
      // console.log(ids)
      // console.log(funko._id)
      // console.log(checkIds(ids, funko._id))
      if(checkIds(ids, funko._id)) {
        const funkoPop = findFunkoByID('./database', funko._owner, funko._id);
        const response: ResponseType = {
          type: 'read',
          success: true,
          message: 'Funko encontrado',
          funko: funkoPop,
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

export const postRequest = (funko: Funko, callback: (
  err:ResponseType | undefined, data: ResponseType | undefined) => void ) => {
    const ids = getIds(`./database/${funko._owner}`);
    if (checkUserDirSync(funko._owner, './database')) {
      if(!funko._id || !funko._name || !funko._description || !funko._type || !funko._especialCaracteristics ||!funko._exclusive || !funko._franchise || !funko._franchise_number || !funko._genre || !funko._type ) {
        const error_: ResponseType = {
          type: 'error',
          success: false,
          message: 'No se ha especificado alguno de los parametros del funko',
        };
        callback(error_, undefined);
        return;
      }
      if (checkIds(ids, funko._id)) {
        const error_: ResponseType = {
          type: 'error',
          success: false,
          message: 'El id ya existe',
        };
        callback(error_, undefined);
      } else {
        createJsonFunkoFile(funko._owner, funko);
        const response: ResponseType = {
          type: 'add',
          success: true,
          message: 'Funko creado',
        };
        callback(undefined, response);
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

export const deleteRequest = (funko: Funko, callback: (
  err:ResponseType | undefined, data: ResponseType | undefined) => void ) => {
    if (checkUserDirSync(funko._owner, './database')) {
      if(!funko._id) {
        const error_: ResponseType = {
          type: 'error',
          success: false,
          message: 'No se ha especificado el id',
        };
        callback(error_, undefined);
        return;
      } 
      //console.log(removeFunko('./database', funko._owner, funko._id))
      if(removeFunko('./database', funko._owner, funko._id)) {
        const response: ResponseType = {
          type: 'remove',
          success: true,
          message: 'Funko eliminado',
        };
        callback(undefined, response);
      } else {
        const error_: ResponseType = {
          type: 'error',
          success: false,
          message: 'El id no existe y por ello no se puede eliminar el funko',
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

export const patchRequest = (funko: Funko, callback: (
  err:ResponseType | undefined, data: ResponseType | undefined) => void ) => {
    if (checkUserDirSync(funko._owner, './database')) {
      if(!funko._id) {
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
      if(checkIds(ids, funko._id)) {
        removeFunko('./database', funko._owner, funko._id);
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