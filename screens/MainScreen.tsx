import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Button, Image, Text, View } from "react-native";
import { RootStackParamList } from "../navigation/AppStack";
import { Colors } from "../theme/colors";

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "MainScreen">;

function MainScreen({ navigation }: { navigation: HomeScreenNavigationProp }) {
    return (
        <View
            style={{
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                backgroundColor: Colors.pale,
            }}
        >
            <Image
                source={require("../assets/icon-img.png")}
                style={{
                    width: 150,
                    resizeMode: "center",
                }}
            />
            <Text
                style={{
                    fontSize: 20,
                    fontFamily: "OpenSans_Regular", // <== Используем жирный вариант шрифта
                    marginBottom: 20,
                }}
            >
                👋😊 Привіт!
            </Text>
            <Text
                style={{
                    fontFamily: "Comfortaa_Regular", // <== Применяем шрифт и к другому тексту
                    fontSize: 16,
                }}
            >
                Сторінка головного меню
            </Text>
            <Button
                title="Логин"
                onPress={() => {
                    navigation.navigate("LoginScreen");
                }}
            />
        </View>
    );
}

export default MainScreen;
