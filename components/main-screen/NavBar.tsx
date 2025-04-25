import { StyleSheet, View, Animated, Easing, Image } from "react-native";
import { useEffect, useRef } from "react";
import MainLinks from "./MainLinks";
import { HomeScreenNavigationProp } from "../../screens/MainScreen";
import { Colors } from "../../theme/colors";

function NavBar({ navigation, width }: { navigation: HomeScreenNavigationProp, width: number }) {
    const slideAnim = useRef(new Animated.Value(70)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const adsOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 500,
                delay: 800,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                delay: 800,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
        ]).start();

        Animated.timing(adsOpacity, {
            toValue: 1,
            duration: 500,
            delay: 1100,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
        }).start();
    }, []);

    return (
        <Animated.View
            style={[
                styles.linksWrap,
                {
                    width: width,
                    transform: [{ translateY: slideAnim }],
                    opacity: fadeAnim,
                },
            ]}
        >
            {/* Ads. Images */}
            <Animated.View style={[styles.adsImage, { opacity: adsOpacity }]}>
                <Image
                    source={{ uri: 'https://www.makemyblinds.co.uk/media/catalog/product/cache/4f056f72a16582089f5732dba9736180/b/e/bexley_sandstone_rp5055_cupdp_1.jpg' }}
                    style={{
                        width: '100%',
                        height: '100%',

                    }}
                />
            </Animated.View>
            {/* Screens links */}
            <MainLinks navigation={navigation} />
        </Animated.View>
    );
}

export default NavBar;

const styles = StyleSheet.create({
    linksWrap: {
        backgroundColor: Colors.blue,
        height: '55%',
        position: 'absolute',
        bottom: 0,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
    },
    adsImage: {
        backgroundColor: 'black',
        width: '100%',
        height: 198,
        borderRadius: 8,
        position: 'absolute',
        left: 20,
        top: -125,
        overflow: 'hidden',
        // iOS shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,

        // Android shadow
        elevation: 5,
    },
});