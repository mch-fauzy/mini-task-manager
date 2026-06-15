import { Button, Space, Table, Tag } from 'antd';
import type { TableColumnsType } from 'antd';
import { IPaginateMeta } from '../../../shared/types/api.types';
import { formatDateTime } from '../../../shared/utils/date.util';
import { TASK_STATUS_COLORS } from '../constants/task-status.constant';
import { ITask } from '../types/task.types';

interface ITaskTableProps {
    tasks: ITask[];
    meta?: IPaginateMeta;
    loading: boolean;
    onPageChange: (page: number, perPage: number) => void;
    onAdvance: (task: ITask) => void;
    onViewAudit: (task: ITask) => void;
    onDelete: (task: ITask) => void;
}

// Presentational only: receives data and callbacks, owns no fetching state.
export function TaskTable(props: ITaskTableProps) {
    const columns: TableColumnsType<ITask> = [
        { title: 'Title', dataIndex: 'title', key: 'title' },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (_, task) => <Tag color={TASK_STATUS_COLORS[task.status]}>{task.statusLabel}</Tag>,
        },
        { title: 'Created', dataIndex: 'createdAt', key: 'createdAt', render: (v: string) => formatDateTime(v) },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, task) => (
                <Space>
                    <Button size="small" onClick={() => props.onAdvance(task)}>
                        Change Status
                    </Button>
                    <Button size="small" onClick={() => props.onViewAudit(task)}>
                        History
                    </Button>
                    <Button size="small" danger onClick={() => props.onDelete(task)}>
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <Table
            rowKey="id"
            dataSource={props.tasks}
            columns={columns}
            loading={props.loading}
            pagination={{
                current: props.meta?.page ?? 1,
                pageSize: props.meta?.perPage ?? 10,
                total: props.meta?.total ?? 0,
                onChange: props.onPageChange,
                showSizeChanger: true,
            }}
        />
    );
}
