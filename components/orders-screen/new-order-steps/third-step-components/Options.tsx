import { Pressable, ScrollView, Text, View } from "react-native";
import { ArrowDown, IErrorStateMessage, thirdStepStyles } from "../ThirdStep";
import AnimatedWrapper from "../../../animation/AnimatedWrapper";
import { Colors } from "../../../../theme/colors";

export default function Options({
    activeOption,
    optionsList,
    isOptionsListOpen,
    isError,
    toggleOptionList,
    optionsListHandler
}: {
    activeOption: string | null,
    optionsList: string[],
    isOptionsListOpen: boolean,
    isError: IErrorStateMessage,
    toggleOptionList: () => void,
    optionsListHandler: (color: string) => void
}) {

    return (
        <View style={thirdStepStyles.colorContainer}>
            <Text style={thirdStepStyles.detailsText}>Оберіть опцію</Text>

            <Pressable onPress={toggleOptionList}>
                <Text style={[
                    thirdStepStyles.selectField,
                    { borderColor: isOptionsListOpen ? Colors.blue : Colors.blueLight },
                    isError.errorFieldNumber === 5 && thirdStepStyles.borderRed
                ]}>{activeOption || "Оберіть опцію"}</Text>
            </Pressable>
            <ArrowDown isRotate={isOptionsListOpen} style={thirdStepStyles.arrowIcon} />

            {isOptionsListOpen && (
                <AnimatedWrapper
                    useOpacity
                    useScale
                    offsetY={-20}
                    style={[thirdStepStyles.dropdownMenu, {
                        minHeight: 50,
                    }]}
                >
                    <ScrollView style={thirdStepStyles.scrollModal}>
                        {optionsList.length ?
                            optionsList.map((option, index) => (
                                <AnimatedWrapper
                                    key={index}
                                    useOpacity
                                    offsetY={10}
                                    delay={150 + (30 * index)}
                                >
                                    <Pressable
                                        style={[
                                            thirdStepStyles.productItem,
                                            activeOption === option && { backgroundColor: Colors.pale },
                                        ]}
                                        onPress={() => optionsListHandler(option)}
                                    >
                                        <Text style={thirdStepStyles.productItemText}>{option}</Text>
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
};