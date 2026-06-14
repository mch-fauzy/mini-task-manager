import { IActor } from '../../constants/actor.constant';

export interface IActorV1Response {
    id: string;
    name: string;
}

/** Shapes an actor for the dropdown API: exposes only the id and display name. */
export class ActorV1Response {
    static MapEntity(actor: IActor): IActorV1Response {
        return { id: actor.id, name: actor.name };
    }

    static MapEntities(actors: readonly IActor[]): IActorV1Response[] {
        return actors.map((actor) => this.MapEntity(actor));
    }
}
