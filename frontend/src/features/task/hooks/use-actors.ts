import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../../../shared/constants/query-keys.constant';
import { actorService } from '../services/actor.service';

// Actors are a hardcoded backend list, so cache them indefinitely for the session.
export function useActors() {
    return useQuery({ queryKey: queryKeys.actors.all, queryFn: () => actorService.list(), staleTime: Infinity });
}
