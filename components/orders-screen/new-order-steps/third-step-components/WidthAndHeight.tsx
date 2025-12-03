import { Text, TextInput, View } from "react-native";
import { useState } from "react";
import { Colors } from "../../../../theme/colors";
import { ICreateOrderParams, INewOrderObject, useCreateOrder } from "../../NewOrderProvider";
import Warning from "../../../ui/Warning";
import { UnitsTypes } from "../../../../lib/api/auth";
import { formStyles } from "./form-styles";

function WidthAndHeight({ unit, errorFieldNumber }: { unit: UnitsTypes, errorFieldNumber: number | null }) {
    const { orderParams, setOrderParams } = useCreateOrder();

    return <AnotherGroupsWH
        orderParams={orderParams}
        setOrderParams={setOrderParams}
        errorFieldNumber={errorFieldNumber}
        unit={unit}
    />
}

////////////////////////// WIDTH AND HEIGHT BY GROUPPS ///////////////////////////
function AnotherGroupsWH({ orderParams, setOrderParams, errorFieldNumber, unit }: {
    orderParams: ICreateOrderParams,
    setOrderParams: (params: ICreateOrderParams) => void,
    errorFieldNumber: number | null,
    unit: UnitsTypes
}) {
    const orderObject = orderParams.newOrderObject;

    const [focusedInput, setFocusedInput] = useState<number | null>(null);
    const [warningInput, setWarningInput] = useState<number | null>(null);

    const w_max = unit === "см" ? orderObject.product?.w_max : orderObject.product?.w_max * 10;
    const h_max = unit === "см" ? orderObject.product?.h_max : orderObject.product?.h_max * 10;

    const WIDTH_DIFFERENCE = unit === "см" ? 3 : 30;
    const HEIGHT_DIFFERENCE = unit === "см" ? 5 : 50;

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
            <View style={formStyles.row}>
                {/* ====== ШИРИНА ====== */}
                <View style={formStyles.inputContainer}>
                    <View style={formStyles.rowLabel}>
                        <Text style={formStyles.detailsText}>Ширина </Text>
                        <Text style={formStyles.labelNote}>(габарит)</Text>
                    </View>

                    <Warning isVissible={warningInput === 1} text={w_max + " " + unit} />
                    <TextInput
                        keyboardType="number-pad"
                        style={[
                            formStyles.input,
                            { borderColor: focusedInput === 1 ? Colors.blue : Colors.blueLight },
                            (errorFieldNumber === 2 || warningInput === 1) && formStyles.borderRed
                        ]}
                        placeholder="0"
                        value={orderObject.width_gab || ""}
                        onChangeText={(value) =>
                            updateDimension("width_gab", "width_shtapik", value, w_max, WIDTH_DIFFERENCE, 1, "subtract")
                        }
                        onFocus={() => setFocusedInput(1)}
                        onBlur={() => setFocusedInput(null)}
                        maxLength={6}
                    />
                    <Text style={formStyles.unitLabel}>{unit}</Text>
                </View>

                {/* ====== ВИСОТА ====== */}
                <View style={formStyles.inputContainer}>
                    <View style={formStyles.rowLabel}>
                        <Text style={formStyles.detailsText}>Висота </Text>
                        <Text style={formStyles.labelNote}>(габарит)</Text>
                    </View>

                    <Warning isVissible={warningInput === 3} text={h_max + " " + unit} />
                    <TextInput
                        keyboardType="number-pad"
                        style={[
                            formStyles.input,
                            { borderColor: focusedInput === 3 ? Colors.blue : Colors.blueLight },
                            (errorFieldNumber === 2 || warningInput === 3) && formStyles.borderRed
                        ]}
                        placeholder="0"
                        value={orderObject.height_gab || ""}
                        onChangeText={(value) =>
                            updateDimension("height_gab", "height_shtapik", value, h_max, HEIGHT_DIFFERENCE, 3, "subtract")
                        }
                        onFocus={() => setFocusedInput(3)}
                        onBlur={() => setFocusedInput(null)}
                        maxLength={6}
                    />
                    <Text style={formStyles.unitLabel}>{unit}</Text>
                </View>
            </View>

            <View style={formStyles.row}>
                {/* ====== ШИРИНА ПО ШТАПИКУ ====== */}
                <View style={formStyles.inputContainer}>
                    <View style={formStyles.rowLabel}>
                        <Text style={formStyles.detailsText}>Ширина </Text>
                        <Text style={formStyles.labelNoteSmall}>(по штапику)</Text>
                    </View>

                    <Warning isVissible={warningInput === 2} text={w_max ? w_max - WIDTH_DIFFERENCE + " " + unit : undefined} />
                    <TextInput
                        keyboardType="number-pad"
                        style={[
                            formStyles.input,
                            { borderColor: focusedInput === 2 ? Colors.blue : Colors.blueLight },
                            errorFieldNumber === 2 && formStyles.borderRed
                        ]}
                        placeholder="0"
                        value={orderObject.width_shtapik || ""}
                        onChangeText={(value) =>
                            updateDimension("width_shtapik", "width_gab", value, w_max, WIDTH_DIFFERENCE, 2, "add")
                        }
                        onFocus={() => setFocusedInput(2)}
                        onBlur={() => setFocusedInput(null)}
                        maxLength={6}
                    />
                    <Text style={formStyles.unitLabel}>{unit}</Text>
                </View>

                {/* ====== ВИСОТА ПО ШТАПИКУ ====== */}
                <View style={formStyles.inputContainer}>
                    <View style={formStyles.rowLabel}>
                        <Text style={formStyles.detailsText}>Висота </Text>
                        <Text style={formStyles.labelNoteSmall}>(по штапику)</Text>
                    </View>

                    <Warning isVissible={warningInput === 4} text={h_max ? h_max - HEIGHT_DIFFERENCE + " " + unit : undefined} />
                    <TextInput
                        keyboardType="number-pad"
                        style={[
                            formStyles.input,
                            { borderColor: focusedInput === 4 ? Colors.blue : Colors.blueLight },
                            errorFieldNumber === 2 && formStyles.borderRed
                        ]}
                        placeholder="0"
                        value={orderObject.height_shtapik || ""}
                        onChangeText={(value) =>
                            updateDimension("height_shtapik", "height_gab", value, h_max, HEIGHT_DIFFERENCE, 4, "add")
                        }
                        onFocus={() => setFocusedInput(4)}
                        onBlur={() => setFocusedInput(null)}
                        maxLength={6}
                    />
                    <Text style={formStyles.unitLabel}>{unit}</Text>
                </View>
            </View>
        </>
    )
}

export default WidthAndHeight;


