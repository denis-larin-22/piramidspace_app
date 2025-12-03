import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppStack";
import LoginForm from "../components/login-screen/LoginForm";
import { StatusBar, View, Text, StyleSheet } from "react-native";
import { Colors } from "../theme/colors";
import { Fonts } from "../theme/fonts";
import { useNetworkStatus } from "../lib/hooks/useNetworkStatus";

export type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'LoginScreen'>;

function LoginScreen({ navigation }: { navigation: LoginScreenNavigationProp }) {
    const { isConnected } = useNetworkStatus();

    return (
        <View style={styles.container}>
            <StatusBar
                hidden={true}
                translucent={false}
                barStyle="dark-content"
                backgroundColor={Colors.pale}
            />

            {/* message if connection = false */}
            {isConnected === false && (
                <View style={styles.banner}>
                    <Text style={styles.bannerText}>Немає підключення до інтернету</Text>
                </View>
            )}

            <LoginForm
                navigation={navigation}
                isInternetConnected={isConnected}
            />
        </View>
    );
}

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.pale,
        position: 'relative',
    },
    banner: {
        position: 'absolute',
        top: 150,
        left: 0,
        right: 0,
        backgroundColor: Colors.red,
        paddingVertical: 12,
        alignItems: 'center',
        zIndex: 1000,
        elevation: 10,
        marginHorizontal: 20,
        borderRadius: 16
    },
    bannerText: {
        color: 'white',
        fontSize: 14,
        fontFamily: Fonts.openSans700
    },
});
