import { Text, TextInput, View } from "react-native"
import { thirdStepStyles } from "../ThirdStep"
import { useState } from "react";
import { Colors } from "../../../../theme/colors";
import { ICreateOrderParams, INewOrderObject, useCreateOrder } from "../../NewOrderProvider";
import Warning from "../../../ui/Warning";

export const WIDTH_DIFFERENCE = 3;
export const HEIGHT_DIFFERENCE = 5;

function WidthAndHeight({ errorFieldNumber }: { errorFieldNumber: number | null }) {
    const { orderParams, setOrderParams } = useCreateOrder();

    return <AnotherGroupsWH
        orderParams={orderParams}
        setOrderParams={setOrderParams}
        errorFieldNumber={errorFieldNumber}
    />
    // };
}

////////////////////////// WIDTH AND HEIGHT BY GROUPPS ///////////////////////////
function AnotherGroupsWH({ orderParams, setOrderParams, errorFieldNumber }: {
    orderParams: ICreateOrderParams,
    setOrderParams: (params: ICreateOrderParams) => void,
    errorFieldNumber: number | null
}) {
    const orderObject = orderParams.newOrderObject;

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
            const updates = {
                ...orderObject,
                [field]: value,
                [pairField]: value
                    ? String(mode === "subtract" ? Math.max(0, +value - diff) : +value + diff)
                    : ""
            };

            setOrderParams({
                ...orderParams,
                newOrderObject: updates
            });
            return;
        }

        let limit: number;

        if (mode === "subtract") {
            limit = max;
        } else {
            limit = max - diff;
        }

        if (+value > limit) {
            if (warnId) showWarning(warnId);
            return;
        }

        const updates = {
            ...orderObject,
            [field]: value,
            [pairField]: value
                ? String(mode === "subtract" ? Math.max(0, +value - diff) : +value + diff)
                : ""
        };

        setOrderParams({
            ...orderParams,
            newOrderObject: updates
        });
    };

    return (
        <>
            <View style={thirdStepStyles.row}>
                {/* ====== ШИРИНА ====== */}
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

                {/* ====== ВИСОТА ====== */}
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
            </View>

            <View style={thirdStepStyles.row}>
                {/* ====== ШИРИНА ПО ШТАПИКУ ====== */}
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

                {/* ====== ВИСОТА ПО ШТАПИКУ ====== */}
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


