import { StyleSheet, Text, TextInput, View } from "react-native";
import { Fonts } from "../../../theme/fonts";
import { Colors } from "../../../theme/colors";

function Count({ count, countHandler }: { count: string, countHandler: (value: number) => void }) {
    return (
        <View style={styles.wrap}>
            <View style={{ minWidth: '47%' }}>
                <View style={styles.rowLabel}>
                    <Text style={styles.detailsText}>Кількість </Text>
                    {/* <Text style={styles.labelNote}>(габарит)</Text> */}
                </View>
                <TextInput
                    keyboardType="number-pad"
                    style={styles.input}
                    placeholder="0"
                    value={count === "0" ? '' : count.toString()}
                    onChangeText={(value) => { countHandler(+Number(value).toFixed(0)) }}
                    maxLength={3}
                />
                <Text style={styles.unitLabel}>од</Text>
            </View>
        </View>
    )
}

export default Count;

const styles = StyleSheet.create({
    wrap: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    rowLabel: {
        flexDirection: "row",
        alignItems: "center",
    },
    detailsText: {
        marginTop: 5,
        fontFamily: Fonts.comfortaa600,
        fontSize: 14,
        lineHeight: 16,
        color: Colors.gray,
    },
    labelNote: {
        fontFamily: Fonts.comfortaa700,
        fontSize: 12,
        color: Colors.blue,
    },
    input: {
        marginTop: 4,
        fontFamily: Fonts.openSans400,
        fontSize: 14,
        color: "black",
        backgroundColor: "white",
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 31,
        borderWidth: 2,
        borderColor: Colors.blueLight,
        position: 'relative',
        zIndex: 10
    },
    unitLabel: {
        fontFamily: Fonts.openSans400,
        fontSize: 14,
        color: Colors.gray,
        position: "absolute",
        bottom: 10,
        right: 10,
        zIndex: 20
    },
});