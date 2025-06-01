import { Image, TouchableOpacity, View, StyleSheet, ViewProps, ViewStyle } from "react-native";
import { Colors } from "../../theme/colors";

function Header({ setIsBurgerOpen, style }: {
    setIsBurgerOpen: React.Dispatch<React.SetStateAction<boolean>>,
    style?: ViewStyle
}) {
    return (
        <View style={[styles.container, style]}>
            <Image
                source={require('../../assets/adaptive-icon.png')}
                style={styles.logo}
                resizeMode="contain"
            />

            <View style={styles.rightControls}>
                <TouchableOpacity style={styles.bellWrapper}>
                    <View style={styles.bellDot} />
                    <Image
                        source={require('../../assets/main-screen/bell.png')}
                        style={styles.bellImage}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.burgerWrapper}
                    onPress={() => setIsBurgerOpen(true)}
                >
                    <Image
                        source={require('../../assets/main-screen/burger.png')}
                        style={styles.burgerImage}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default Header;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logo: {
        width: 34,
        height: 21,
    },
    rightControls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 19,
    },
    bellWrapper: {
        width: 22,
        height: 25,
        position: 'relative',
    },
    bellDot: {
        width: 8,
        height: 8,
        borderRadius: 100, // заменил '50%' на число — это правильно в React Native
        backgroundColor: Colors.red,
        position: 'absolute',
        zIndex: 10,
        right: 2,
        top: -2,
    },
    bellImage: {
        width: '100%',
        height: '100%',
        position: 'relative',
    },
    burgerWrapper: {
        width: 30,
        height: 20,
    },
    burgerImage: {
        width: '100%',
        height: '100%',
    },
});

