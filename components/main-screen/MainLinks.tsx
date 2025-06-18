import { Image, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { Colors } from "../../theme/colors";
import { Fonts } from "../../theme/fonts";
import { HomeScreenNavigationProp } from "../../screens/MainScreen";
import AnimatedWrapper from "../animation/AnimatedWrapper";

function MainLinks({ navigation }: { navigation: HomeScreenNavigationProp }) {
    const links = [
        {
            text: 'Замовлення',
            onPress: () => { navigation.navigate('OrdersScreen') }
        },
        {
            text: 'Операції',
            onPress: () => { }
        },
        {
            text: 'Рахунки',
            onPress: () => { }
        },
        {
            text: 'Каталог',
            onPress: () => navigation.navigate('CatalogMenuScreen')
        },
    ];

    return (
        <View style={styles.container}>
            {links.map((link, index) => (
                <AnimatedWrapper
                    key={index}
                    offsetY={50}
                    useOpacity
                    delay={(3 + index) * 100}
                    duration={300}
                >
                    <TouchableOpacity
                        style={styles.linkCard}
                        onPress={link.onPress}
                    >
                        <View style={styles.moreWrapper}>
                            <Text style={styles.moreText}>більше</Text>
                            <Image
                                source={require('../../assets/main-screen/arrow-right.png')}
                                style={styles.arrowIcon}
                                resizeMode="contain"
                            />
                        </View>
                        <Text style={styles.linkText}>{link.text}</Text>
                    </TouchableOpacity>
                </AnimatedWrapper>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        gap: 10,
    },
    linkCard: {
        height: 76,
        width: '100%',
        backgroundColor: Colors.pale,
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 13,
        overflow: 'hidden',

        // iOS shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,

        // Android shadow
        elevation: 5,
    },
    moreWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        alignSelf: 'flex-end',
    },
    moreText: {
        fontSize: 14,
        fontFamily: Fonts.openSans400,
        color: '#09022A',
    },
    arrowIcon: {
        width: 19,
        height: 8,
    },
    linkText: {
        fontSize: 36,
        fontFamily: Fonts.comfortaa700,
        textTransform: 'uppercase',
        color: Colors.blue,
        position: 'relative',
        bottom: -5,
        left: -3,
    },
});

export default MainLinks;
