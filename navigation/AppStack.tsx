import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import CatalogScreen from '../screens/CatalogScreen';
import CatalogItemScreen from '../screens/CatalogItemScreen';
import CatalogMenuScreen from '../screens/CatalogMenuScreen';
import MainScreen from '../screens/MainScreen';
import { getDataFromAcyncStorage } from '../lib/async-storage/acyncStorage';
import { ASYNC_STORAGE_USER_INFO_OBJECT } from '../lib/async-storage/asyncStorageKeys';
import { useEffect, useState } from 'react';
import { StatusBar, View } from 'react-native';
import { Colors } from '../theme/colors';
import Loader from '../components/ui/Loader';
import OrdersScreen from '../screens/OrdersScreen';

export type RootStackParamList = {
    LoginScreen: undefined;
    MainScreen: undefined;
    CatalogMenuScreen: undefined;
    CatalogScreen: { activeCategoryId: string };
    CatalogItemScreen: { activeProductId: string };
    OrdersScreen: undefined
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppStack() {
    const [isloading, setIsloading] = useState<boolean>(true);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        checkLoginState();
    }, []);

    async function checkLoginState() {
        const userInfoData = await getDataFromAcyncStorage(ASYNC_STORAGE_USER_INFO_OBJECT);

        if (userInfoData === undefined) {
            setIsLoggedIn(false);
        } else {
            setIsLoggedIn(true);
        };

        setTimeout(() => {
            setIsloading(false);
        }, 1500);
    };

    if (isloading) {
        return <Loading />
    } else {
        return (
            <Stack.Navigator
                id={undefined}
                initialRouteName={isLoggedIn ? "MainScreen" : "LoginScreen"}
            >
                <Stack.Screen
                    name="LoginScreen"
                    component={LoginScreen}
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="MainScreen"
                    component={MainScreen}
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="CatalogMenuScreen"
                    component={CatalogMenuScreen}
                    options={{
                        headerShown: false
                    }}
                />
                <Stack.Screen
                    name="CatalogScreen"
                    component={CatalogScreen}
                    options={{
                        headerShown: false
                    }}
                />
                <Stack.Screen
                    name="CatalogItemScreen"
                    component={CatalogItemScreen}
                    options={{
                        headerShown: false
                    }}
                />
                <Stack.Screen
                    name="OrdersScreen"
                    component={OrdersScreen}
                    options={{
                        headerShown: false
                    }}
                />
            </Stack.Navigator>
        );
    }
};

// ui
function Loading() {
    return (
        <>
            <StatusBar
                hidden={true}
                translucent={false}
                barStyle="dark-content"
                backgroundColor={Colors.pale}
            />
            <View
                style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: Colors.pale,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Loader radius={190} />
            </View>
        </>
    )
}