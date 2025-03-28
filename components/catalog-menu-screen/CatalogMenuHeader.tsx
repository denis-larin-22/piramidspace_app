import { Image, StyleSheet, View } from "react-native";
import BackButton from "../ui/BackButton";
import Logo from "../ui/Logo";

interface IProps {
    backButtonPressHandler: () => void
}

function CatalogMenuHeader({ backButtonPressHandler }: IProps) {
    return (
        <>
            <View style={styles.topWrap}>
                <BackButton
                    text="Головний екран"
                    onPressAction={backButtonPressHandler}
                />

                <Logo />
            </View>

            <Image
                source={require("../../assets/catalog-screen/menu-decorate-text.png")}
                style={styles.mainText}
            />
        </>
    )
};

export default CatalogMenuHeader;

const styles = StyleSheet.create({
    topWrap: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    mainText: {
        maxWidth: "100%",
        height: 45,
        resizeMode: "contain",
        marginTop: 30,
        marginBottom: 20
    },
});