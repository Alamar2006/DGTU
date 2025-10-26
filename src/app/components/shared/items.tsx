'use client'
import { Table, Card, Button, Space, Tag, message, Spin, Result } from "antd";
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
            <Card className="flex items-center justify-center min-h-[300px] border-0 shadow-md rounded-xl">
  <div className="text-center p-6 max-w-sm mx-auto">
    <Result
      title={
        <span className="text-base font-medium text-gray-800 dark:text-gray-200">
          Ошибка загрузки данных
        </span>
      }
      extra={
        <Button 
          onClick={handleRefresh} 
          type="primary" 
          key="repeat"
          className="h-9 px-5 bg-blue-600 hover:bg-blue-700 border-0 rounded-lg font-medium text-sm shadow-sm hover:shadow transition-all"
        >
          Повторить попытку
        </Button>
      }
    />
    {error && (
      <p className="mt-3 px-3 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-600 dark:text-red-400 text-xs">
        {error}
      </p>
    )}
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