import { StyleSheet, Text, TextInput, View } from "react-native";
import { Fonts } from "../../../theme/fonts";
import { Colors } from "../../../theme/colors";
import { useState } from "react";

function Comment({
    comment,
    commentHandler
}: {
    comment: string,
    commentHandler: (valueL: string) => void
}) {
    const [commentValue, setCommentValue] = useState<string>(comment);

    return (
        <View style={styles.wrap}>
            <View style={styles.rowLabel}>
                <Text style={styles.detailsText}>Коментарій </Text>
                {/* <Text style={styles.labelNote}>(габарит)</Text> */}
            </View>
            <TextInput
                keyboardType="default"
                style={styles.input}
                multiline
                textAlign="left"
                textAlignVertical="top"
                placeholder="Введіть коментарій"
                value={commentValue}
                onChangeText={(value) => {
                    setCommentValue(value);
                    commentHandler(value);
                }}
            />
        </View>
    )
}

export default Comment;

const styles = StyleSheet.create({
    wrap: {
        position: 'relative',
        zIndex: -2
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
        borderRadius: 16,
        borderWidth: 2,
        position: 'relative',
        zIndex: 10,
        height: 100,
        borderColor: Colors.blueLight
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