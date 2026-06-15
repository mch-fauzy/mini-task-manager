import { App, Button, Form, Input } from 'antd';
import { useCreateTask } from '../hooks/use-create-task';
import { taskCreateSchema } from '../schemas/task-create.schema';

export function TaskCreateForm() {
    const [form] = Form.useForm();
    const { message } = App.useApp();
    const createTask = useCreateTask();

    const onFinish = async (values: { title: string }) => {
        // Zod mirrors the backend DTO and catches whitespace-only titles.
        const parsed = taskCreateSchema.safeParse(values);
        if (!parsed.success) {
            form.setFields([{ name: 'title', errors: [parsed.error.issues[0].message] }]);
            return;
        }
        try {
            await createTask.mutateAsync(parsed.data.title);
            form.resetFields();
            message.success('Task created');
        } catch {
            message.error('Could not create the task. Please try again.');
        }
    };

    return (
        <Form form={form} layout="inline" onFinish={onFinish} style={{ marginBottom: 16 }}>
            <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Title is required' }]}>
                <Input placeholder="e.g. Prepare invoice…" autoComplete="off" style={{ width: 280 }} />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" loading={createTask.isPending}>
                    Add Task
                </Button>
            </Form.Item>
        </Form>
    );
}
