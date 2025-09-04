import { Pressable, ScrollView, Text, View } from "react-native";
import { ArrowDown, IErrorStateMessage, thirdStepStyles } from "../ThirdStep";
import AnimatedWrapper from "../../../animation/AnimatedWrapper";
import { Colors } from "../../../../theme/colors";

export default function FixationType({
    activeFixationType,
    fixationTypeList,
    isFixationTypeListOpen,
    isError,
    toggleFixationTypeList,
    fixationTypesListHandler
}: {
    activeFixationType: string | null,
    fixationTypeList: string[],
    isFixationTypeListOpen: boolean,
    isError: IErrorStateMessage,
    toggleFixationTypeList: () => void,
    fixationTypesListHandler: (type: string) => void
}) {
    return (
        <View style={thirdStepStyles.colorContainer}>
            <Text style={thirdStepStyles.detailsText}>Фіксація</Text>

            <Pressable onPress={toggleFixationTypeList}>
                <Text style={[thirdStepStyles.selectField, isError.errorFieldNumber === 6 && thirdStepStyles.borderRed]}>{activeFixationType === null ? "Оберіть тип" : activeFixationType}</Text>
            </Pressable>
            <ArrowDown isRotate={isFixationTypeListOpen} style={thirdStepStyles.arrowIcon} />

            {isFixationTypeListOpen && (
                <AnimatedWrapper useOpacity offsetY={-20} style={thirdStepStyles.dropdownMenu}>
                    <ScrollView style={thirdStepStyles.scrollModal}>
                        {fixationTypeList.length ?
                            fixationTypeList.map((fixationType, index) => (
                                <Pressable
                                    key={index}
                                    style={[
                                        thirdStepStyles.productItem,
                                        (activeFixationType !== null && activeFixationType === fixationType) && { backgroundColor: Colors.pale },
                                    ]}
                                    onPress={() => fixationTypesListHandler(fixationType)}
                                >
                                    <Text style={thirdStepStyles.productItemText}>{fixationType}</Text>
                                </Pressable>
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