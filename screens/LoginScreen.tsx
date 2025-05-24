import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppStack";
import LoginForm from "../components/login-screen/LoginForm";
import { StatusBar } from "react-native";
import { Colors } from "../theme/colors";

export type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'LoginScreen'>;

function LoginScreen({ navigation }: { navigation: LoginScreenNavigationProp }) {


    return (
        <>
            <StatusBar
                hidden={true}
                translucent={false}
                barStyle="dark-content"
                backgroundColor={Colors.pale}
            />

            <LoginForm navigation={navigation} />
        </>
    )
}

export default LoginScreen;