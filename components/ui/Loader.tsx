import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Colors } from "../../theme/colors";

function Loader() {
    return (
        <View style={styles.container}>
            <View
                style={styles.wrap}
            >
                <ActivityIndicator
                    color={Colors.blue}
                    size={"large"}
                />
                <Text style={styles.text}>
                    👤 Вхід в кабінет
                </Text>
            </View>
        </View>
    )
};

export default Loader;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#00000080",
        height: '100%',
        width: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    wrap: {
        width: 250,
        height: 100,
        backgroundColor: Colors.pale,
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        borderRadius: 14,
        borderTopWidth: 3,
        borderColor: Colors.blue,

    },
    text: {
        fontSize: 14,
        fontWeight: 500
    },
})