import { Pressable, ScrollView, Text, View } from "react-native";
import { IErrorStateMessage } from "../ThirdStep";
import AnimatedWrapper from "../../../animation/AnimatedWrapper";
import { Colors } from "../../../../theme/colors";
import { formStyles } from "./form-styles";
import { ArrowDown } from "../../../ui/ArrowDown";

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
        <View style={formStyles.colorContainer}>
            <Text style={formStyles.detailsText}>Колір системи</Text>

            <Pressable onPress={toggleColorList}>
                <Text style={[
                    formStyles.selectField,
                    { borderColor: isColorListOpen ? Colors.blue : Colors.blueLight },
                    isError.errorFieldNumber === 5 && formStyles.borderRed
                ]}>{activeColor || "Оберіть колір"}</Text>
            </Pressable>
            <ArrowDown isRotate={isColorListOpen} style={formStyles.arrowIcon} />

            {isColorListOpen && (
                <AnimatedWrapper
                    useOpacity
                    useScale
                    offsetY={-20}
                    style={[formStyles.dropdownMenu, {
                        minHeight: 50,
                    }]}
                >
                    <ScrollView style={formStyles.scrollModal}>
                        {colorsList.length ?
                            colorsList.map((color, index) => (
                                <AnimatedWrapper
                                    key={index}
                                    useOpacity
                                    offsetY={10}
                                    delay={150 + (30 * index)}
                                >
                                    <Pressable
                                        style={[
                                            formStyles.productItem,
                                            activeColor === color && { backgroundColor: Colors.pale },
                                        ]}
                                        onPress={() => colorsListHandler(color)}
                                    >
                                        <Text style={formStyles.productItemText}>{color}</Text>
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
}