import {LastRun} from '../../generated/schema'

export function ensureLastRun(id: string): LastRun{
    let entity = LastRun.load(id);
    if (!entity) {
        entity = new LastRun(id);
        entity.save();
    }
    return entity;
}
    