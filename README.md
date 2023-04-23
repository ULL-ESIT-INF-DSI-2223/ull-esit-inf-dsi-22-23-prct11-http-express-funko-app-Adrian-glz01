[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/8eRVZXt4)

# Informe 

En está práctica pondremos en prácticas los conceptos aprendidos en las clases de teoría sobre el patrón callback y el desarrollo de un servidor web a través de express

Asimismo se hablará del trabajo desarrollado durante la sesión práctica de la asignatura. Concreatemente de la sesión PE 102 de los lunes

## Índice

1. [Aplicación de gestión de funkos](#aplicación-de-gestión-de-funkos)
2. [Ejercicio PE102](#ejercicio-pe102)
2. [Dificultades/Reflexión](#__dificultadesreflexión)
3. [Referencias](#referencias)

## Aplicación de gestión de funkos.

Siguendo la misma aplicacion que semanas anteriores, se pide desarrollar la gestión de funkos medinate el uso de un servidor web express.

Para ello se ha desarrollado el siguiente código:

Interfaz funko:

```ts
/**
 * @description Funko interface
 * @interface Funko
 * @property {number} _id - Funko id
 * @property {string} _name - Funko name
 * @property {string} _description - Funko description
 * @property {Funko_type} _type - Funko type
 * @property {Funko_genre} _genre - Funko genre
 * @property {string} _franchise - Funko franchise
 * @property {number} _franchise_number - Funko franchise number
 * @property {boolean} _exclusive - Funko exclusive
 * @property {string} _especialCaracteristics - Funko especial Caracteristics
 * @property {number} _price - Funko price
 */
export interface Funko {
  _owner: string;
  _id?: string;
  _name?: string;
  _description?: string;
  _type?: string;
  _genre?: string;
  _franchise?: string;
  _franchise_number?: string;
  _exclusive?: string;
  _especialCaracteristics?: string;
  _price?: string;
}
```

Esta interfaz es la que recoge todas las propiedades de un funko. Se ha añadido una propiedad _owner que recoge el id del usuario que ha creado el funko.

Tipos instanciados para la aplicacion:

```ts
/**
 * @description Response type
 */
export type ResponseType = {
  type: 'add' | 'update' | 'remove' | 'read' | 'list' | 'error';
  success: boolean;
  message: string;
  funko?: Funko;
  funkoPops?: Funko[];
}
```

_ResponseType_ es un tipo que recoge los tipos de respuesta que puede devolver el servidor. 

Funciones utilizadas para el desempeño de la aplicacion:

```ts
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
```

Estas han sido las funciones usadas para la gestión de ficheros y directorios. Son las utilizadas en las prácticas anteriores por lo que ya han sido explicadas en sus correspondientes informes.

Finalmente tenemos el código del servidor express:

```ts
const app = express();

app.get('/funkos', (req, res) => {
  // const args:string = req.query.args as string;
  const cmd = req.query.cmd as string;
  const user = req.query.user as string;
  const id = req.query.id as string;
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
        _id: id,
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
        _id: id,
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
        _id: id,
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
          _id: id,
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
```

Tal y como puede observarse se instancia un servidor express que escucha en el puerto 3000. Se ha creado una ruta para la gestión de los comandos que se le pasan por query.

Se recogen todos los parámetros que se le pasan por query y se comprueba que el comando sea válido. En caso de que no lo sea se devuelve un error.

Principalmente se comprueba que el cmd  y el usuario no sean nulos o undefined. El resto de parámetros se comprueban más adelante.

Posteriormente se lleva a cabo toda la gestión de ficheros usando el patrón callback para la gestión de errores y de datos.

Mencionar que las respuestas del servidor son en formato JSON y que se ha definido una ruta por defecto para que en caso de no pasar ningun ruta para la gestión de ficheros (en nuestro caso '/funkos') se emita un error 404.

## Ejercicio PE102

Se nos ha solicitado desarrollar un servidor express para ejecutar comandos haciendo uso de childprocess como spawn para su ejecución.

El código llevado a cabo ha sido el siguiente:

```ts
const app = express();

app.get('/execmd', (req, res) => {
  const cmd = req.query.cmd as string;
  const args:string = req.query.args as string;

  //console.log('cmd: ', cmd);
  //console.log('args: ', args);

  //? GESTIONAMOS QUE ESTAS VARIABLES SEAN UNDEFINED O NULAS
  if (!cmd /*|| !args*/) {
    res.send({
      error:
        {
          Title: 'Error',
          Message: 'No se ha especificado el comando'
        }
    })
    return;
  }

  let child;

  if (!args) {
    child = spawn(cmd);
  } else {
    child = spawn(cmd, args.split(' '));
  }
  //const child = spawn(cmd, args.split(' '));

  let dataToSend = '';
  let errorToSend = '';

  child.stdout.on('data', (data) => {
    dataToSend += data.toString();
  });

  child.stderr.on('data', (data) => {
    errorToSend += data.toString();
  });

  child.on('error', (err) => {
    errorToSend += err;
  });

  child.on('close', (code) => {
    if (dataToSend.length > 0) {
      res.send({
        data: {
          title: 'Ejecución satisfactoria',
          succes: true,
          output: dataToSend
        }
      });
      return;
    } else if (errorToSend.length > 0) {
      res.send({
        error: {
          title: 'Error',
          succes: false,
          message: errorToSend
        }
      });
      return;
    }
  });
});

//? CONTROLAMOS LA ENTRADA DE UNA RUTA NO VALIDA
app.get('/*', (_, res) => {
  res.status(404).send('<h1>404 Not Found</h1>');
});

//? PUERTO DE ESCUCHA
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

Tal y como puede observarse se ha instanciado un servidor express y mediante la petición get se ha solicitado la ejecución de un comando. Para ello se ha hecho uso de la librería childprocess y su método spawn.

Pero primero se comprueba que el comando no sea nulo o undefined, en caso de serlo se devuelve un error mediante un fichero json. En caso de no serlo se procede a ejecutar el comando.

Primero se declara una string vacía que almacenará la salida del comando y otra que almacenará los errores que se puedan producir durante la ejecución del mismo.

Mediante eventos on 'data' se va almacenando la salida del comando y los errores que se puedan producir. Despuesse comprueba cuales de las dos variables no es vacía y se ejecuta la función send de express para devolver un json con la salida del comando o los errores que se hayan producido.

## __Dificultades/Reflexión__

Al igual que en la anterior práctica, lo peor que he llevado en esta es el tiempo, no puedo realizar las cosas de la manera en la que me gusta debido a que no tengo tiempo suficiente para dedicarle y he tenido que salir del paso como en la pr 10 haciendo uso de api sincrona de node.js.

Esta semana he tenido que dedicarle un par de horas extras al trabajo para no tener que trabajar en la primera semana de mayo y así poder terminar todas las entregas finales que hay que desarrollar esa semana. Muy a mi pesar he tenido que dejar de lado el realizar estas prácticas como me gustaría.

## Referencias

[Guión pr11](https://ull-esit-inf-dsi-2223.github.io/prct11-http-express-funko-app/)

[Apuntes bloque 2 de la asignatura](https://ull-esit-inf-dsi-2223.github.io/nodejs-theory/)

[Coveralls](https://coveralls.io/)

[SonarCloud](https://sonarcloud.io/explore/projects)

[Documentación NODE.js](https://nodejs.org/docs/latest-v19.x/api/fs.html)

