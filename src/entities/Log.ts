import {Log} from '../../generated/schema'

export function ensureLog(id: string): Log{
    let entity = Log.load(id);
    if (!entity) {
        entity = new Log(id);
        entity.save();
    }
    return entity;
}
    