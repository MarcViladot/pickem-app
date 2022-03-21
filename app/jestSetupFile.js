import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
import './i18n';
import './src/app/api/api';
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);
jest.mock('@react-native-firebase/app', () => {
    return () => ({
        onNotification: jest.fn(),
        onNotificationDisplayed: jest.fn()
    })
})
jest.mock('@react-native-firebase/auth', () => {
    return () => ({
        signInAnonymously: jest.fn(),
        signInWithEmailAndPassword: jest.fn(),
        signOut: jest.fn(),
        onAuthStateChanged: jest.fn(),
        currentUser: jest.fn()
    })
})
jest.mock('@react-navigation/native', () => {
    const actualNav = jest.requireActual('@react-navigation/native');
    return {
        ...actualNav,
        useTheme: () => (
            {
                dark: true,
                colors: {
                    primary: '#00a680',
                    background: '#191F2E',
                    card: '#1F2C39',
                    text: '#FFF',
                    border: '#333',
                    notification: '#f84a4b',
                },
            }
        ),
    };
});
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')
jest.mock('react-native-reanimated', () => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const Reanimated = require('react-native-reanimated/mock');
        Reanimated.default.call = () => {};
        return Reanimated;
    })

