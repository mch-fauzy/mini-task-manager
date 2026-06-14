import { QueryClientProvider } from '@tanstack/react-query';
import { App as AntApp, ConfigProvider, Layout, Typography } from 'antd';
import { queryClient } from '../shared/lib/query-client';

const { Header, Content } = Layout;

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ConfigProvider>
                <AntApp>
                    <Layout style={{ minHeight: '100vh' }}>
                        <Header>
                            <Typography.Title level={3} style={{ color: '#fff', margin: '14px 0' }}>
                                Mini Task Manager
                            </Typography.Title>
                        </Header>
                        <Content style={{ padding: 24, maxWidth: 1024, margin: '0 auto', width: '100%' }}>
                            {/* Phase 5: <TaskPage /> */}
                            <Typography.Text>Scaffold ready.</Typography.Text>
                        </Content>
                    </Layout>
                </AntApp>
            </ConfigProvider>
        </QueryClientProvider>
    );
}
