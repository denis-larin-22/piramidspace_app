import { Text, TextInput, View } from "react-native"
import { INewOrderObject } from "../../AddNewOrder"
import { thirdStepStyles } from "../ThirdStep"
import { Fragment, useState } from "react";
import { Colors } from "../../../../theme/colors";
import AnimatedWrapper from "../../../animation/AnimatedWrapper";
import { Fonts } from "../../../../theme/fonts";

function WidthAndHeight({ orderObject, setOrderObject, errorFieldNumber }: {
    orderObject: INewOrderObject,
    setOrderObject: React.Dispatch<React.SetStateAction<INewOrderObject>>,
    errorFieldNumber: number | null
}) {
    const WIDTH_DIFFERENCE = 3;
    const HEIGHT_DIFFERENCE = 5;

    const [focusedInput, setFocusedInput] = useState<number | null>(null);
    const [warningInput, setWarningInput] = useState<number | null>(null);

    const w_max = orderObject.product?.w_max || 0;
    const h_max = orderObject.product?.h_max || 0;

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

                    <Warning
                        isVissible={warningInput === 1}
                        text={w_max}
                    />
                    <TextInput
                        keyboardType="number-pad"
                        style={[
                            thirdStepStyles.input,
                            { borderColor: focusedInput === 1 ? Colors.blue : 'transparent' },
                            (errorFieldNumber === 2 || warningInput === 1) && thirdStepStyles.borderRed
                        ]}
                        placeholder="0"
                        value={orderObject.width_gab || ""}
                        onChangeText={(value) => {
                            if (+value > +w_max) {
                                setWarningInput(1);
                                setTimeout(() => { setWarningInput(null) }, 3000);
                            } else {
                                setOrderObject({
                                    ...orderObject,
                                    width_gab: value,
                                    width_shtapik: value ? String(Math.max(0, +value - WIDTH_DIFFERENCE)) : ""
                                });
                            }
                        }}
                        onFocus={() => setFocusedInput(1)}
                        onBlur={() => setFocusedInput(null)}
                        maxLength={3}
                    />
                    <Text style={thirdStepStyles.unitLabel}>см</Text>
                </View>

                {/* Ширина (по штапику) */}
                <View style={thirdStepStyles.inputContainer}>
                    <View style={thirdStepStyles.rowLabel}>
                        <Text style={thirdStepStyles.detailsText}>Ширина </Text>
                        <Text style={thirdStepStyles.labelNoteSmall}>(по штапику)</Text>
                    </View>

                    <Warning
                        isVissible={warningInput === 2}
                        text={w_max - WIDTH_DIFFERENCE}
                    />
                    <TextInput
                        keyboardType="number-pad"
                        style={[
                            thirdStepStyles.input,
                            { borderColor: focusedInput === 2 ? Colors.blue : 'transparent' },
                            errorFieldNumber === 2 && thirdStepStyles.borderRed
                        ]}
                        placeholder="0"
                        value={orderObject.width_shtapik || ""}
                        onChangeText={(value) => {
                            if (+value > (w_max - WIDTH_DIFFERENCE)) {
                                setWarningInput(2);
                                setTimeout(() => { setWarningInput(null) }, 3000);
                            } else {
                                setOrderObject({
                                    ...orderObject,
                                    width_shtapik: value,
                                    width_gab: value ? String(+value + WIDTH_DIFFERENCE) : ""
                                })
                            }
                        }}
                        onFocus={() => setFocusedInput(2)}
                        onBlur={() => setFocusedInput(null)}
                        maxLength={3}
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

                    <Warning
                        isVissible={warningInput === 3}
                        text={h_max}
                    />
                    <TextInput
                        keyboardType="number-pad"
                        style={[
                            thirdStepStyles.input,
                            { borderColor: focusedInput === 3 ? Colors.blue : 'transparent' },
                            (errorFieldNumber === 2 || warningInput === 3) && thirdStepStyles.borderRed
                        ]}
                        placeholder="0"
                        value={orderObject.height_gab || ""}
                        onChangeText={(value) => {
                            if (+value > +h_max) {
                                setWarningInput(3);
                                setTimeout(() => { setWarningInput(null) }, 3000);
                            } else {
                                setOrderObject({
                                    ...orderObject,
                                    height_gab: value,
                                    height_shtapik: value ? String(Math.max(0, +value - HEIGHT_DIFFERENCE)) : ""
                                });
                            }
                        }}
                        onFocus={() => setFocusedInput(3)}
                        onBlur={() => setFocusedInput(null)}
                        maxLength={3}
                    />
                    <Text style={thirdStepStyles.unitLabel}>см</Text>
                </View>

                {/* Высота (по штапику) */}
                <View style={thirdStepStyles.inputContainer}>
                    <View style={thirdStepStyles.rowLabel}>
                        <Text style={thirdStepStyles.detailsText}>Висота </Text>
                        <Text style={thirdStepStyles.labelNoteSmall}>(по штапику)</Text>
                    </View>

                    <Warning
                        isVissible={warningInput === 4}
                        text={h_max - HEIGHT_DIFFERENCE}
                    />
                    <TextInput
                        keyboardType="number-pad"
                        style={[
                            thirdStepStyles.input,
                            { borderColor: focusedInput === 4 ? Colors.blue : 'transparent' },
                            errorFieldNumber === 2 && thirdStepStyles.borderRed
                        ]}
                        placeholder="0"
                        value={orderObject.height_shtapik || ""}
                        onChangeText={(value) => {
                            if (+value > (h_max - HEIGHT_DIFFERENCE)) {
                                setWarningInput(4);
                                setTimeout(() => { setWarningInput(null) }, 3000);
                            } else {
                                setOrderObject({
                                    ...orderObject,
                                    height_shtapik: value,
                                    height_gab: value ? String(+value + HEIGHT_DIFFERENCE) : ""
                                });
                            }
                        }}
                        onFocus={() => setFocusedInput(4)}
                        onBlur={() => setFocusedInput(null)}
                        maxLength={3}
                    />
                    <Text style={thirdStepStyles.unitLabel}>см</Text>
                </View>
            </View>
        </>
    )
}

export default WidthAndHeight;


function Warning({ isVissible, text }: { isVissible: boolean, text: number | undefined }) {
    if (text === undefined) return null;

    return (
        <Fragment>
            {isVissible &&
                <AnimatedWrapper
                    useOpacity
                    offsetY={20}
                    style={{
                        position: 'absolute',
                        zIndex: 0,
                        backgroundColor: 'white',
                        borderRadius: 13,
                        paddingVertical: 3,
                        paddingHorizontal: 10,
                        width: 110,
                        borderLeftWidth: 15,
                        borderLeftColor: Colors.red,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.2,
                        shadowRadius: 4,
                        elevation: 5,
                    }}
                >
                    <Text style={{ fontFamily: Fonts.openSans400 }}>
                        max: {text}
                    </Text>
                </AnimatedWrapper>}
        </Fragment>
    )
}
