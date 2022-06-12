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

let apiData: InitData | null = null;

export function init(data: InitData) {
  apiData = data;
}

const sidKey = "tsauid";
let sessionId = localStorage.getItem(sidKey);
if (!sessionId) {
  sessionId = Math.random().toString(16).slice(2);
  localStorage.setItem(sidKey, sessionId);
}

export async function sendEvent(data: EventData): Promise<EventReturn> {
  if (!apiData) {
    const msg =
      "Events are not being sent. Did you call tasanlytics `init` with valid data?";
    console.error(msg);
    return {
      error: msg,
    };
  }
  if (!data.sessionId) {
    data.sessionId = apiData.sessionId;
  }
  if (!data.domain) {
    data.domain = window.location.hostname;
  }
  if (data.key === "pageview" && !data.sv) {
    data.sv = window.location.href;
  }
  const url = apiData.apiBase + "/event";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const result: EventReturn = await response.json();
  return result;
}

sendEvent({ key: "pageview" });
