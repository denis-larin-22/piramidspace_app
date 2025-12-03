import { Pressable, ScrollView, Text, View } from "react-native";
import AnimatedWrapper from "../../../animation/AnimatedWrapper";
import { IErrorStateMessage } from "../ThirdStep";
import { Colors } from "../../../../theme/colors";
import { formStyles } from "./form-styles";
import { ArrowDown } from "../../../ui/ArrowDown";

export default function ControlType({
    isControlTypeListOpen,
    toggleControlTypeList,
    cotrolTypesList,
    activeControlType,
    controlTypesListHandler,
    isError
}: {
    isControlTypeListOpen: boolean,
    toggleControlTypeList: () => void,
    cotrolTypesList: string[],
    activeControlType: string | null,
    controlTypesListHandler: (type: string) => void,
    isError: IErrorStateMessage
}) {
    return (
        <View style={formStyles.inputContainer}>
            <Text style={formStyles.detailsText}>Керування</Text>
            <Pressable onPress={toggleControlTypeList}>
                <Text
                    style={[
                        formStyles.selectField,
                        { borderColor: isControlTypeListOpen ? Colors.blue : Colors.blueLight },
                        isError.errorFieldNumber === 3 && formStyles.borderRed
                    ]}>{activeControlType || "Оберіть тип"}</Text>
            </Pressable>
            <ArrowDown isRotate={isControlTypeListOpen} style={formStyles.arrowIcon} />

            {isControlTypeListOpen && <AnimatedWrapper
                useOpacity
                useScale
                offsetY={-20}
                style={[formStyles.dropdownMenu, {
                    minHeight: 50,
                }]}
            >
                <ScrollView style={formStyles.scrollModal}>
                    {cotrolTypesList.length ?
                        cotrolTypesList.map((type, index) => (
                            <AnimatedWrapper
                                key={index}
                                useOpacity
                                offsetY={10}
                                delay={150 + (30 * index)}
                            >
                                <Pressable
                                    style={[
                                        formStyles.productItem,
                                        activeControlType === type && { backgroundColor: Colors.pale },
                                    ]}
                                    onPress={() => controlTypesListHandler(type)}
                                >
                                    <Text style={formStyles.productItemText}>{type}</Text>
                                </Pressable>
                            </AnimatedWrapper>
                        ))
                        :
                        <Text style={formStyles.absentValueText}>Значення відсутні</Text>
                    }
                </ScrollView>
            </AnimatedWrapper>
            }
        </View>
    )
}