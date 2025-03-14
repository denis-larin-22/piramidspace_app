import { Button, Image, Text, View } from "react-native";

function MainScreen() {
    return (
        <View
            style={{
                alignItems: "center",
                justifyContent: "center",
                height: '70%'
            }}
        >
            <Image
                source={require('../assets/icon.png')}
                style={{
                    width: 150,
                    resizeMode: 'center',
                }}
            />
            <Text
                style={{
                    fontSize: 20,
                    fontWeight: 700,
                    marginBottom: 20
                }}
            >👋😊 Привіт!</Text>
            <Text>Сторінка головного меню</Text>

        </View>
    );
}

export default MainScreen;
