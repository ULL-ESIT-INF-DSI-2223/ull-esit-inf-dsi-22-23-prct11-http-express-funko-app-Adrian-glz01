import 'mocha'
import { expect } from 'chai'

import { getListRequest, getReadRequest, postRequest, deleteRequest, patchRequest } from '../../src/Funko/request';

describe('Funko Request', () => {

  //* GET_LIST
  it('GetListRequest succes == error', (done) => {
    const funko = {
      _owner: 'test',
    };
    getListRequest(funko, (err, data) => {
      if (err) {
        expect(err.success).to.be.false;
        expect(err.type).to.be.equal('error');
        expect(err.message).to.be.equal('El usuario no existe');
        done();
      } else if(data) {
        expect(data.success).to.be.true;
        done();
      }
    });
  });
  it ('GetListRequest succesfuly', (done) => {
    const funko = {
      _owner: 'Adrian',
    };
    getListRequest(funko, (err, data) => {
      if (err) {
        expect(err.success).to.be.false;
        expect(err.type).to.be.equal('error');
        expect(err.message).to.be.equal('El usuario no existe');
        done();
      } else if(data) {
        expect(data.success).to.be.true;
        done();
      }
    });
  });

  //* GET_READ
  it('GetReadRequest succes == error', (done) => {
    const funko = {
      _owner: 'test',
      _id: 'test',
    };
    getReadRequest(funko, (err, data) => {
      if (err) {
        expect(err.success).to.be.false;
        expect(err.type).to.be.equal('error');
        expect(err.message).to.be.equal('El usuario no existe');
        done();
      } else if(data) {
        expect(data.success).to.be.true;
        done();
      }
    });
  });
  it ('GetReadRequest succesfuly', (done) => {
    const funko = {
      _owner: 'Adrian',
      _id: '2',
    };
    getReadRequest(funko, (err, data) => {
      if (err) {
        expect(err.success).to.be.false;
        expect(err.type).to.be.equal('error');
        expect(err.message).to.be.equal('El id no existe');
        done();
      } else if(data) {
        expect(data.success).to.be.true;
        //expect(data.message).to.be.an('funko encontrado');
        done();
      }
    });
  });

  //* POST
  it('PostRequest succes == error', (done) => {
    const funko = {
      _owner: 'Adrian',
      _id: '10',
      _name: 'test',
      _description: 'test',
      _type: 'test',
      _genre: 'test',
      _franchise: 'test',
      _franchise_number: 'test',
      _especialCaracteristics: 'test',
      _price: 'test',
    };
    postRequest(funko, (err, data) => {
      if (err) {
        expect(err.success).to.be.false;
        expect(err.type).to.be.equal('error');
        expect(err.message).to.be.equal('No se ha especificado alguno de los parametros del funko');
        done();
      } else if(data) {
        expect(data.success).to.be.true;
        done();
      }
    });
  });
  it ('PostRequest succesfuly', (done) => {
    const funko = {
      _owner: 'Adrian',
      _id: '2',
    };
    postRequest(funko, (err, data) => {
      if (err) {
        expect(err.success).to.be.false;
        expect(err.type).to.be.equal('error');
        expect(err.message).to.be.equal('No se ha especificado alguno de los parametros del funko');
        done();
      } else if(data) {
        expect(data.success).to.be.true;
        //expect(data.message).to.be.an('funko encontrado');
        done();
      }
    });
  });

  //* DELETE
  it('DeleteRequest succes == error', (done) => {
    const funko = {
      _owner: 'test',
      _id: 'test',
    };
    deleteRequest(funko, (err, data) => {
      if (err) {
        expect(err.success).to.be.false;
        expect(err.type).to.be.equal('error');
        expect(err.message).to.be.equal('El usuario no existe');
        done();
      } else if(data) {
        expect(data.success).to.be.true;
        done();
      }
    });
  });
  it ('DeleteRequest succesfuly', (done) => {
    const funko = {
      _owner: 'Adrian',
      _id: '2',
    };
    deleteRequest(funko, (err, data) => {
      if (err) {
        expect(err.success).to.be.false;
        expect(err.type).to.be.equal('error');
        expect(err.message).to.be.equal('El id no existe y por ello no se puede eliminar el funko');
        done();
      } else if(data) {
        expect(data.success).to.be.true;
        //expect(data.message).to.be.an('funko encontrado');
        done();
      }
    });
  });

  //* PATCH
  it('PatchRequest succes == error', (done) => {
    const funko = {
      _owner: 'test',
      _id: 'test',
    };
    patchRequest(funko, (err, data) => {
      if (err) {
        expect(err.success).to.be.false;
        expect(err.type).to.be.equal('error');
        expect(err.message).to.be.equal('El usuario no existe');
        done();
      } else if(data) {
        expect(data.success).to.be.true;
        done();
      }
    });
  });
  it ('PatchRequest succesfuly', (done) => {
    const funko = {
      _owner: 'Adrian',
      _id: '2',
    };
    patchRequest(funko, (err, data) => {
      if (err) {
        expect(err.success).to.be.false;
        expect(err.type).to.be.equal('error');
        expect(err.message).to.be.equal('El id no existe');
        done();
      } else if(data) {
        expect(data.success).to.be.true;
        //expect(data.message).to.be.an('funko encontrado');
        done();
      }
    });
  });

});
