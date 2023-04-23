import * as express from 'express';
import {spawn} from 'child_process';

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
