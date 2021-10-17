import {useFocusEffect} from '@react-navigation/native';

import {BackHandler} from 'react-native';
import {useCallback} from 'react';

const useBackButton = (backAction) => {
    useFocusEffect(useCallback(() => {
            BackHandler.addEventListener('hardwareBackPress', backAction);
            return () => {
                BackHandler.removeEventListener('hardwareBackPress', backAction);
            };
        }, [backAction])
    );
};

export default useBackButton;


