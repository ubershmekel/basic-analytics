import BasicAnalytics from "@basic-analytics/sdk";

// import * as BasicAnalytics from "@basic-analytics/sdk";

let apiBase = "https://yourendpoint.example.com";
if (
  window.location.hostname.indexOf("127.0.0") >= 0 ||
  window.location.hostname === "localhost"
) {
  apiBase = "http://localhost:3002";
}

BasicAnalytics.init({
  apiBase,
});

console.log("typescript works here, that's cool", BasicAnalytics.endPoint);
BasicAnalytics.sendEvent({ key: "pageview" });

(window as any).clickEvent = function () {
  console.log("click");
  BasicAnalytics.sendEvent({
    key: "click",
  });
};
