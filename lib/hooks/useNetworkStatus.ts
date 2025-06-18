import { useEffect, useState } from 'react'
import NetInfo from '@react-native-community/netinfo'

export const useNetworkStatus = () => {
    const [isConnected, setIsConnected] = useState<boolean>(false);

    useEffect(() => {
        const updateConnectionStatus = (state: { isConnected: boolean | null }) => {
            setIsConnected(Boolean(state.isConnected));
        };

        const unsubscribe = NetInfo.addEventListener(updateConnectionStatus);

        NetInfo.fetch().then(updateConnectionStatus);

        return () => {
            unsubscribe();
        };
    }, []);

    return { isConnected };
};
