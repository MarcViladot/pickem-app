import "react-native-gesture-handler";
import {AppRegistry, LogBox, SafeAreaView} from "react-native";
import React from "react";
import App from "./App";
import store from "./store";
import {Provider} from "react-redux";
import './i18n';
import './firebase';

LogBox.ignoreLogs(["Reanimated 2"]);

const Main = () => {
    return (
        <Provider store={store}>
            <SafeAreaView style={{flex: 1}}>
                <App/>
            </SafeAreaView>
        </Provider>
    );
};

AppRegistry.registerComponent("app", () => Main);
