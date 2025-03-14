import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import HelloScreen from '../screens/MainScreen';

export type RootStackParamList = {
    LoginScreen: undefined;
    MainScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppStack() {
    return (
        <Stack.Navigator initialRouteName="LoginScreen">
            <Stack.Screen
                name="LoginScreen"
                component={LoginScreen}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen name="MainScreen" component={HelloScreen} />
        </Stack.Navigator>
    );
}