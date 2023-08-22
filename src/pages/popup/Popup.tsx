import React, { useState } from "react";
import { Switch, Radio, Space, RadioChangeEvent, Input } from "antd";
import "@pages/popup/Popup.css";

const Popup = () => {
  const [value, setValue] = useState(2);
  const [checked, setChecked] = useState(false);
  const [proxyWidgetChecked, setProxyWidgetChecked] = useState(false);
  const [proxyBffChecked, setProxyBffChecked] = useState(false);
  const [customProxyWidget, setCustomProxyWidget] = useState("");
  console.log("customProxyWidget: ", customProxyWidget);
  const [customProxyBff, setCustomProxyBff] = useState("");
  console.log("customProxyBff: ", customProxyBff);

  const onChangeEnv = (e: RadioChangeEvent) => {
    setValue(e.target.value);
    chrome.storage.sync.set({ allowed: e.target.value });
  };

  const onChangeEnabled = (checked: boolean) => {
    setChecked(checked);
    chrome.storage.sync.set({ isEnabled: checked });
  };

  const onChangeProxyWidget = (checked: boolean) => {
    setProxyWidgetChecked(checked);
    chrome.storage.sync.set({ isEnabledProxyWidget: checked });
  };

  const onChangeProxyBff = (checked: boolean) => {
    setProxyBffChecked(checked);
    chrome.storage.sync.set({ isEnabledProxyBff: checked });
  };

  const onChangeCustomProxyWidget = (e: any) => {
    setCustomProxyWidget(e.target.value);
    chrome.storage.sync.set({ customProxyWidget: e.target.value });
  };

  const onChangeCustomProxyBff = (e: any) => {
    setCustomProxyBff(e.target.value);
    chrome.storage.sync.set({ customProxyBff: e.target.value });
  };

  chrome.storage.sync.get(
    {
      isEnabled: false,
      isEnabledProxyWidget: false,
      isEnabledProxyBff: false,
      customProxyWidget: "",
      customProxyBff: "",
      allowed: 2,
    },
    function (data) {
      setChecked(data.isEnabled);
      setProxyWidgetChecked(data.isEnabledProxyWidget);
      setProxyBffChecked(data.isEnabledProxyBff);
      setCustomProxyWidget(data.customProxyWidget);
      setCustomProxyBff(data.customProxyBff);
      setValue(data.allowed);
    }
  );

  return (
    <div className="App">
      <header className="App-header">
        <div style={{ marginRight: "15px" }}>是否启用拦截</div>
        <Switch checked={checked} onChange={onChangeEnabled} />
      </header>
      <div className="App-content">
        <div style={{ marginBottom: "15px" }}>加载环境</div>
        <Radio.Group onChange={onChangeEnv} value={value}>
          <Space direction="vertical">
            <Radio value={0}>production</Radio>
            <Radio value={1}>staging</Radio>
            <Radio value={2}>testing</Radio>
            <Radio value={3}>incy</Radio>
            <Radio value={4}>kiwi</Radio>
            <Radio value={5}>tidy</Radio>
          </Space>
        </Radio.Group>
        <div style={{ marginTop: "15px" }}>Development</div>
        <div
          style={{ marginTop: "15px", marginBottom: "5px", display: "flex" }}
        >
          <div style={{ marginRight: "15px" }}>是否代理widget</div>
          <Switch checked={proxyWidgetChecked} onChange={onChangeProxyWidget} />
        </div>
        <Input
          placeholder="Default http://localhost:9000"
          value={customProxyWidget}
          onChange={onChangeCustomProxyWidget}
        />
        <div
          style={{ marginTop: "15px", marginBottom: "5px", display: "flex" }}
        >
          <div style={{ marginRight: "15px" }}>是否代理bff</div>
          <Switch checked={proxyBffChecked} onChange={onChangeProxyBff} />
        </div>
        <Input
          placeholder="Default http://localhost:9003"
          value={customProxyBff}
          onChange={onChangeCustomProxyBff}
        />
      </div>
    </div>
  );
};

export default Popup;
