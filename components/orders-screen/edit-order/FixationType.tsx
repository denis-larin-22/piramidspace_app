import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Fonts } from "../../../theme/fonts";
import { Colors } from "../../../theme/colors";
import { useState } from "react";
import AnimatedWrapper from "../../animation/AnimatedWrapper";
import { ArrowDown } from "../../ui/ArrowDown";
import { formStyles } from "../new-order-steps/third-step-components/form-styles";

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
            <Text style={formStyles.detailsText}>Фіксація</Text>

            <Pressable onPress={() => setIsFixationTypeListOpen(!isFixationTypeListOpen)}>
                <Text style={[
                    formStyles.selectField,
                    { borderColor: Colors.blueLight }
                ]}>{fixation}</Text>
            </Pressable>
            <ArrowDown isRotate={isFixationTypeListOpen} style={formStyles.arrowIcon} />

            {isFixationTypeListOpen && (
                <AnimatedWrapper
                    useOpacity
                    useScale
                    offsetY={-20}
                    style={formStyles.dropdownMenu}
                >
                    <ScrollView style={formStyles.scrollModal}>
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
                                            formStyles.productItem,
                                            (fixation !== null && fixation === fixationType) && { backgroundColor: Colors.pale },
                                        ]}
                                        onPress={() => {
                                            // const fixationValue = fixationType === "ліворуч" ? "left" : "right";
                                            fixationHandler(fixationType);
                                            setIsFixationTypeListOpen(false);
                                        }}
                                    >
                                        <Text style={formStyles.productItemText}>{fixationType}</Text>
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

export default FixationType;