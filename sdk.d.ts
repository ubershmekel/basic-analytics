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
    sessionId: string;
}
export declare function init(data: InitData): void;
export declare function sendEvent(data: EventData): Promise<EventReturn>;
