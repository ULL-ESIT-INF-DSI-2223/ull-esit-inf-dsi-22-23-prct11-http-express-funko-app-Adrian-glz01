import 'mocha'
import { expect } from 'chai'

import {getIds, checkValidCmd, checkIds, checkUserDirSync} from '../../src/Funko/utilities2'

describe('utilities2.ts', () => {
  describe('getIds', () => {
    it ('Primer test del metodo getIds', () => {
      expect(getIds('./database/Adrian')).to.be.deep.equal([4,"6"]);
    })
    it ('Segundo test del metodo getIds', () => {
      expect(getIds('./database/Eva')).to.be.deep.equal([1,2]);
    })
  })
  describe('checkValidCmd', () => {
    it('should return true if the cmd is valid', () => {
      const validCmds = ['get', 'post', 'delete', 'patch']
      validCmds.forEach((cmd) => {
        expect(checkValidCmd(cmd)).to.be.true
      })
    })
    it('should return false if the cmd is not valid', () => {
      const invalidCmds = ['get1', 'post1', 'delete1', 'patch1']
      invalidCmds.forEach((cmd) => {
        expect(checkValidCmd(cmd)).to.be.false
      })
    })
  })
  describe('checkIds', () => {
    it('should return true if the id is in the array', () => {
      const ids = ['1', '2', '3']
      expect(checkIds(ids, '1')).to.be.true
    })
    it('should return false if the id is not in the array', () => {
      const ids = ['1', '2', '3']
      expect(checkIds(ids, '4')).to.be.false
    })
  })
  describe('checkUserDirSync', () => {
    it('should return true if the user exists', () => {
      expect(checkUserDirSync('Adrian', './database')).to.be.true
    })
    it('should return false if the user does not exist', () => {
      expect(checkUserDirSync('test1', './database')).to.be.false
    })
  })
});
