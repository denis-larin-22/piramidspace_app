import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
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
            <View style={formStyles.dropdownWrap}>
                <Text style={formStyles.detailsText}>Фіксація</Text>
                <View style={formStyles.line}></View>
            </View>

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
                    style={styles.wrap}
                >
                    <ScrollView
                        style={{ maxHeight: 105 }}
                        persistentScrollbar={true}
                        nestedScrollEnabled
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator
                        scrollIndicatorInsets={{ right: 2 }}
                    >
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

const styles = StyleSheet.create({
    wrap: {
        maxHeight: 105,
        width: "100%",
        backgroundColor: "white",
        borderRadius: 17,
        position: "absolute",
        bottom: "62%",
        zIndex: 50,
        padding: 8,
        paddingBottom: 4,

        // iOS shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,

        // Android shadow
        elevation: 5,
    }
});