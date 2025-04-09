import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Button, Image, Text, View } from "react-native";
import { RootStackParamList } from "../navigation/AppStack";
import { Colors } from "../theme/colors";
import { useEffect } from "react";
import { getDataCatalogCategories, getDataCatalogList } from "../lib/appDataHandler";

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "MainScreen">;

function MainScreen({ navigation }: { navigation: HomeScreenNavigationProp }) {

    useEffect(() => {
        // IMPORTANT! Loading data for further work of the catalog!
        getDataCatalogList(); // loading Catalog list
        getDataCatalogCategories(); // loading Catalog categories list
    }, []);

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
                title="Меню каталогу"
                onPress={() => {
                    navigation.navigate("CatalogMenuScreen");
                }}
            />
        </View>
    );
}

export default MainScreen;