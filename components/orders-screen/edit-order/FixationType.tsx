import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Fonts } from "../../../theme/fonts";
import { Colors } from "../../../theme/colors";
import { ArrowDown } from "../new-order-steps/ThirdStep";
import { useState } from "react";
import AnimatedWrapper from "../../animation/AnimatedWrapper";

function FixationType({
    fixation,
    fixationList,
    fixationHandler
}: {
    fixation: string,
    fixationList: string[],
    fixationHandler: (fixation: string) => void
}) {
    const [isFixationTypeListOpen, setIsFixationTypeListOpen] = useState<boolean>(false);

    return (
        <View>
            <Text style={styles.detailsText}>Фіксація</Text>

            <Pressable onPress={() => setIsFixationTypeListOpen(!isFixationTypeListOpen)}>
                <Text style={[
                    styles.selectField,
                ]}>{fixation}</Text>
            </Pressable>
            <ArrowDown isRotate={isFixationTypeListOpen} style={styles.arrowIcon} />

            {isFixationTypeListOpen && (
                <AnimatedWrapper
                    useOpacity
                    useScale
                    offsetY={-20}
                    style={[styles.dropdownMenu, {
                        minHeight: 80,
                    }]}
                >
                    <ScrollView style={styles.scrollModal}>
                        {fixationList.length ?
                            fixationList.map((fixationType, index) => (
                                <AnimatedWrapper
                                    key={index}
                                    useOpacity
                                    offsetY={10}
                                    delay={150 + (30 * index)}
                                >
                                    <Pressable
                                        style={[
                                            styles.listItem,
                                            (fixation !== null && fixation === fixationType) && { backgroundColor: Colors.pale },
                                        ]}
                                        onPress={() => {
                                            // const fixationValue = fixationType === "ліворуч" ? "left" : "right";
                                            fixationHandler(fixationType);
                                            setIsFixationTypeListOpen(false);
                                        }}
                                    >
                                        <Text style={styles.listItemText}>{fixationType}</Text>
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

export default FixationType;

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
        maxHeight: 120,
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
        maxHeight: 120,
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