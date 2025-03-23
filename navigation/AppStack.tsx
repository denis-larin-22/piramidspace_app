import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import HelloScreen from '../screens/MainScreen';
import CatalogScreen from '../screens/CatalogScreen';

export type RootStackParamList = {
    LoginScreen: undefined;
    MainScreen: undefined;
    CatalogScreen: undefined;
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
                name="CatalogScreen"
                component={CatalogScreen}
                options={{
                    headerShown: false
                }}
            />
        </Stack.Navigator>
    );
}