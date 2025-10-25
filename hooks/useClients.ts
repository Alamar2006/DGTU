import { Api } from "../api";
import React from "react";
import { ClientFullResponse, ClientMainData, ClientCoords } from "../api/client";

interface ReturnProps {
    clients: ClientMainData[];
    coords: { [key: string]: ClientCoords };
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export const useClients = (): ReturnProps => {
    const [clients, setClients] = React.useState<ClientMainData[]>([]);
    const [coords, setCoords] = React.useState<{ [key: string]: ClientCoords }>({});
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const fetchClients = React.useCallback(async (): Promise<void> => {
        try {
            setLoading(true);
            setError(null);
            const response: ClientFullResponse = await Api.client.getAll();
            
            setClients(response.clients);
            setCoords(response.coords);
        } catch (err) {
            console.error('Error fetching clients:', err);
            setError('Не удалось загрузить список клиентов');
        } finally {
            setLoading(false);
        }
    }, []);

    React.useEffect(() => {
        fetchClients();
    }, [fetchClients]);

    return {
        clients,
        coords,
        loading,
        error,
        refetch: fetchClients
    };
};