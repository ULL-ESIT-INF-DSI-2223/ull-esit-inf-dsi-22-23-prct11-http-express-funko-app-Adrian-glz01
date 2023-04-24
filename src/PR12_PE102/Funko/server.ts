import * as express from 'express';
import { ResponseType } from './types';
import { checkValidCmd } from './utilities2';
import { Funko } from './funkoInterface';
import { userExistOnBD} from './utilities';
import { getListRequest, getReadRequest, postRequest, deleteRequest, patchRequest } from './request';

const app = express();

app.get('/funkos', (req, res) => {
  // const args:string = req.query.args as string;
  const cmd = req.query.cmd as string;
  const user = req.query.user as string;
  const id = req.query.ownid as string;
  const name = req.query.name as string;
  const description = req.query.description as string;
  const type = req.query.type as string;
  const genre = req.query.genre as string;
  const franchise = req.query.franchise as string;
  const franchise_number = req.query.franchise_number as string;
  const exclusive = req.query.exclusive as string;
  const especialCar = req.query.especialCar as string;
  const price = req.query.price as string;

  // nos aseguramos de que llegue algún comando
  if (!cmd) {
    const response: ResponseType = {
      type: 'error',
      success: false,
      message: 'No se ha especificado el comando',
    };
    res.send(response);
    return;
  }

  if(!user) {
    const response: ResponseType = {
      type: 'error',
      success: false,
      message: 'No se ha especificado el usuario',
    };
    res.send(response);
    return;
  }

  //? COMPROBAMOS QUE EL USUARIO EXISTE
  userExistOnBD(`./database/${user}`, (exists) => {
    if(!exists) {
      const response: ResponseType = {
        type: 'error',
        success: false,
        message: 'El usuario no existe',
      };
      res.send(response);
      return;
    } else {
      // console.log("el usuario existe");
    }
  });

  if (checkValidCmd(cmd)) {
    if(cmd === 'post') {
      const funko: Funko = {
        _owner : user,
        _ownid: id,
        _name: name,
        _description: description,
        _type: type,
        _genre: genre,
        _franchise: franchise,
        _franchise_number: franchise_number,
        _exclusive: exclusive,
        _especialCaracteristics: especialCar,
        _price: price,
      };
      postRequest(funko, (err,data) => {
        if(err) {
          res.send(err);
          return;
        } else {
          res.send(data);
          return;
        }
      });
    } else if(cmd === 'delete') {
      const funko: Funko = {
        _owner : user,
        _ownid: id,
      };
      deleteRequest(funko, (err,data) => {
        if(err) {
          res.send(err);
          return;
        } else {
          res.send(data);
          return;
        }
      });
    } else if (cmd === 'patch') {
      const funko: Funko = {
        _owner : user,
        _ownid: id,
        _name: name,
        _description: description,
        _type: type,
        _genre: genre,
        _franchise: franchise,
        _franchise_number: franchise_number,
        _exclusive: exclusive,
        _especialCaracteristics: especialCar,
        _price: price,
      };
      patchRequest(funko, (err,data) => {
        if(err) {
          res.send(err);
          return;
        } else {
          res.send(data);
          return;
        }
      });
    } else if(cmd === 'get') {
      if (!id) {
        const funko: Funko = {
          _owner : user,
        };
        getListRequest(funko, (err,data) => {
          if(err) {
            res.send(err);
            return;
          } else {
            res.send(data);
            return;
          }
        });
      } else {
        const funko: Funko = {
          _owner : user,
          _ownid: id,
        };
        getReadRequest(funko, (err,data) => {
          if(err) {
            res.send(err);
            return;
          } else {
            res.send(data);
            return;
          }
        });
      }
    }
  } else {
    const response: ResponseType = {
      type: 'error',
      success: false,
      message: 'Comando no válido',
    };
    res.send(response);
  }
});

//? CONTROLAMOS LA ENTRADA DE UNA RUTA NO VALIDA
app.get('/*', (_, res) => {
  res.status(404).send('<h1>404 Not Found</h1>');
});

//? PUERTO DE ESCUCHA
app.listen(3000, () => {
  console.log('Server running on port 3000');
});