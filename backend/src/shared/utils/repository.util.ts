import { ObjectLiteral, QueryRunner, Repository } from 'typeorm';

/**
 * Returns the transaction-scoped repository when a queryRunner is given, otherwise the
 * default repository. Lets a repository method join an open transaction without a
 * separate code path, so a status update and its audit insert can share one transaction.
 */
export function scopedRepository<T extends ObjectLiteral>(
    defaultRepo: Repository<T>,
    queryRunner?: QueryRunner,
): Repository<T> {
    return queryRunner ? queryRunner.manager.getRepository<T>(defaultRepo.target) : defaultRepo;
}
