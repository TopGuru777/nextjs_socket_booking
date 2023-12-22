export interface EventType {
    id: number;
    title: string;
    start: Date;
    end: Date;
    service: string;
    resourceId?: number;
    status: string;
}

export interface ProviderType {
    resourceId: string;
    uuid: string;
    resourceTitle: string;
    start?: number;
    end?: number;
}
