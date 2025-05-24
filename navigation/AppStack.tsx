import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import CatalogScreen from '../screens/CatalogScreen';
import CatalogItemScreen from '../screens/CatalogItemScreen';
import CatalogMenuScreen from '../screens/CatalogMenuScreen';
import MainScreen from '../screens/MainScreen';
import { getDataFromAcyncStorage } from '../lib/async-storage/acyncStorage';
import { ASYNC_STORAGE_USER_INFO_OBJECT } from '../lib/async-storage/asyncStorageKeys';
import { useState } from 'react';
import { Image, View } from 'react-native';

export type RootStackParamList = {
    LoginScreen: undefined;
    MainScreen: undefined;
    CatalogMenuScreen: undefined;
    CatalogScreen: { activeCategoryId: string };
    CatalogItemScreen: { activeProductId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppStack() {
    const [isloading, setIsloading] = useState<boolean>(true);
    const isLoggedIn = getDataFromAcyncStorage(ASYNC_STORAGE_USER_INFO_OBJECT);

    if (isloading) {
        return (
            <View
                style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'red'
                }}
            >
                <Image
                    source={require('../assets/logo_anim_preview.gif')}
                    style={{
                        width: 300,
                        height: 150,
                        backgroundColor: 'red'
                    }}
                />
            </View>
        )
    } else {
        return (
            <Stack.Navigator initialRouteName="LoginScreen">
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
            </Stack.Navigator>
        );
    }
};