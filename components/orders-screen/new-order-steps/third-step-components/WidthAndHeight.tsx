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

    const w_max = orderObject.product?.w_max;
    const h_max = orderObject.product?.h_max;

    const showWarning = (id: number) => {
        setWarningInput(id);
        setTimeout(() => setWarningInput(null), 3000);
    };

    const updateDimension = (
        field: keyof INewOrderObject,
        pairField: keyof INewOrderObject,
        value: string,
        max?: number,
        diff: number = 0,
        warnId?: number,
        mode: "subtract" | "add" = "subtract"
    ) => {
        if (!max) {
            setOrderObject({
                ...orderObject,
                [field]: value,
                [pairField]: value
                    ? String(mode === "subtract" ? Math.max(0, +value - diff) : +value + diff)
                    : ""
            });
            return;
        }

        const limit = mode === "subtract" ? max - diff : max;
        if (+value > limit) {
            if (warnId) showWarning(warnId);
            return;
        }

        setOrderObject({
            ...orderObject,
            [field]: value,
            [pairField]: value
                ? String(mode === "subtract" ? Math.max(0, +value - diff) : +value + diff)
                : ""
        });
    };

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

                    <Warning isVissible={warningInput === 1} text={w_max} />
                    <TextInput
                        keyboardType="number-pad"
                        style={[
                            thirdStepStyles.input,
                            { borderColor: focusedInput === 1 ? Colors.blue : Colors.blueLight },
                            (errorFieldNumber === 2 || warningInput === 1) && thirdStepStyles.borderRed
                        ]}
                        placeholder="0"
                        value={orderObject.width_gab || ""}
                        onChangeText={(value) =>
                            updateDimension("width_gab", "width_shtapik", value, w_max, WIDTH_DIFFERENCE, 1, "subtract")
                        }
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

                    <Warning isVissible={warningInput === 2} text={w_max ? w_max - WIDTH_DIFFERENCE : undefined} />
                    <TextInput
                        keyboardType="number-pad"
                        style={[
                            thirdStepStyles.input,
                            { borderColor: focusedInput === 2 ? Colors.blue : Colors.blueLight },
                            errorFieldNumber === 2 && thirdStepStyles.borderRed
                        ]}
                        placeholder="0"
                        value={orderObject.width_shtapik || ""}
                        onChangeText={(value) =>
                            updateDimension("width_shtapik", "width_gab", value, w_max, WIDTH_DIFFERENCE, 2, "add")
                        }
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

                    <Warning isVissible={warningInput === 3} text={h_max} />
                    <TextInput
                        keyboardType="number-pad"
                        style={[
                            thirdStepStyles.input,
                            { borderColor: focusedInput === 3 ? Colors.blue : Colors.blueLight },
                            (errorFieldNumber === 2 || warningInput === 3) && thirdStepStyles.borderRed
                        ]}
                        placeholder="0"
                        value={orderObject.height_gab || ""}
                        onChangeText={(value) =>
                            updateDimension("height_gab", "height_shtapik", value, h_max, HEIGHT_DIFFERENCE, 3, "subtract")
                        }
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

                    <Warning isVissible={warningInput === 4} text={h_max ? h_max - HEIGHT_DIFFERENCE : undefined} />
                    <TextInput
                        keyboardType="number-pad"
                        style={[
                            thirdStepStyles.input,
                            { borderColor: focusedInput === 4 ? Colors.blue : Colors.blueLight },
                            errorFieldNumber === 2 && thirdStepStyles.borderRed
                        ]}
                        placeholder="0"
                        value={orderObject.height_shtapik || ""}
                        onChangeText={(value) =>
                            updateDimension("height_shtapik", "height_gab", value, h_max, HEIGHT_DIFFERENCE, 4, "add")
                        }
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
                    <Text style={{ fontFamily: Fonts.openSans400, color: Colors.gray }}>
                        max: {text}
                    </Text>
                </AnimatedWrapper>}
        </Fragment>
    )
}
