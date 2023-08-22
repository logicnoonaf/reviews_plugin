import packageJson from "./package.json";

const manifest: chrome.runtime.ManifestV2 = {
  manifest_version: 2,
  name: packageJson.name,
  version: packageJson.version,
  description: packageJson.description,
  background: {
    scripts: ["src/pages/background/index.js"],
    persistent: true,
  },
  browser_action: {
    default_popup: "src/pages/popup/index.html",
    default_icon: "icon-34.png",
  },
  icons: {
    "128": "icon-128.png",
  },
  permissions: [
    "tabs",
    "activeTab",
    "proxy",
    "alarms",
    "background",
    "storage",
    "debugger",
    "contextMenus",
    "contentSettings",
    "nativeMessaging",
    "webRequest",
    "webRequestBlocking",
    "*://*/*",
  ],
  content_scripts: [
    {
      matches: ["http://*/*", "https://demo-marketing.automizely.io/*"],
      js: ["src/pages/content/index.js"],
      css: ["assets/css/contentStyle.chunk.css"],
    },
  ],
  web_accessible_resources: [
    "assets/js/*.js",
    "assets/css/*.css",
    "icon-128.png",
    "icon-34.png",
    "*://*/*",
  ],
};

export default manifest;
