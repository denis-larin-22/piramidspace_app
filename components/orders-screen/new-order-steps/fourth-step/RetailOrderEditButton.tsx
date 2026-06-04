import { Image, Pressable, StyleSheet, Text } from "react-native"
import { Colors } from "../../../../theme/colors"
import { Fonts } from "../../../../theme/fonts"

function RetailOrderEditButton({ btnHandler }: { btnHandler: () => void }) {
    return (
        <Pressable
            onPress={btnHandler}
            style={styles.btn}
        >
            <Image
                source={require('../../../../assets/orders-screen/edit-btn.png')}
                style={{
                    width: 15,
                    height: 15,
                    borderRadius: 50,
                    marginRight: 5
                }} />
            <Text style={styles.text}>Редагувати</Text>
        </Pressable>
    )
};

export default RetailOrderEditButton;

const styles = StyleSheet.create({
    btn: {
        position: 'absolute',
        right: 17,
        top: 5,
        alignSelf: "center",
        height: 30,
        borderRadius: 12,
        paddingHorizontal: 6,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 3,
        backgroundColor: "#ffffff",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 6,
    },
    text: {
        fontFamily: Fonts.comfortaa700,
        fontSize: 13,
        lineHeight: 15,
        color: Colors.blue
    }
});
