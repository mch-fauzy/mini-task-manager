import { Card } from 'antd';
import { useTaskListParams } from '../hooks/use-task-list-params';
import { useTasks } from '../hooks/use-tasks';
import { TaskCreateForm } from './task-create-form';
import { TaskTable } from './task-table';

export function TaskPage() {
    const [params, setParams] = useTaskListParams();
    const { data, isFetching } = useTasks(params);

    // Phase 6 wires these to the status modal, audit modal, and delete confirm.
    const noop = () => {};

    return (
        <Card>
            <TaskCreateForm />
            <TaskTable
                tasks={data?.data ?? []}
                meta={data?.meta}
                loading={isFetching}
                onPageChange={(page, perPage) => setParams({ page, perPage })}
                onAdvance={noop}
                onViewAudit={noop}
                onDelete={noop}
            />
        </Card>
    );
}
