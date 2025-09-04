import { Pressable, ScrollView, Text, View } from "react-native";
import { ArrowDown, IErrorStateMessage, thirdStepStyles } from "../ThirdStep";
import AnimatedWrapper from "../../../animation/AnimatedWrapper";
import { Colors } from "../../../../theme/colors";

export default function Color({
    activeColor,
    colorsList,
    isColorListOpen,
    isError,
    toggleColorList,
    colorsListHandler
}: {
    activeColor: string | null,
    colorsList: string[],
    isColorListOpen: boolean,
    isError: IErrorStateMessage,
    toggleColorList: () => void,
    colorsListHandler: (color: string) => void
}) {
    return (
        <View style={thirdStepStyles.colorContainer}>
            <Text style={thirdStepStyles.detailsText}>Колір системи</Text>

            <Pressable onPress={toggleColorList}>
                <Text style={[thirdStepStyles.selectField, isError.errorFieldNumber === 5 && thirdStepStyles.borderRed]}>{activeColor || "Оберіть колір"}</Text>
            </Pressable>
            <ArrowDown isRotate={isColorListOpen} style={thirdStepStyles.arrowIcon} />

            {isColorListOpen && (
                <AnimatedWrapper useOpacity offsetY={-20} style={thirdStepStyles.dropdownMenu}>
                    <ScrollView style={thirdStepStyles.scrollModal}>
                        {colorsList.length ?
                            colorsList.map((color, index) => (
                                <Pressable
                                    key={index}
                                    style={[
                                        thirdStepStyles.productItem,
                                        activeColor === color && { backgroundColor: Colors.pale },
                                    ]}
                                    onPress={() => colorsListHandler(color)}
                                >
                                    <Text style={thirdStepStyles.productItemText}>{color}</Text>
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