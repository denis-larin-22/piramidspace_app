import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import AnimatedWrapper from "../../animation/AnimatedWrapper";
import { Colors } from "../../../theme/colors";
import { Fonts } from "../../../theme/fonts";
import { useState } from "react";
import { ArrowDown } from "../../ui/ArrowDown";

function Color({
    сolor,
    colorList,
    colorHandler
}: {
    сolor: string,
    colorList: string[],
    colorHandler: (color: string) => void
}) {
    const [isColorListOpen, setIsColorListOpen] = useState<boolean>(false);

    return (
        <View>
            <Text style={styles.detailsText}>Колір</Text>

            <Pressable onPress={() => setIsColorListOpen(!isColorListOpen)}>
                <Text style={[
                    styles.selectField,
                ]}>{сolor}</Text>
            </Pressable>
            <ArrowDown isRotate={isColorListOpen} style={styles.arrowIcon} />

            {isColorListOpen && (
                <AnimatedWrapper
                    useOpacity
                    useScale
                    offsetY={-20}
                    style={styles.dropdownMenu}
                >
                    <ScrollView style={styles.scrollModal}>
                        {colorList.length ?
                            colorList.map((colorName, index) => (
                                <AnimatedWrapper
                                    key={index}
                                    useOpacity
                                    offsetY={10}
                                    delay={150 + (30 * index)}
                                >
                                    <Pressable
                                        style={[
                                            styles.listItem,
                                            (сolor !== null && сolor === colorName) && { backgroundColor: Colors.pale },
                                        ]}
                                        onPress={() => {
                                            colorHandler(colorName);
                                            setIsColorListOpen(false);
                                        }}
                                    >
                                        <Text style={styles.listItemText}>{colorName}</Text>
                                    </Pressable>
                                </AnimatedWrapper>
                            ))
                            :
                            <Text style={styles.absentValueText}>значення відсутні</Text>
                        }
                    </ScrollView>
                </AnimatedWrapper>
            )}
        </View>
    )
}

export default Color;

const styles = StyleSheet.create({
    detailsText: {
        marginTop: 5,
        fontFamily: Fonts.comfortaa600,
        fontSize: 14,
        lineHeight: 16,
        color: Colors.gray,
    },
    selectField: {
        marginTop: 4,
        fontFamily: Fonts.openSans400,
        fontSize: 14,
        lineHeight: 16,
        color: "black",
        backgroundColor: "white",
        paddingVertical: 5,
        paddingHorizontal: 12,
        borderRadius: 31,
        borderWidth: 2,
        borderColor: Colors.blueLight
    },
    arrowIcon: {
        position: "absolute",
        zIndex: 10,
        right: 10,
        top: -20,
    },
    dropdownMenu: {
        maxHeight: 321,
        minHeight: 80,
        width: "100%",
        backgroundColor: "white",
        borderRadius: 17,
        position: "absolute",
        top: "105%",
        padding: 8,
        paddingBottom: 4,
        zIndex: 1000,
        elevation: 10,

        // iOS shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    scrollModal: {
        maxHeight: 321,
    },
    absentValueText: {
        fontFamily: Fonts.openSans400,
        fontSize: 12,
        lineHeight: 14,
        color: Colors.gray,
        marginLeft: 5
    },
    listItem: {
        paddingTop: 3,
        paddingBottom: 3,
        marginBottom: 5,
        borderRadius: 70,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderColor: Colors.pale,
    },
    listItemText: {
        fontFamily: Fonts.openSans400,
        fontSize: 14,
        color: "black",
    },
});