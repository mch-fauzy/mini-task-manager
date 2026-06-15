import { QueryClientProvider } from '@tanstack/react-query';
import { App as AntApp, ConfigProvider, Layout, Typography } from 'antd';
import { NuqsAdapter } from 'nuqs/adapters/react';
import { TaskPage } from '../features/task/components/task-page';
import { queryClient } from '../shared/lib/query-client';

const { Header, Content } = Layout;

export default function App() {
    return (
        <NuqsAdapter>
            <QueryClientProvider client={queryClient}>
                <ConfigProvider>
                    <AntApp>
                        <Layout style={{ minHeight: '100vh' }}>
                            <Header>
                                {/* h1 primary page heading, sized to fit the 64px header */}
                                <Typography.Title level={1} style={{ color: '#fff', fontSize: 24, lineHeight: '64px', margin: 0 }}>
                                    Mini Task Manager
                                </Typography.Title>
                            </Header>
                            <Content style={{ padding: 24, maxWidth: 1024, margin: '0 auto', width: '100%' }}>
                                <TaskPage />
                            </Content>
                        </Layout>
                    </AntApp>
                </ConfigProvider>
            </QueryClientProvider>
        </NuqsAdapter>
    );
}
