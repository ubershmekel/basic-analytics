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

interface WindowData {
  apiBase: string;
  buffer: EventData[];
}

class BAEndpoint {
  sidKey = "tsauid";
  apiData: InitData;

  constructor(apiData: InitData) {
    this.apiData = apiData;
  }

  setupSessionId() {
    if (this.apiData.sessionId) {
      return;
    }
    let sessionId = localStorage.getItem(this.sidKey);
    if (!sessionId) {
      sessionId = Math.random().toString(16).slice(2);
      localStorage.setItem(this.sidKey, sessionId);
    }
    this.apiData.sessionId = sessionId;
  }

  async sendEvent(data: EventData): Promise<EventReturn> {
    if (!this.apiData?.apiBase) {
      const msg =
        "Events are not being sent. Did you create a `BAEndpoint` with valid data?";
      console.error(msg);
      return {
        error: msg,
      };
    }
    if (!data.sessionId) {
      data.sessionId = this.apiData.sessionId;
    }
    if (!data.domain) {
      data.domain = window.location.hostname;
    }
    if (data.key === "pageview" && !data.sv) {
      data.sv = window.location.href;
    }
    const url = this.apiData.apiBase + "/event";
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
}

export default class BasicAnalytics {
  // A class that helps us have a global analytics instance
  // for convenience.
  static endPoint: BAEndpoint | null = null;

  static init(data: InitData) {
    this.endPoint = new BAEndpoint(data);
    if (!this.endPoint.apiData.sessionId) {
      this.endPoint.setupSessionId();
    }
  }

  static async sendEvent(data: EventData): Promise<EventReturn> {
    if (!this.endPoint?.apiData?.apiBase) {
      const msg =
        "Events are not being sent. Did you call tasanlytics `init` with valid data?";
      console.error(msg);
      return {
        error: msg,
      };
    }
    return this.endPoint.sendEvent(data);
  }

  static windowInit() {
    const windowData = (window as any).basicAnalyticsData as WindowData;
    if (!windowData || !windowData.apiBase) {
      return;
    }
    // rate limiting event sending
    const msPerSendEvent = 100;
    this.init({
      apiBase: windowData.apiBase,
    });
    setInterval(() => {
      if (windowData.buffer.length === 0) {
        return;
      }
      const nextEvent = windowData.buffer.shift()!;
      this.endPoint?.sendEvent(nextEvent);
    }, msPerSendEvent);
  }
}

BasicAnalytics.windowInit();
