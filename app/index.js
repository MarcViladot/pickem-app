import "react-native-gesture-handler";
import { AppRegistry, LogBox } from "react-native";
import React from "react";
import App from "./App";
import store from "./store";
import { Provider } from "react-redux";
import './i18n';

LogBox.ignoreLogs(["Reanimated 2"]);

const Main = () => {
  return (
    <Provider store={store}>
      <App/>
    </Provider>
  );
};

AppRegistry.registerComponent("app", () => Main);
