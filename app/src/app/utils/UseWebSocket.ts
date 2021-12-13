import {useEffect, useRef, useState} from 'react';
import Api from '../api/api';

interface Options {
    onMessage: (event) => void;
    externalUrl?: boolean;
}

const useWebSocket = (url: string, options: Options) => {

    const socket = useRef<WebSocket>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        let expectClose = false;
        const connect = async () => {
            if (socket.current !== null) {
                socket.current.close();
            }
            const baseURL = options.externalUrl === true ? '': `${Api.defaults.baseURL.replace('http', 'ws')}`;
            socket.current = new WebSocket(baseURL + url);
            socket.current.onopen = () => {
                setIsConnected(true)
            };
            socket.current.onmessage = options.onMessage;
            socket.current.onclose = () => {
                if (!expectClose) {
                    setIsConnected(false);
                    setTimeout(() => {
                        connect();
                    }, 3000);
                }
            };
        };
        connect();
        return () => {
            expectClose = true;
            socket.current.close();
            socket.current = null;

        };
    }, []);

    return [isConnected, socket]

};

export default useWebSocket;
