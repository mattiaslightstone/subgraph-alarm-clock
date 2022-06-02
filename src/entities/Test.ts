import {Test} from '../../generated/schema';
import { BigInt } from '@graphprotocol/graph-ts';
import {ensureLog} from './Log'

export function ensureTest(id: string): Test{
    let entity = Test.load(id);
    if (!entity) {
        entity = new Test(id);
        entity.save();
    }
    return entity;
}

export function addTest(id: string, type: string, logId: string): Test{
  let entity = ensureTest(id)

  
 entity.type = type
 entity.log = ensureLog(logId).id

  return entity
}
    