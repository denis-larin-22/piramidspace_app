import { Pressable, ScrollView, Text, View } from "react-native";
import { IErrorStateMessage } from "../ThirdStep";
import AnimatedWrapper from "../../../animation/AnimatedWrapper";
import { Colors } from "../../../../theme/colors";
import { Fixation } from "../../../../lib/api/orders-screen/groups-and-products";
import { formStyles } from "./form-styles";
import { ArrowDown } from "../../../ui/ArrowDown";

export default function FixationType({
    activeFixationType,
    fixationTypeList,
    isFixationTypeListOpen,
    isError,
    toggleFixationTypeList,
    fixationTypesListHandler
}: {
    activeFixationType: Fixation | null,
    fixationTypeList: Fixation[],
    isFixationTypeListOpen: boolean,
    isError: IErrorStateMessage,
    toggleFixationTypeList: () => void,
    fixationTypesListHandler: (type: Fixation) => void
}) {
    const fullList: Fixation[] = [
        ...fixationTypeList,
        {
            name: "без фіксації",
            price: 0,
            unit: ""
        }
    ];

    return (
        <View style={formStyles.colorContainer}>
            <Text style={formStyles.detailsText}>Фіксація</Text>

            <Pressable onPress={toggleFixationTypeList}>
                <Text style={[
                    formStyles.selectField,
                    { borderColor: isFixationTypeListOpen ? Colors.blue : Colors.blueLight },
                    isError.errorFieldNumber === 6 && formStyles.borderRed
                ]}>{activeFixationType === null ? "Оберіть тип" : activeFixationType.name}</Text>
            </Pressable>
            <ArrowDown isRotate={isFixationTypeListOpen} style={formStyles.arrowIcon} />

            {isFixationTypeListOpen && (
                <AnimatedWrapper
                    useOpacity
                    useScale
                    offsetY={-20}
                    style={[formStyles.dropdownMenu, {
                        minHeight: 80,
                    }]}
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
                                        (activeFixationType !== null && activeFixationType === fixationType) && { backgroundColor: Colors.pale },
                                        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }
                                    ]}
                                    onPress={() => fixationTypesListHandler(fixationType)}
                                >
                                    <Text style={formStyles.productItemText}>{fixationType.name}</Text>
                                    <Text style={[formStyles.productItemText, { color: Colors.gray }]}>{fixationType.price}$</Text>
                                </Pressable>
                            </AnimatedWrapper>
                        ))}
                    </ScrollView>
                </AnimatedWrapper>
            )}
        </View>
    )

}