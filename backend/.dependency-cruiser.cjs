/**
 * Architecture rules enforced in CI. The point is not to ban cross-module imports
 * but to make a dependency CYCLE impossible to merge, and to lock the
 * layer directions: modules -> shared/infrastructure, never the reverse.
 *
 * @type {import('dependency-cruiser').IConfiguration}
 */
module.exports = {
    forbidden: [
        {
            name: 'no-circular',
            severity: 'error',
            comment:
                'Circular dependency. Break it by moving shared types to shared/, redefining ownership, or using events.',
            from: {},
            to: { circular: true },
        },
        {
            name: 'audit-log-not-to-task',
            severity: 'error',
            comment:
                'audit-log is a downstream sink. Keep it one-way (task -> audit-log) so the two can never form a cycle.',
            from: { path: '^src/modules/audit-log' },
            to: { path: '^src/modules/task' },
        },
        {
            name: 'actor-not-to-task',
            severity: 'error',
            comment:
                'actor is a leaf module. Keep it one-way (task -> actor) so the two can never form a cycle.',
            from: { path: '^src/modules/actor' },
            to: { path: '^src/modules/task' },
        },
        {
            name: 'infrastructure-not-to-modules',
            severity: 'error',
            comment: 'Infrastructure is cross-cutting and must not depend on a business module.',
            from: { path: '^src/infrastructures' },
            to: { path: '^src/modules' },
        },
        {
            name: 'shared-not-to-modules',
            severity: 'error',
            comment: 'shared/ is the bottom layer and must not depend on a business module.',
            from: { path: '^src/shared' },
            to: { path: '^src/modules' },
        },
        {
            name: 'shared-not-to-infrastructure',
            severity: 'error',
            comment: 'shared/ is the bottom layer and must not depend on infrastructure.',
            from: { path: '^src/shared' },
            to: { path: '^src/infrastructures' },
        },
    ],
    options: {
        doNotFollow: { path: 'node_modules' },
        tsConfig: { fileName: 'tsconfig.json' },
        tsPreCompilationDeps: true,
    },
};
