import {useCallback} from 'react';
import {DeviceEventEmitter} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';


const useScannerWithNav = (handler) => {

    useFocusEffect(useCallback(() => {
            const readIntentFunction = intent => {
                if (!intent.hasOwnProperty('RESULT_INFO')) {
                    //  A barcode has been scanned
                    const scannedData = intent["com.symbol.datawedge.data_string"];
                    handler(scannedData);
                }
            };
            DeviceEventEmitter.addListener('datawedge_broadcast_intent', readIntentFunction);
            return () => {
                // Do something when the screen is unfocused
                DeviceEventEmitter.removeListener('datawedge_broadcast_intent', readIntentFunction);
            };
        }, [handler])
    );
};

export default useScannerWithNav;
