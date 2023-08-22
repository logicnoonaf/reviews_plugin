import { useEffect } from "react";

export const port = chrome.runtime.connect({ name: "knockknock" });

export default function App() {
  useEffect(() => {
    console.log("content view loaded");
  }, []);

  chrome.runtime.onMessage.addListener((message) => {
    console.log("contentaddListener");
    console.log("message: ", message);
    const demoSecretAccessKey = localStorage.getItem("demoSecretAccessKey");
    const demoAccessKeyId = localStorage.getItem("demoAccessKeyId");
    const demoExpirationTime = localStorage.getItem("demoExpirationTime");
    const demoEmail = localStorage.getItem("demoEmail");
    const demoPassword = localStorage.getItem("demoPassword");
    const demoUploadType = localStorage.getItem("demoUploadType");

    if (message.type === "requestInit") {
      chrome.runtime.sendMessage({
        type: "responseInit",
        demoInfo: {
          demoSecretAccessKey,
          demoAccessKeyId,
          demoEmail,
          demoPassword,
          demoUploadType,
        },
        demoExpirationTime,
      });
    }
    if (message.type === "login") {
      const expirationTime = new Date();
      expirationTime.setHours(expirationTime.getHours() + 8);
      fetch(
        "https://accounts.automizely.com/auth/realms/business/protocol/openid-connect/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `client_id=aftership&grant_type=password&scope=openid&username=${encodeURIComponent(
            message.email
          )}&password=${encodeURIComponent(message.password)}`,
        }
      )
        .then((response) => response.json())
        .then((response) => {
          console.log(response);
          console.log(message);
          localStorage.setItem("demoSecretAccessKey", message.secretAccessKey);
          localStorage.setItem("demoAccessKeyId", message.accessKeyId);
          localStorage.setItem("demoEmail", message.email);
          localStorage.setItem("demoPassword", message.password);
          localStorage.setItem("demoUploadType", message.uploadType);
          localStorage.setItem(
            "demoExpirationTime",
            String(expirationTime.getTime())
          );
          localStorage.setItem(
            "demoJwt",
            `${response.token_type + " " + response.access_token}`
          );
        })
        .catch((error) => console.log("Error:", error));
    }
  });
}
