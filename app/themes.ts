import {Theme} from '@react-navigation/native';
import {createContext} from 'react';

export const ThemeContext = createContext(null);

export const LightTheme: Theme = {
  dark: false,
  colors: {
    primary: '#00a680',
    background: '#F3F4F9',
    card: '#FFF',
    text: '#000',
    border: '#e2e2e2',
    notification: '#f84a4b',
  },
};

export const DarkTheme: Theme = {
  dark: true,
  colors: {
    primary: '#00a680',
    background: '#191F2E',
    card: '#1F2C39',
    text: '#FFF',
    border: '#333',
    notification: '#f84a4b',
  },
};
