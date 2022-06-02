import {Log} from '../../generated/schema';
import { BigInt } from '@graphprotocol/graph-ts';

export function ensureLog(id: string): Log{
    let entity = Log.load(id);
    if (!entity) {
        entity = new Log(id);
        entity.save();
    }
    return entity;
}

export function addLog(id: string, timestamp: BigInt, type: string): Log{
  let entity = ensureLog(id)

  
 entity.timestamp = timestamp
 entity.type = type

  return entity
}
    