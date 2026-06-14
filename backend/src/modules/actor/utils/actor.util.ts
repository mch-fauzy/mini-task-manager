import { ACTOR_LIST, IActor } from '../constants/actor.constant';

/** Looks up an actor by id. Returns undefined when the id is not in the predefined list. */
export function findActorById(id: string): IActor | undefined {
    return ACTOR_LIST.find((actor) => actor.id === id);
}
