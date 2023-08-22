import reloadOnUpdate from "virtual:reload-on-update-in-background-script";

reloadOnUpdate("pages/background");
console.log("background loaded");

const iconPathEnabled = "../../../icon-34.png";
const iconPathDisabled = "../../../disable-icon-34.png";

const defaultInterceptRule = {
  urls: [
    "*://widgets.automizely.com/reviews/*",
    "*://staging-widgets.automizely.com/reviews/*",
    "*://widgets.automizely.io/reviews/*",
    "*://release-incy-widgets.automizely.io/reviews/*",
    "*://release-kiwi-widgets.automizely.io/reviews/*",
    "*://release-tidy-widgets.automizely.io/reviews/*",
    "*://bff-api.automizely.com/*",
    "*://staging-bff-api.automizely.com/*",
    "*://bff-api.automizely.io/*",
    "*://release-incy-widgets.automizely.io/*",
    "*://release-kiwi-widgets.automizely.io/*",
    "*://release-tidy-widgets.automizely.io/*",
  ],
};

const defultUrls = [
  "https://widgets.automizely.com/reviews/",
  "https://staging-widgets.automizely.com/reviews/",
  "https://widgets.automizely.io/reviews/",
  "https://release-incy-widgets.automizely.io/reviews/",
  "https://release-kiwi-widgets.automizely.io/reviews/",
  "https://release-tidy-widgets.automizely.io/reviews/",
];

const proxyWidgetUrls = [
  /https:\/\/widgets\.automizely\.com\/reviews\/v1\/(.+)/,
  /https:\/\/staging-widgets\.automizely\.io\/reviews\/v1\/(.+)/,
  /https:\/\/widgets\.automizely\.io\/reviews\/v1\/(.+)/,
  /https:\/\/release-incy-widgets\.automizely\.io\/reviews\/v1\/(.+)/,
  /https:\/\/release-kiwi-widgets\.automizely\.io\/reviews\/v1\/(.+)/,
  /https:\/\/release-tidy-widgets\.automizely\.io\/reviews\/v1\/(.+)/,
];

const proxyBffUrls = [
  "https://bff-api.automizely.com",
  "https://staging-bff-api.automizely.com",
  "https://bff-api.automizely.io",
  "https://release-incy-bff-api.automizely.io",
  "https://release-kiwi-bff-api.automizely.io",
  "https://release-tidy-bff-api.automizely.io",
];

let isEnabled = false;
let isEnabledProxyWidget = false;
let isEnabledProxyBff = false;
let customProxyWidget = "";
let customProxyBff = "";
let allowedUrl = "https://widgets.automizely.io/reviews/";
let proxyWidgetUrl = /https:\/\/widgets\.automizely\.io\/reviews\/v1\/(.+)/;
let proxyBffUrl = "https://bff-api.automizely.io";

function updateIcon(isEnabled) {
  const iconPath = isEnabled ? iconPathEnabled : iconPathDisabled;

  chrome.browserAction.setIcon({ path: iconPath });
}

// default begin
chrome.storage.sync.get({ isEnabled: isEnabled }, function (data) {
  isEnabled = data.isEnabled;

  updateIcon(isEnabled);
});

chrome.storage.onChanged.addListener(function (changes, areaName) {
  console.log("changes: ", changes);
  if (areaName === "sync" && changes.isEnabled) {
    isEnabled = changes.isEnabled.newValue;

    updateIcon(isEnabled);
  }
  if (areaName === "sync" && changes.isEnabledProxyWidget) {
    isEnabledProxyWidget = changes.isEnabledProxyWidget.newValue;
  }
  if (areaName === "sync" && changes.isEnabledProxyBff) {
    isEnabledProxyBff = changes.isEnabledProxyBff.newValue;
  }
  if (areaName === "sync" && changes.customProxyWidget) {
    customProxyWidget = changes.customProxyWidget.newValue;
  }
  if (areaName === "sync" && changes.customProxyBff) {
    customProxyBff = changes.customProxyBff.newValue;
  }
  if (areaName === "sync" && changes.allowed) {
    allowedUrl = defultUrls[changes.allowed.newValue];
    proxyWidgetUrl = proxyWidgetUrls[changes.allowed.newValue];
    proxyBffUrl = proxyBffUrls[changes.allowed.newValue];
    console.log("allowedUrl: ", allowedUrl);
  }
});

// chrome.storage.onChanged.addListener(function (changes, areaName) {
//   if (areaName === "sync" && changes.allowed) {
//     allowedUrl = defultUrls[changes.allowed.newValue];
//     proxyWidgetUrl = ProxyWidgetUrls[changes.allowed.newValue];
//     console.log("allowedUrl: ", allowedUrl);
//   }
// });

chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    // 取消请求
    if (isEnabled) {
      if (!details.url.startsWith(allowedUrl) && !details.url.includes("bff")) {
        return { cancel: true };
      }
      if (isEnabledProxyWidget) {
        // 提取 URL 中的子匹配项
        console.log("details.url: ", details.url);

        const matchResult = details.url.match(proxyWidgetUrl);
        console.log("matchResult: ", matchResult);

        if (matchResult && matchResult[1]) {
          // 将匹配项插入重定向 URL 中
          const redirectUrl = `${
            customProxyWidget ? customProxyWidget : "http://localhost:9000"
          }/${matchResult[1]}`;

          return { redirectUrl };
        }
      }
      if (isEnabledProxyBff) {
        const redirectUrl = details.url.replace(
          proxyBffUrl,
          customProxyBff ? customProxyBff : "http://localhost:9003"
        );

        return { redirectUrl };
      }
    }
  },
  defaultInterceptRule,
  ["blocking"]
);
