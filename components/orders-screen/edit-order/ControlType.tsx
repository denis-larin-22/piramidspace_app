import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import AnimatedWrapper from "../../animation/AnimatedWrapper";
import { Colors } from "../../../theme/colors";
import { Fonts } from "../../../theme/fonts";
import { useState } from "react";
import { ArrowDown } from "../../ui/ArrowDown";

function ControlType({
    control,
    controlTypesList,
    controlHandler
}: {
    control: string,
    controlTypesList: string[]
    controlHandler: (side: "left" | "right" | string) => void
}) {
    const [isControlListOpen, setIsControlListOpen] = useState<boolean>(false);

    return (
        <View>
            <Text style={styles.detailsText}>Керування</Text>

            <Pressable onPress={() => setIsControlListOpen(!isControlListOpen)}>
                <Text style={styles.selectField}>{ParseSideValue(control, false)}</Text>
            </Pressable>
            <ArrowDown isRotate={isControlListOpen} style={styles.arrowIcon} />

            {isControlListOpen && (
                <AnimatedWrapper
                    useOpacity
                    useScale
                    offsetY={-20}
                    style={[styles.dropdownMenu, {
                        minHeight: 80,
                    }]}
                >
                    <ScrollView style={styles.scrollModal}>
                        {controlTypesList.length ?
                            controlTypesList.map((type, index) => (
                                <AnimatedWrapper
                                    key={index}
                                    useOpacity
                                    offsetY={10}
                                    delay={150 + (30 * index)}
                                >
                                    <Pressable
                                        style={[
                                            styles.listItem,
                                            (control !== null && control === type) && { backgroundColor: Colors.pale },
                                        ]}
                                        onPress={() => {
                                            const sideType = ParseSideValue(type, true);

                                            controlHandler(sideType);
                                            setIsControlListOpen(false);
                                        }}
                                    >
                                        <Text style={styles.listItemText}>{type}</Text>
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

export default ControlType;

function ParseSideValue(value: string, isReverse: boolean = false) {
    if (isReverse) {
        return value === "ліворуч" ? "left" : "right"
    } else {
        return (value === "left" || value === "ліворуч") ? "ліворуч" : "праворуч"
    }
}

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
        borderRadius: 31,
        borderWidth: 2,
        paddingVertical: 5,
        paddingHorizontal: 12,
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
        width: "100%",
        backgroundColor: "white",
        borderRadius: 17,
        position: "absolute",
        top: "105%",
        zIndex: 50,
        padding: 8,
        paddingBottom: 4,

        // iOS shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,

        // Android shadow
        elevation: 5,
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