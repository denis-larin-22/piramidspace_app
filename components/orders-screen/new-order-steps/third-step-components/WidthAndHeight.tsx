import { Text, TextInput, View } from "react-native"
import { INewOrderObject } from "../../AddNewOrder"
import { thirdStepStyles } from "../ThirdStep"

function WidthAndHeight({ orderObject, setOrderObject, errorFieldNumber }: {
    orderObject: INewOrderObject,
    setOrderObject: React.Dispatch<React.SetStateAction<INewOrderObject>>,
    errorFieldNumber: number | null
}) {
    const WIDTH_DIFFERENCE = 3;
    const HEIGHT_DIFFERENCE = 5;

    return (
        <>
            {/* ====== ШИРИНА ====== */}
            <View style={thirdStepStyles.row}>
                {/* Ширина (габарит) */}
                <View style={thirdStepStyles.inputContainer}>
                    <View style={thirdStepStyles.rowLabel}>
                        <Text style={thirdStepStyles.detailsText}>Ширина </Text>
                        <Text style={thirdStepStyles.labelNote}>(габарит)</Text>
                    </View>
                    <TextInput
                        keyboardType="number-pad"
                        style={[thirdStepStyles.input, errorFieldNumber === 2 && thirdStepStyles.borderRed]}
                        placeholder="0"
                        value={orderObject.width_gab || ""}
                        onChangeText={(value) => {
                            setOrderObject({
                                ...orderObject,
                                width_gab: value,
                                width_shtapik: value ? String(Math.max(0, +value - WIDTH_DIFFERENCE)) : ""
                            })
                        }}
                    />
                    <Text style={thirdStepStyles.unitLabel}>см</Text>
                </View>

                {/* Ширина (по штапику) */}
                <View style={thirdStepStyles.inputContainer}>
                    <View style={thirdStepStyles.rowLabel}>
                        <Text style={thirdStepStyles.detailsText}>Ширина </Text>
                        <Text style={thirdStepStyles.labelNoteSmall}>(по штапику)</Text>
                    </View>
                    <TextInput
                        keyboardType="number-pad"
                        style={[thirdStepStyles.input, errorFieldNumber === 2 && thirdStepStyles.borderRed]}
                        placeholder="0"
                        value={orderObject.width_shtapik || ""}
                        onChangeText={(value) => {
                            setOrderObject({
                                ...orderObject,
                                width_shtapik: value,
                                width_gab: value ? String(+value + WIDTH_DIFFERENCE) : ""
                            })
                        }}
                    />
                    <Text style={thirdStepStyles.unitLabel}>см</Text>
                </View>
            </View>

            {/* ====== ВЫСОТА ====== */}
            <View style={thirdStepStyles.row}>
                {/* Высота (габарит) */}
                <View style={thirdStepStyles.inputContainer}>
                    <View style={thirdStepStyles.rowLabel}>
                        <Text style={thirdStepStyles.detailsText}>Висота </Text>
                        <Text style={thirdStepStyles.labelNote}>(габарит)</Text>
                    </View>
                    <TextInput
                        keyboardType="number-pad"
                        style={[thirdStepStyles.input, errorFieldNumber === 2 && thirdStepStyles.borderRed]}
                        placeholder="0"
                        value={orderObject.height_gab || ""}
                        onChangeText={(value) => {
                            setOrderObject({
                                ...orderObject,
                                height_gab: value,
                                height_shtapik: value ? String(Math.max(0, +value - HEIGHT_DIFFERENCE)) : ""
                            })
                        }}
                    />
                    <Text style={thirdStepStyles.unitLabel}>см</Text>
                </View>

                {/* Высота (по штапику) */}
                <View style={thirdStepStyles.inputContainer}>
                    <View style={thirdStepStyles.rowLabel}>
                        <Text style={thirdStepStyles.detailsText}>Висота </Text>
                        <Text style={thirdStepStyles.labelNoteSmall}>(по штапику)</Text>
                    </View>
                    <TextInput
                        keyboardType="number-pad"
                        style={[thirdStepStyles.input, errorFieldNumber === 2 && thirdStepStyles.borderRed]}
                        placeholder="0"
                        value={orderObject.height_shtapik || ""}
                        onChangeText={(value) => {
                            setOrderObject({
                                ...orderObject,
                                height_shtapik: value,
                                height_gab: value ? String(+value + HEIGHT_DIFFERENCE) : ""
                            })
                        }}
                    />
                    <Text style={thirdStepStyles.unitLabel}>см</Text>
                </View>
            </View>
        </>
    )
}

export default WidthAndHeight;
