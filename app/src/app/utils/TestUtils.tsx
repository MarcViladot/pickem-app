import store from '../../../store';
import {render} from '@testing-library/react-native'
import {Provider} from 'react-redux';
import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {DarkTheme, LightTheme, ThemeContext} from '../../../themes';
import {ThemeProvider} from 'styled-components/native';

const AllTheProviders = ({children}) => {
    const [theme, setTheme] = useState('dark');
    const themeData = {theme, setTheme};
    return (
        <Provider store={store}>
            <ThemeContext.Provider value={themeData}>
                <ThemeProvider theme={theme === 'dark' ? DarkTheme : LightTheme}>
                    {children}
                </ThemeProvider>
            </ThemeContext.Provider>
        </Provider>
    )
};

const ReduxProvider = ({children}) => {

    return (
        <Provider store={store}>
            {children}
        </Provider>
    )
};

const ProvidersWithNav = ({children}) => {
    const [theme, setTheme] = useState('dark');
    const themeData = {theme, setTheme};
    return (
        <Provider store={store}>
            <ThemeContext.Provider value={themeData}>
                <ThemeProvider theme={DarkTheme}>
                    <NavigationContainer theme={DarkTheme}>
                        {children}
                    </NavigationContainer>
                </ThemeProvider>
            </ThemeContext.Provider>
        </Provider>
    )
};

const customRender = (ui, options?) =>
    render(ui, {wrapper: AllTheProviders, ...options});

const reduxRender = (ui, options?) =>
    render(ui, {wrapper: ReduxProvider, ...options});

const navRender = (ui, options?) =>
    render(ui, {wrapper: ProvidersWithNav, ...options});

export * from '@testing-library/react-native'
export {customRender as render}
export {reduxRender as reduxRender}
export {navRender as navRender}
