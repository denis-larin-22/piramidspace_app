import { Pressable, ScrollView, Text, View } from "react-native";
import AnimatedWrapper from "../../../animation/AnimatedWrapper";
import { ArrowDown, IErrorStateMessage, thirdStepStyles } from "../ThirdStep";
import { Colors } from "../../../../theme/colors";

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
        <View style={thirdStepStyles.inputContainer}>
            <Text style={thirdStepStyles.detailsText}>Керування</Text>
            <Pressable onPress={toggleControlTypeList}>
                <Text
                    style={[
                        thirdStepStyles.selectField,
                        { borderColor: isControlTypeListOpen ? Colors.blue : Colors.blueLight },
                        isError.errorFieldNumber === 3 && thirdStepStyles.borderRed
                    ]}>{activeControlType || "Оберіть тип"}</Text>
            </Pressable>
            <ArrowDown isRotate={isControlTypeListOpen} style={thirdStepStyles.arrowIcon} />

            {isControlTypeListOpen && <AnimatedWrapper
                useOpacity
                useScale
                offsetY={-20}
                style={[thirdStepStyles.dropdownMenu, {
                    minHeight: 50,
                }]}
            >
                <ScrollView style={thirdStepStyles.scrollModal}>
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
                                        thirdStepStyles.productItem,
                                        activeControlType === type && { backgroundColor: Colors.pale },
                                    ]}
                                    onPress={() => controlTypesListHandler(type)}
                                >
                                    <Text style={thirdStepStyles.productItemText}>{type}</Text>
                                </Pressable>
                            </AnimatedWrapper>
                        ))
                        :
                        <Text style={thirdStepStyles.absentValueText}>Значення відсутні</Text>
                    }
                </ScrollView>
            </AnimatedWrapper>
            }
        </View>
    )
}