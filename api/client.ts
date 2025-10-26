import { AxiosInstance } from "./instance";

export interface ClientMainData {
    id: number;
    address: string;
    dayStart?: string;
    dayEnd?: string; 
    lunchStart?: string;
    lunchEnd?: string;
    priority: string;
}

export interface ClientCoords {
    latitude: string;
    longitude: string;  
}

export interface ClientFullResponse {
    clients: ClientMainData[];  
    coords: { [key: string]: ClientCoords };  
}

export interface ClientFormData {
    address: string;
    dayStart?: string;
    dayEnd?: string;
    lunchStart?: string;
    lunchEnd?: string;
    priority: string;
}

export const clientApi = {
    create: async (formData: ClientFormData): Promise<ClientMainData> => {
        return (await AxiosInstance.post<ClientMainData>('/api/client', formData)).data
    },

    getAll: async (): Promise<ClientFullResponse> => {
        return (await AxiosInstance.get<ClientFullResponse>('/api/client')).data;
    },
}