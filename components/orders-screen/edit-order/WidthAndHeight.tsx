import { StyleSheet, Text, TextInput, View } from "react-native";
import { Fonts } from "../../../theme/fonts";
import { Colors } from "../../../theme/colors";
import Warning from "../../ui/Warning";
import { useState } from "react";

function WidthAndHeight({
    unit,

    width,
    maxWidth,
    widthHandler,

    height,
    maxHeight,
    heightHandler
}: {
    unit: string,

    width: number,
    maxWidth: number,
    widthHandler: (value: number) => void,

    height: number,
    maxHeight: number
    heightHandler: (value: number) => void,
}) {
    const [warningInput, setWarningInput] = useState<number | null>(null);


    return (
        <View style={styles.wrap}>
            <View style={{ minWidth: '47%' }}>
                <View style={styles.rowLabel}>
                    <Text style={styles.detailsText}>Ширина </Text>
                    {/* <Text style={styles.labelNote}>(габарит)</Text> */}
                    <Warning isVissible={warningInput === 1} text={maxWidth} />
                </View>
                <TextInput
                    placeholder="0"
                    keyboardType="number-pad"
                    style={styles.input}
                    value={width === 0 ? '' : width.toString()}
                    onChangeText={(value) => {
                        if (+value > maxWidth) {
                            setWarningInput(1);
                            setTimeout(() => setWarningInput(null), 3500);
                            widthHandler(maxWidth);
                        } else {
                            widthHandler(+value)
                        }
                    }}
                    maxLength={8}
                />
                <Text style={styles.unitLabel}>{unit}</Text>
            </View>
            <View style={{ minWidth: '47%' }}>
                <View style={styles.rowLabel}>
                    <Text style={styles.detailsText}>Висота </Text>
                    {/* <Text style={styles.labelNote}>(габарит)</Text> */}
                    <Warning isVissible={warningInput === 2} text={maxHeight} />
                </View>
                <TextInput
                    keyboardType="number-pad"
                    style={styles.input}
                    placeholder="0"
                    value={height === 0 ? '' : height.toString()}
                    onChangeText={(value) => {
                        if (+value > maxHeight) {
                            setWarningInput(2);
                            setTimeout(() => setWarningInput(null), 3500);
                            heightHandler(maxHeight);
                        } else {
                            heightHandler(+value)
                        }
                    }}
                    maxLength={8}
                />
                <Text style={styles.unitLabel}>{unit}</Text>
            </View>
        </View>
    )
}

export default WidthAndHeight;

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