import {LastRun} from '../../generated/schema';
import { BigInt } from '@graphprotocol/graph-ts';

export function ensureLastRun(id: string): LastRun{
    let entity = LastRun.load(id);
    if (!entity) {
        entity = new LastRun(id);
        entity.save();
    }
    return entity;
}

export function addLastRun(id: string, timestamp: BigInt, block: BigInt): LastRun{
  let entity = ensureLastRun(id)

  
 entity.timestamp = timestamp
 entity.block = block

  return entity
}
    