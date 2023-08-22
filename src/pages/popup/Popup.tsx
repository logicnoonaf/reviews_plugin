import React, { useState } from "react";
import { Switch, Radio, Space, RadioChangeEvent } from "antd";
import "@pages/popup/Popup.css";

const Popup = () => {
  const [value, setValue] = useState(2);
  const [checked, setChecked] = useState(false);
  const [proxyWidgetChecked, setProxyWidgetChecked] = useState(false);
  const [proxyBffChecked, setProxyBffChecked] = useState(false);

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

  chrome.storage.sync.get(
    {
      isEnabled: false,
      isEnabledProxyWidget: false,
      isEnabledProxyBff: false,
      allowed: 2,
    },
    function (data) {
      setChecked(data.isEnabled);
      setProxyWidgetChecked(data.isEnabledProxyWidget);
      setProxyBffChecked(data.isEnabledProxyBff);
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
        <div style={{ marginTop: "15px", display: "flex" }}>
          <div style={{ marginRight: "15px" }}>是否代理widget</div>
          <Switch checked={proxyWidgetChecked} onChange={onChangeProxyWidget} />
        </div>
        <div style={{ marginTop: "15px", display: "flex" }}>
          <div style={{ marginRight: "15px" }}>是否代理bff</div>
          <Switch checked={proxyBffChecked} onChange={onChangeProxyBff} />
        </div>
      </div>
    </div>
  );
};

export default Popup;
