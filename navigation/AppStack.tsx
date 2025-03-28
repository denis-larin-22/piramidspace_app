import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import CatalogScreen from '../screens/CatalogScreen';
import CatalogItemScreen from '../screens/CatalogItemScreen';
import CatalogMenuScreen from '../screens/CatalogMenuScreen';

export type RootStackParamList = {
    LoginScreen: undefined;
    MainScreen: undefined;
    CatalogMenuScreen: undefined;
    CatalogScreen: { activeCategoryId: string };
    CatalogItemScreen: { activeProductId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppStack() {
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
};