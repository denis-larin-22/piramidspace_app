import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Fonts } from "../../../theme/fonts";
import { Colors } from "../../../theme/colors";
import { useState } from "react";
import AnimatedWrapper from "../../animation/AnimatedWrapper";
import { ArrowDown } from "../../ui/ArrowDown";
import { formStyles } from "../new-order-steps/third-step-components/form-styles";
import { Fixation } from "../../../lib/api/orders-screen/groups-and-products";

function FixationType({
    fixation,
    fixationList,
    fixationHandler
}: {
    fixation: string,
    fixationList: Fixation[],
    fixationHandler: (fixation: string) => void
}) {
    const [isFixationTypeListOpen, setIsFixationTypeListOpen] = useState<boolean>(false);

    const fullList: Fixation[] = [
        ...fixationList,
        {
            name: "без фіксації",
            price: 0,
            unit: ""
        }
    ]

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
                        {fullList.map((fixationType, index) => (
                            <AnimatedWrapper
                                key={index}
                                useOpacity
                                offsetY={10}
                                delay={150 + (30 * index)}
                            >
                                <Pressable
                                    style={[
                                        formStyles.productItem,
                                        (fixation !== null && fixation === fixationType.name) && { backgroundColor: Colors.pale },
                                        {
                                            flexDirection: 'row',
                                            justifyContent: 'space-between'
                                        }
                                    ]}
                                    onPress={() => {
                                        fixationHandler(fixationType.name);
                                        setIsFixationTypeListOpen(false);
                                    }}
                                >
                                    <Text style={formStyles.productItemText}>{fixationType.name}</Text>
                                    <Text style={[formStyles.productItemText, { color: Colors.gray }]}>{fixationType.price}$</Text>
                                </Pressable>
                            </AnimatedWrapper>
                        ))
                        }
                    </ScrollView>
                </AnimatedWrapper>
            )}
        </View>
    )
}

export default FixationType;