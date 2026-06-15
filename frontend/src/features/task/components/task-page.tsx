import { useState } from 'react';
import { App, Card, Modal } from 'antd';
import { useDeleteTask } from '../hooks/use-delete-task';
import { useTaskListParams } from '../hooks/use-task-list-params';
import { useTasks } from '../hooks/use-tasks';
import { ITask } from '../types/task.types';
import { AuditLogModal } from './audit-log-modal';
import { TaskCreateForm } from './task-create-form';
import { TaskStatusSelect } from './task-status-select';
import { TaskTable } from './task-table';

export function TaskPage() {
    const { modal, message } = App.useApp();
    const [params, setParams] = useTaskListParams();
    const { data, isFetching } = useTasks(params);
    const deleteTask = useDeleteTask();

    const [statusTask, setStatusTask] = useState<ITask | null>(null);
    const [auditTaskId, setAuditTaskId] = useState<string | null>(null);

    const onDelete = (task: ITask) => {
        modal.confirm({
            title: `Delete "${task.title}"?`,
            content: 'The task is removed from the list. Its audit history is retained.',
            okText: 'Delete',
            okType: 'danger',
            onOk: async () => {
                try {
                    await deleteTask.mutateAsync(task.id);
                    message.success('Task deleted');
                } catch {
                    message.error('Could not delete the task. Please try again.');
                }
            },
        });
    };

    return (
        <Card>
            <TaskCreateForm />
            <TaskTable
                tasks={data?.data ?? []}
                meta={data?.meta}
                loading={isFetching}
                onPageChange={(page, perPage) => setParams({ page, perPage })}
                onAdvance={setStatusTask}
                onViewAudit={(task) => setAuditTaskId(task.id)}
                onDelete={onDelete}
            />

            <Modal
                title="Change Status"
                open={Boolean(statusTask)}
                onCancel={() => setStatusTask(null)}
                footer={null}
                destroyOnHidden
            >
                {statusTask && <TaskStatusSelect task={statusTask} onDone={() => setStatusTask(null)} />}
            </Modal>

            <AuditLogModal taskId={auditTaskId} onClose={() => setAuditTaskId(null)} />
        </Card>
    );
}
