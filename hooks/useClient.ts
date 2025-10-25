import { Api } from "../api/index";
import React from "react";
import { ClientFormData, ClientMainData } from "../api/client";

interface ReturnProps {
    saving: boolean;
    createClient: (formData: ClientFormData) => Promise<ClientMainData>;
}

export const useClient = (): ReturnProps => {
    const [saving, setSaving] = React.useState(false);

    const createClient = React.useCallback(async (formData: ClientFormData): Promise<ClientMainData> => {
        try {
            setSaving(true);
            const client = await Api.client.create(formData);
            return client;
        } catch (error) {
            console.error('Error creating client:', error);
            throw error;
        } finally {
            setSaving(false);
        }
    }, []);

    return {
        saving,
        createClient
    };
};

// Этот получает существующих клиентов
// const { clients, loading } = useClients();

// Этот создает новых клиентов  
// const { saving, createClient } = useClient();