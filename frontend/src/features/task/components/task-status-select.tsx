import { useState } from 'react';
import { Alert, App, Button, Select, Space, Typography } from 'antd';
import { useActors } from '../hooks/use-actors';
import { useUpdateTaskStatus } from '../hooks/use-update-task-status';
import { ITask } from '../types/task.types';
import { buildStatusOptions, getNextStatus } from '../utils/task-status.util';

interface ITaskStatusSelectProps {
    task: ITask;
    onDone: () => void;
}

/**
 * Modal content for advancing a task's status.
 * Only the immediate next status is enabled (UX guard) and an actor is required.
 * The backend re-validates the transition and stays the source of truth.
 */
export function TaskStatusSelect({ task, onDone }: ITaskStatusSelectProps) {
    const { message } = App.useApp();
    const { data: actors } = useActors();
    const updateStatus = useUpdateTaskStatus();

    const next = getNextStatus(task.status);
    const options = buildStatusOptions(task.status);
    const [toStatus, setToStatus] = useState(next ?? task.status);
    const [actorId, setActorId] = useState<string | undefined>(undefined);
    const [submitAttempted, setSubmitAttempted] = useState(false);

    if (!next) {
        return <Alert type="info" message="This task is already at the final status." />;
    }

    // Derived: the actor error shows after a submit attempt with no actor chosen.
    const showActorError = submitAttempted && !actorId;

    const onSubmit = async () => {
        if (!actorId) {
            setSubmitAttempted(true);
            return;
        }
        try {
            await updateStatus.mutateAsync({ id: task.id, toStatus, actorId });
            message.success('Status updated');
            onDone();
        } catch {
            message.error('Could not update the status. Please try again.');
        }
    };

    return (
        <Space direction="vertical" style={{ width: '100%' }}>
            <Typography.Text>
                Current: <strong>{task.statusLabel}</strong>
            </Typography.Text>
            <Select<typeof toStatus>
                style={{ width: '100%' }}
                value={toStatus}
                onChange={setToStatus}
                options={options}
                aria-label="Target status"
            />
            <div>
                <Select
                    style={{ width: '100%' }}
                    placeholder="Select an actor"
                    value={actorId}
                    onChange={setActorId}
                    status={showActorError ? 'error' : undefined}
                    options={(actors ?? []).map((actor) => ({ value: actor.id, label: actor.name }))}
                    aria-label="Actor"
                />
                {showActorError ? (
                    <Typography.Text type="danger" role="alert">
                        Please select an actor
                    </Typography.Text>
                ) : null}
            </div>
            <Button type="primary" loading={updateStatus.isPending} onClick={onSubmit}>
                Update Status
            </Button>
        </Space>
    );
}
