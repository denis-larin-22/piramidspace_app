import { StyleSheet, Image } from "react-native";
import MainLinks from "./MainLinks";
import { HomeScreenNavigationProp } from "../../screens/MainScreen";
import { Colors } from "../../theme/colors";
import AnimatedWrapper from "../animation/AnimatedWrapper";

function NavBar({ navigation, width }: { navigation: HomeScreenNavigationProp, width: number }) {
    return (
        <AnimatedWrapper
            style={[styles.linksWrap, { width: width }]}
            offsetY={400}
            useOpacity
            duration={300}
        >
            {/* Ads. Images */}
            <AnimatedWrapper
                style={styles.adsImage}
                useScale
                useOpacity
                delay={300}
            >
                <Image
                    source={{ uri: 'https://www.makemyblinds.co.uk/media/catalog/product/cache/4f056f72a16582089f5732dba9736180/b/e/bexley_sandstone_rp5055_cupdp_1.jpg' }}
                    style={{
                        width: '100%',
                        height: '100%',

                    }}
                />
            </AnimatedWrapper>
            {/* Screens links */}
            <MainLinks navigation={navigation} />
        </AnimatedWrapper>
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