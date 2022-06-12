export interface EventData {
    key: string;
    domain?: string;
    sessionId?: string;
    sv?: string;
    iv?: number;
    fv?: number;
}
export interface EventReturn {
    success?: boolean;
    error?: string;
}
export interface InitData {
    apiBase: string;
    sessionId?: string;
}
declare class BAEndpoint {
    sidKey: string;
    apiData: InitData;
    constructor(apiData: InitData);
    setupSessionId(): void;
    sendEvent(data: EventData): Promise<EventReturn>;
}
export default class BasicAnalytics {
    static endPoint: BAEndpoint | null;
    static init(data: InitData): void;
    static sendEvent(data: EventData): Promise<EventReturn>;
    static windowInit(): void;
}
export {};
