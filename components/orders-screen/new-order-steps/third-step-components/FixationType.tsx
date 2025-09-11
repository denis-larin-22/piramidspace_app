import { Pressable, ScrollView, Text, View } from "react-native";
import { ArrowDown, IErrorStateMessage, thirdStepStyles } from "../ThirdStep";
import AnimatedWrapper from "../../../animation/AnimatedWrapper";
import { Colors } from "../../../../theme/colors";
import { Fixation } from "../../../../lib/api/orders-screen/groups-and-products";

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
    return (
        <View style={thirdStepStyles.colorContainer}>
            <Text style={thirdStepStyles.detailsText}>Фіксація</Text>

            <Pressable onPress={toggleFixationTypeList}>
                <Text style={[
                    thirdStepStyles.selectField,
                    { borderColor: isFixationTypeListOpen ? Colors.blue : Colors.blueLight },
                    isError.errorFieldNumber === 6 && thirdStepStyles.borderRed
                ]}>{activeFixationType === null ? "Оберіть тип" : activeFixationType.name}</Text>
            </Pressable>
            <ArrowDown isRotate={isFixationTypeListOpen} style={thirdStepStyles.arrowIcon} />

            {isFixationTypeListOpen && (
                <AnimatedWrapper
                    useOpacity
                    useScale
                    offsetY={-20}
                    style={[thirdStepStyles.dropdownMenu, {
                        minHeight: 80,
                    }]}
                >
                    <ScrollView style={thirdStepStyles.scrollModal}>
                        {fixationTypeList.length ?
                            fixationTypeList.map((fixationType, index) => (
                                <AnimatedWrapper
                                    key={index}
                                    useOpacity
                                    offsetY={10}
                                    delay={150 + (30 * index)}
                                >
                                    <Pressable
                                        style={[
                                            thirdStepStyles.productItem,
                                            (activeFixationType !== null && activeFixationType === fixationType) && { backgroundColor: Colors.pale },
                                        ]}
                                        onPress={() => fixationTypesListHandler(fixationType)}
                                    >
                                        <Text style={thirdStepStyles.productItemText}>{fixationType.name}</Text>
                                    </Pressable>
                                </AnimatedWrapper>
                            ))
                            :
                            <Text style={thirdStepStyles.absentValueText}>значення відсутні</Text>
                        }
                    </ScrollView>
                </AnimatedWrapper>
            )}
        </View>
    )

}