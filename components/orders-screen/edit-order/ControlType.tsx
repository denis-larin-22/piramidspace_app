import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import AnimatedWrapper from "../../animation/AnimatedWrapper";
import { Colors } from "../../../theme/colors";
import { Fonts } from "../../../theme/fonts";
import { useState } from "react";
import { ArrowDown } from "../../ui/ArrowDown";
import { formStyles } from "../new-order-steps/third-step-components/form-styles";

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
            <Text style={formStyles.detailsText}>Керування</Text>

            <Pressable onPress={() => setIsControlListOpen(!isControlListOpen)}>
                <Text style={[formStyles.selectField, { borderColor: Colors.blueLight }]}>{ParseSideValue(control, false)}</Text>
            </Pressable>
            <ArrowDown isRotate={isControlListOpen} style={formStyles.arrowIcon} />

            {isControlListOpen && (
                <AnimatedWrapper
                    useOpacity
                    useScale
                    offsetY={-20}
                    style={formStyles.dropdownMenu}
                >
                    <ScrollView style={formStyles.scrollModal}>
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
                                            formStyles.productItem,
                                            (control !== null && control === type) && { backgroundColor: Colors.pale },
                                        ]}
                                        onPress={() => {
                                            const sideType = ParseSideValue(type, true);

                                            controlHandler(sideType);
                                            setIsControlListOpen(false);
                                        }}
                                    >
                                        <Text style={formStyles.productItemText}>{type}</Text>
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

export default ControlType;

function ParseSideValue(value: string, isReverse: boolean = false) {
    if (isReverse) {
        return value === "ліворуч" ? "left" : "right"
    } else {
        return (value === "left" || value === "ліворуч") ? "ліворуч" : "праворуч"
    }
}