import { Empty, Modal, Spin, Timeline, Typography } from 'antd';
import { formatDateTime } from '../../../shared/utils/date.util';
import { useTaskAuditLogs } from '../hooks/use-task-audit-logs';

interface IAuditLogModalProps {
    taskId: string | null;
    onClose: () => void;
}

/**
 * Read-only, chronological audit log for one task.
 * Visibility is driven by taskId: a selected task opens the modal and loads its log.
 * Renders backend order (created_at ASC) as a timeline with no edit/delete affordances.
 */
export function AuditLogModal({ taskId, onClose }: IAuditLogModalProps) {
    const open = taskId !== null;
    const { data: logs, isFetching } = useTaskAuditLogs(taskId);

    return (
        <Modal title="Audit Log" open={open} onCancel={onClose} footer={null} destroyOnHidden>
            {isFetching ? (
                <Spin />
            ) : !logs || logs.length === 0 ? (
                <Empty description="No status changes yet" />
            ) : (
                <Timeline
                    items={logs.map((log) => ({
                        children: (
                            <Typography.Text>
                                <strong>{log.actorName}</strong> changed status from <em>{log.fromStatusLabel}</em> to{' '}
                                <em>{log.toStatusLabel}</em>
                                <br />
                                <Typography.Text type="secondary">{formatDateTime(log.createdAt)}</Typography.Text>
                            </Typography.Text>
                        ),
                    }))}
                />
            )}
        </Modal>
    );
}
