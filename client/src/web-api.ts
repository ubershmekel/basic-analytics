export interface EventData {
  domain: string;
  key: string;
  sessionId: string;
}

export interface EventReturn {
  success?: boolean;
  error?: string;
}

let apiBase = "http://localhost:3002";

export function init(newApiBase: string) {
  apiBase = newApiBase;
}

export async function sendEvent(data: EventData): Promise<EventReturn> {
  const url = apiBase + "/event";
  const response = await fetch(url, { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  const result: EventReturn = await response.json();
  return result;
}

