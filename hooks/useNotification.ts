import { notification } from 'antd';

export const useNotification = () => {
    const [api, contextHolder] = notification.useNotification();

    const showError = (message: string, description?: string) => {
        api.error({
            message,
            description,
            placement: 'bottomRight',
            duration: 3,
        });
    };

    return {
        contextHolder,
        showError
    };
};