'use client'
import { Table, Card, Button, Space, Tag, message, Spin } from "antd";
import { useClients } from "../../../../hooks/useClients"; 
import { ReloadOutlined } from "@ant-design/icons";
import { ClientMainData } from "../../../../api/client";

export const ClientsList: React.FC = () => {
    const { clients, loading, error, refetch } = useClients();

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
            render: (id: string) => <span>#{id}</span>
        },
        {
            title: 'Адрес объекта',
            dataIndex: 'address',
            key: 'address',
            render: (address: string) => address || 'Не указан'
        },
        {
            title: 'Рабочее время',
            key: 'workTime',
            render: (record: ClientMainData) => (
                <span>
                    {record.dayStart || '--:--'} - {record.dayEnd  || '--:--'}
                </span>
            )
        },
        {
            title: 'Обеденное время',
            key: 'lunchTime',
            render: (record: ClientMainData) => (
                <span>
                    {record.lunchStart || '--:--'} - {record.lunchEnd || '--:--'}
                </span>
            )
        },
        {
            title: 'Уровень клиента',
            dataIndex: 'priority',
            key: 'priority',
            render: (level: string) => (
                <Tag color={level === 'vip' ? 'gold' : 'blue'}>
                    {level === 'vip' ? 'VIP' : 'Стандарт'}
                </Tag>
            )
        },
    ];

    // Обработчик обновления данных
    const handleRefresh = async () => {
        try {
            await refetch();
            message.success('Данные обновлены');
        } catch {
            message.error('Ошибка при обновлении данных');
        }
    };

    // Если ошибка
    if (error) {
        return (
            <Card>
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <h3 style={{ color: '#ff4d4f' }}>Ошибка загрузки данных</h3>
                    <p>{error}</p>
                    <Button type="primary" onClick={handleRefresh}>
                        Повторить попытку
                    </Button>
                </div>
            </Card>
        );
    }

    return (
        <Card 
            title={
                <Space>
                    Список клиентов
                    {loading && <Spin size="small" />}
                </Space>
            }
            extra={
                <Button 
                    icon={<ReloadOutlined />} 
                    onClick={handleRefresh}
                    loading={loading}
                >
                    Обновить
                </Button>
            }
        >
            <Table
                columns={columns}
                dataSource={clients}
                rowKey="id"
                loading={loading}
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) => 
                        `Показано ${range[0]}-${range[1]} из ${total} клиентов`
                }}
                scroll={{ x: 800 }}
            />
        </Card>
    );
};