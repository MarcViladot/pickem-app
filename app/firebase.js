import firebase from '@react-native-firebase/app';

const firebaseConfig = {
        apiKey: "AIzaSyCUu7iZr8ioZcFmhr3Zmqvhrai4_6_Ha40",
        storageBucket: "pickem-app-2372f.appspot.com",
        clientId: '1097082691734-2qfi17c57fu5u0jfe11qjo7cl4d6kqa7.apps.googleusercontent.com',
        appId: '1:1097082691734:android:8e4a2fbc68e100759a62b7',
        projectId: 'pickem-app-2372f',
        databaseURL: '',
        messagingSenderId: ''
    };

if (firebase.apps.length === 0) {
        firebase.initializeApp(firebaseConfig);
}
