import { StyleSheet, View } from "react-native";
import MainLinks from "./MainLinks";
import { HomeScreenNavigationProp } from "../../screens/MainScreen";
import { Colors } from "../../theme/colors";
import AnimatedWrapper from "../animation/AnimatedWrapper";
import { Banner } from "./Banner";

function NavBar({ navigation, width }: { navigation: HomeScreenNavigationProp, width: number }) {
    return (
        <AnimatedWrapper
            style={[styles.linksWrap, { width }]}
            offsetY={400}
            useOpacity
            duration={300}
        >
            {/* Ads. Images */}
            <Banner />
            {/* Screens links */}
            <MainLinks navigation={navigation} />
            {/* blue background */}
            <View style={[styles.background, { width }]} />
        </AnimatedWrapper>
    );
}

export default NavBar;

const styles = StyleSheet.create({
    linksWrap: {
        position: 'relative',
        bottom: 0,
        flexGrow: 1,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
    },
    background: {
        backgroundColor: Colors.blue,
        height: '100%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        position: 'absolute',
        top: 125,
        zIndex: -10,
    },
});
