let apiBase = "http://localhost:3002";
export function init(newApiBase) {
    apiBase = newApiBase;
}
export async function sendEvent(data) {
    const url = apiBase + "/event";
    const response = await fetch(url, { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    const result = await response.json();
    return result;
}
//# sourceMappingURL=web-api.js.map