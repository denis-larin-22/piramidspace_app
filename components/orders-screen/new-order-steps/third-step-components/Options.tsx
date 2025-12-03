import { Pressable, ScrollView, Text, View } from "react-native";
import { IErrorStateMessage } from "../ThirdStep";
import AnimatedWrapper from "../../../animation/AnimatedWrapper";
import { Colors } from "../../../../theme/colors";
import { formStyles } from "./form-styles";
import { ArrowDown } from "../../../ui/ArrowDown";

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
        <View style={formStyles.colorContainer}>
            <Text style={formStyles.detailsText}>Оберіть опцію</Text>

            <Pressable onPress={toggleOptionList}>
                <Text style={[
                    formStyles.selectField,
                    { borderColor: isOptionsListOpen ? Colors.blue : Colors.blueLight },
                    isError.errorFieldNumber === 5 && formStyles.borderRed
                ]}>{activeOption || "Оберіть опцію"}</Text>
            </Pressable>
            <ArrowDown isRotate={isOptionsListOpen} style={formStyles.arrowIcon} />

            {isOptionsListOpen && (
                <AnimatedWrapper
                    useOpacity
                    useScale
                    offsetY={-20}
                    style={[formStyles.dropdownMenu, {
                        minHeight: 50,
                    }]}
                >
                    <ScrollView style={formStyles.scrollModal}>
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
                                            formStyles.productItem,
                                            activeOption === option && { backgroundColor: Colors.pale },
                                        ]}
                                        onPress={() => optionsListHandler(option)}
                                    >
                                        <Text style={formStyles.productItemText}>{option}</Text>
                                    </Pressable>
                                </AnimatedWrapper>
                            ))
                            :
                            <Text style={formStyles.absentValueText}>значення відсутні</Text>
                        }
                    </ScrollView>
                </AnimatedWrapper>
            )}
        </View>
    )
};