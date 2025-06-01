import { Image, StyleSheet, View } from "react-native";
import BackButton from "../ui/BackButton";
import Logo from "../ui/Logo";
import AnimatedWrapper from "../animation/AnimatedWrapper";

interface IProps {
    backButtonPressHandler: () => void
}

function CatalogMenuHeader({ backButtonPressHandler }: IProps) {
    return (
        <AnimatedWrapper
            useOpacity
            offsetX={50}
            delay={200}
            duration={300}
        >
            <View style={styles.topWrap}>
                <BackButton onPressAction={backButtonPressHandler} />

                <Logo />
            </View>

            <Image
                source={require("../../assets/catalog-screen/menu-decorate-text.png")}
                style={styles.mainText}
            />
        </AnimatedWrapper>
    )
};

export default CatalogMenuHeader;

const styles = StyleSheet.create({
    topWrap: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    mainText: {
        maxWidth: "100%",
        height: 45,
        resizeMode: "contain",
        marginTop: 30,
        marginBottom: 20
    },
});