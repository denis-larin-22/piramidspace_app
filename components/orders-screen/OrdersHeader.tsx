import { useState } from "react";
import Header from "../ui/Header";
import BurgerMenu from "../ui/BurgerMenu";
import { StyleSheet, Text, View } from "react-native";
import { Avatar } from "../ui/Avatar";
import { Fonts } from "../../theme/fonts";
import AnimatedWrapper from "../animation/AnimatedWrapper";

function OrdersHeader() {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    return (
        <AnimatedWrapper
            useOpacity
            useScale
            offsetY={50}
            duration={300}
        >
            <Header />
            <BurgerMenu isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />

            <View style={styles.headerRow}            >
                <Text style={styles.title}>Замовлення</Text>
                <Avatar />
            </View>
        </AnimatedWrapper >
    )
}

export default OrdersHeader;

const styles = StyleSheet.create({
    headerRow: {
        marginTop: 19,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontFamily: Fonts.comfortaa700,
        fontSize: 20,
        color: 'black'
    },
});