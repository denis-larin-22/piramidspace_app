import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import AnimatedWrapper from "../../animation/AnimatedWrapper";
import { Colors } from "../../../theme/colors";
import { Fonts } from "../../../theme/fonts";
import { useState } from "react";
import { ArrowDown } from "../../ui/ArrowDown";
import { formStyles } from "../new-order-steps/third-step-components/form-styles";

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
            <Text style={formStyles.detailsText}>Колір</Text>

            <Pressable onPress={() => setIsColorListOpen(!isColorListOpen)}>
                <Text style={[
                    formStyles.selectField,
                    { borderColor: Colors.blueLight }
                ]}>{сolor}</Text>
            </Pressable>
            <ArrowDown isRotate={isColorListOpen} style={formStyles.arrowIcon} />

            {isColorListOpen && (
                <AnimatedWrapper
                    useOpacity
                    useScale
                    offsetY={-20}
                    style={formStyles.dropdownMenu}
                >
                    <ScrollView style={formStyles.scrollModal}>
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
                                            formStyles.productItem,
                                            (сolor !== null && сolor === colorName) && { backgroundColor: Colors.pale },
                                        ]}
                                        onPress={() => {
                                            colorHandler(colorName);
                                            setIsColorListOpen(false);
                                        }}
                                    >
                                        <Text style={formStyles.productItemText}>{colorName}</Text>
                                    </Pressable>
                                </AnimatedWrapper>
                            ))
                            :
                            <Text style={[formStyles.absentValueText, { marginBottom: 5 }]}>значення відсутні</Text>
                        }
                    </ScrollView>
                </AnimatedWrapper>
            )}
        </View>
    )
}

export default Color;