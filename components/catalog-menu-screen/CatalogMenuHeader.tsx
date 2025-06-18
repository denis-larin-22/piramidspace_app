import { Image, StyleSheet, View } from "react-native";
import Logo from "../ui/Logo";
import AnimatedWrapper from "../animation/AnimatedWrapper";

function CatalogMenuHeader() {
    return (
        <AnimatedWrapper
            useOpacity
            offsetX={50}
            delay={200}
            duration={300}
        >
            <Logo />

            <Image
                source={require("../../assets/catalog-screen/menu-decorate-text.png")}
                style={styles.mainText}
            />
        </AnimatedWrapper>
    )
};

export default CatalogMenuHeader;

const styles = StyleSheet.create({
    mainText: {
        maxWidth: "100%",
        height: 45,
        resizeMode: "contain",
        marginTop: 30,
        marginBottom: 20
    },
});