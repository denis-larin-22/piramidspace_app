import { Text, TextInput, View } from "react-native";
import { useEffect, useState } from "react";
import { Colors } from "../../../../theme/colors";
import {
    ICreateOrderParams,
    INewOrderObject,
    useCreateOrder
} from "../../NewOrderProvider";
import Warning from "../../../ui/Warning";
import { formStyles } from "./form-styles";
import Switcher from "../../../ui/Switcher";

function WidthAndHeight({ errorFieldNumber }: { errorFieldNumber: number | null }) {
    const { orderParams, setOrderParams } = useCreateOrder();

    if (orderParams.newOrderObject.subgroup.code === "day_uni_plosk") {
        return (
            <UniPloskiWH
                orderParams={orderParams}
                setOrderParams={setOrderParams}
                errorFieldNumber={errorFieldNumber}
            />
        )
    } else if (orderParams.newOrderObject.subgroup.code === "day_uni_p" || orderParams.activeGroup === "vertical") {
        return (
            <AnotherGroupsWH
                withShtapik={false}
                orderParams={orderParams}
                setOrderParams={setOrderParams}
                errorFieldNumber={errorFieldNumber}
            />
        );
    } else {
        return (
            <AnotherGroupsWH
                withShtapik
                orderParams={orderParams}
                setOrderParams={setOrderParams}
                errorFieldNumber={errorFieldNumber}
            />
        );
    }
}

/* ====================== UTILS ====================== */

const toCm = (value: string, isMm: boolean) => {
    if (!value) return "";
    const num = Number(value);
    return isMm ? String(num / 10) : String(num);
};

const fromCm = (value?: string, isMm?: boolean) => {
    if (!value) return "";
    const num = Number(value);
    return isMm ? String(num * 10) : String(num);
};

/* ====================== COMPONENT ====================== */


export default WidthAndHeight;

function AnotherGroupsWH({
    orderParams,
    setOrderParams,
    errorFieldNumber,
    withShtapik = false
}: {
    orderParams: ICreateOrderParams;
    setOrderParams: (params: ICreateOrderParams) => void;
    errorFieldNumber: number | null,
    withShtapik: boolean
}) {
    const isHorizontal = orderParams.activeGroup === "horizontal";
    const orderObject = orderParams.newOrderObject;

    const [focusedInput, setFocusedInput] = useState<number | null>(null);
    const [warningInput, setWarningInput] = useState<number | null>(null);
    const [isMm, setIsMm] = useState(false);

    const w_max = orderObject.product?.w_max;
    const h_max = orderObject.product?.h_max;

    const WIDTH_DIFFERENCE = isHorizontal ? 1 : 3; // см
    const HEIGHT_DIFFERENCE = isHorizontal ? 1 : 5; // см

    const showWarning = (id: number) => {
        setWarningInput(id);
        setTimeout(() => setWarningInput(null), 3000);
    };

    const updateDimension = (
        field: keyof INewOrderObject,
        pairField: keyof INewOrderObject,
        valueFromInput: string,
        max?: number,
        diff: number = 0,
        warnId?: number,
        mode: "subtract" | "add" = "subtract"
    ) => {
        const valueCm = toCm(valueFromInput, isMm);

        if (!max) {
            setOrderParams({
                ...orderParams,
                newOrderObject: {
                    ...orderObject,
                    [field]: valueCm,
                    [pairField]: valueCm
                        ? String(
                            mode === "subtract"
                                ? Math.max(0, +valueCm - diff)
                                : +valueCm + diff
                        )
                        : ""
                }
            });
            return;
        }

        const limit = mode === "subtract" ? max : max - diff;

        if (+valueCm > limit) {
            if (warnId) showWarning(warnId);
            return;
        }

        setOrderParams({
            ...orderParams,
            newOrderObject: {
                ...orderObject,
                [field]: valueCm,
                [pairField]: valueCm
                    ? String(
                        mode === "subtract"
                            ? Math.max(0, +valueCm - diff)
                            : +valueCm + diff
                    )
                    : ""
            }
        });
    };

    return (
        <>
            <View style={[formStyles.row, { marginTop: 30 }]}>
                <Switcher
                    option1="см"
                    option2="мм"
                    switchState={isMm}
                    switchHandler={setIsMm}
                    styles={{
                        position: "absolute",
                        top: -33,
                        zIndex: 10
                    }}
                />

                {/* ====== ШИРИНА (ГАБАРИТ) ====== */}
                <View style={formStyles.inputContainer}>
                    <View style={formStyles.rowLabel}>
                        <Text style={formStyles.detailsText}>Ширина </Text>
                        <Text style={formStyles.labelNote}>(габарит)</Text>
                    </View>

                    <Warning
                        isVissible={warningInput === 1}
                        text={
                            isMm
                                ? `${w_max! * 10} мм`
                                : `${w_max} см`
                        }
                    />

                    <TextInput
                        keyboardType="number-pad"
                        style={[
                            formStyles.input,
                            {
                                borderColor:
                                    focusedInput === 1
                                        ? Colors.blue
                                        : Colors.blueLight
                            },
                            (errorFieldNumber === 2 ||
                                warningInput === 1) &&
                            formStyles.borderRed
                        ]}
                        placeholder="0"
                        value={fromCm(orderObject.width_gab, isMm)}
                        onChangeText={(value) =>
                            updateDimension(
                                "width_gab",
                                "width_shtapik",
                                value,
                                w_max,
                                WIDTH_DIFFERENCE,
                                1,
                                "subtract"
                            )
                        }
                        onFocus={() => setFocusedInput(1)}
                        onBlur={() => setFocusedInput(null)}
                        maxLength={6}
                    />
                    <Text style={formStyles.unitLabel}>
                        {isMm ? "мм" : "см"}
                    </Text>
                </View>

                {/* ====== ВИСОТА (ГАБАРИТ) ====== */}
                <View style={formStyles.inputContainer}>
                    <View style={formStyles.rowLabel}>
                        <Text style={formStyles.detailsText}>Висота </Text>
                        <Text style={formStyles.labelNote}>(габарит)</Text>
                    </View>

                    <Warning
                        isVissible={warningInput === 3}
                        text={
                            isMm
                                ? `${h_max! * 10} мм`
                                : `${h_max} см`
                        }
                    />

                    <TextInput
                        keyboardType="number-pad"
                        style={[
                            formStyles.input,
                            {
                                borderColor:
                                    focusedInput === 3
                                        ? Colors.blue
                                        : Colors.blueLight
                            },
                            (errorFieldNumber === 2 ||
                                warningInput === 3) &&
                            formStyles.borderRed
                        ]}
                        placeholder="0"
                        value={fromCm(orderObject.height_gab, isMm)}
                        onChangeText={(value) =>
                            updateDimension(
                                "height_gab",
                                "height_shtapik",
                                value,
                                h_max,
                                HEIGHT_DIFFERENCE,
                                3,
                                "subtract"
                            )
                        }
                        onFocus={() => setFocusedInput(3)}
                        onBlur={() => setFocusedInput(null)}
                        maxLength={6}
                    />
                    <Text style={formStyles.unitLabel}>
                        {isMm ? "мм" : "см"}
                    </Text>
                </View>
            </View>

            {withShtapik && <View style={formStyles.row}>
                {/* ====== ШИРИНА ПО ШТАПИКУ ====== */}
                <View style={formStyles.inputContainer}>
                    <View style={formStyles.rowLabel}>
                        <Text style={formStyles.detailsText}>Ширина </Text>
                        <Text style={formStyles.labelNoteSmall}>
                            (по штапику)
                        </Text>
                    </View>

                    <Warning
                        isVissible={warningInput === 2}
                        text={
                            isMm
                                ? `${(w_max! - WIDTH_DIFFERENCE) * 10} мм`
                                : `${w_max! - WIDTH_DIFFERENCE} см`
                        }
                    />

                    <TextInput
                        keyboardType="number-pad"
                        style={[
                            formStyles.input,
                            {
                                borderColor:
                                    focusedInput === 2
                                        ? Colors.blue
                                        : Colors.blueLight
                            },
                            errorFieldNumber === 2 &&
                            formStyles.borderRed
                        ]}
                        placeholder="0"
                        value={fromCm(orderObject.width_shtapik, isMm)}
                        onChangeText={(value) =>
                            updateDimension(
                                "width_shtapik",
                                "width_gab",
                                value,
                                w_max,
                                WIDTH_DIFFERENCE,
                                2,
                                "add"
                            )
                        }
                        onFocus={() => setFocusedInput(2)}
                        onBlur={() => setFocusedInput(null)}
                        maxLength={6}
                    />
                    <Text style={formStyles.unitLabel}>
                        {isMm ? "мм" : "см"}
                    </Text>
                </View>

                {/* ====== ВИСОТА ПО ШТАПИКУ ====== */}
                <View style={formStyles.inputContainer}>
                    <View style={formStyles.rowLabel}>
                        <Text style={formStyles.detailsText}>Висота </Text>
                        <Text style={formStyles.labelNoteSmall}>
                            (по штапику)
                        </Text>
                    </View>

                    <Warning
                        isVissible={warningInput === 4}
                        text={
                            isMm
                                ? `${(h_max! - HEIGHT_DIFFERENCE) * 10} мм`
                                : `${h_max! - HEIGHT_DIFFERENCE} см`
                        }
                    />

                    <TextInput
                        keyboardType="number-pad"
                        style={[
                            formStyles.input,
                            {
                                borderColor:
                                    focusedInput === 4
                                        ? Colors.blue
                                        : Colors.blueLight
                            },
                            errorFieldNumber === 2 &&
                            formStyles.borderRed
                        ]}
                        placeholder="0"
                        value={fromCm(orderObject.height_shtapik, isMm)}
                        onChangeText={(value) =>
                            updateDimension(
                                "height_shtapik",
                                "height_gab",
                                value,
                                h_max,
                                HEIGHT_DIFFERENCE,
                                4,
                                "add"
                            )
                        }
                        onFocus={() => setFocusedInput(4)}
                        onBlur={() => setFocusedInput(null)}
                        maxLength={6}
                    />
                    <Text style={formStyles.unitLabel}>
                        {isMm ? "мм" : "см"}
                    </Text>
                </View>
            </View>}
        </>
    );
}

function UniPloskiWH({
    orderParams,
    setOrderParams,
    errorFieldNumber
}: {
    orderParams: ICreateOrderParams;
    setOrderParams: (params: ICreateOrderParams) => void;
    errorFieldNumber: number | null;
}) {
    const orderObject = orderParams.newOrderObject;

    const [focusedInput, setFocusedInput] = useState<number | null>(null);
    const [warningInput, setWarningInput] = useState<number | null>(null);
    const [isMm, setIsMm] = useState(false);

    // локальный текст для инпутов
    const [widthText, setWidthText] = useState("");
    const [heightText, setHeightText] = useState("");

    const w_max = orderObject.product?.w_max ?? 0;
    const h_max = orderObject.product?.h_max ?? 0;

    const showWarning = (id: number) => {
        setWarningInput(id);
        setTimeout(() => setWarningInput(null), 3000);
    };

    // обновляем отображаемый текст при переключении см/мм
    useEffect(() => {
        if (orderObject.width_gab) {
            setWidthText(
                isMm
                    ? String(+orderObject.width_gab * 10)
                    : orderObject.width_gab
            );
        }

        if (orderObject.height_gab) {
            setHeightText(
                isMm
                    ? String(+orderObject.height_gab * 10)
                    : orderObject.height_gab
            );
        }
    }, [isMm]);

    const handleChange = (
        text: string,
        type: "width" | "height"
    ) => {
        const numeric = +text;
        if (isNaN(numeric)) return;

        const valueInCm = isMm ? numeric / 10 : numeric;
        const max = type === "width" ? w_max : h_max;
        const warningId = type === "width" ? 1 : 3;

        // БОЛЬШЕ MAX - ФИКСИРУЕМ MAX 
        if (valueInCm > max) {
            showWarning(warningId);

            setOrderParams({
                ...orderParams,
                newOrderObject: {
                    ...orderObject,
                    [type === "width" ? "width_gab" : "height_gab"]:
                        max.toString()
                }
            });

            const fixedText = isMm
                ? String(max * 10)
                : String(max);

            type === "width"
                ? setWidthText(fixedText)
                : setHeightText(fixedText);

            return;
        }

        // В ПРЕДЕЛАХ НОРМЫ 
        setOrderParams({
            ...orderParams,
            newOrderObject: {
                ...orderObject,
                [type === "width" ? "width_gab" : "height_gab"]:
                    valueInCm.toString()
            }
        });

        type === "width"
            ? setWidthText(text)
            : setHeightText(text);
    };

    return (
        <>
            <View style={[formStyles.row, { marginTop: 30, flexDirection: 'column' }]}>
                <Switcher
                    option1="см"
                    option2="мм"
                    switchState={isMm}
                    switchHandler={setIsMm}
                    styles={{
                        position: "absolute",
                        top: -33,
                        zIndex: 10
                    }}
                />

                <View style={[formStyles.inputContainer, { width: '100%' }]}>
                    <View style={formStyles.rowLabel}>
                        <Text style={formStyles.detailsText}>Ширина </Text>
                        <Text style={[formStyles.labelNote, { maxWidth: 240 }]}>(відстань між внутрішніми углами штапіків)</Text>
                    </View>

                    <Warning
                        isVissible={warningInput === 1}
                        text={
                            isMm
                                ? `${w_max * 10} мм`
                                : `${w_max} см`
                        }
                    />

                    <TextInput
                        keyboardType="number-pad"
                        style={[
                            formStyles.input,
                            {
                                borderColor:
                                    focusedInput === 1
                                        ? Colors.blue
                                        : Colors.blueLight
                            },
                            (errorFieldNumber === 2 ||
                                warningInput === 1) &&
                            formStyles.borderRed
                        ]}
                        placeholder="0"
                        value={widthText}
                        onChangeText={(text) =>
                            handleChange(text, "width")
                        }
                        onFocus={() => setFocusedInput(1)}
                        onBlur={() => setFocusedInput(null)}
                        maxLength={6}
                    />
                    <Text style={formStyles.unitLabel}>
                        {isMm ? "мм" : "см"}
                    </Text>
                </View>

                {/* ====== ВИСОТА ====== */}
                <View style={[formStyles.inputContainer, { width: '100%' }]}>
                    <View style={formStyles.rowLabel}>
                        <Text style={formStyles.detailsText}>Висота </Text>
                        <Text style={formStyles.labelNote}>(по замкам штапіків)</Text>
                    </View>

                    <Warning
                        isVissible={warningInput === 3}
                        text={
                            isMm
                                ? `${h_max * 10} мм`
                                : `${h_max} см`
                        }
                    />

                    <TextInput
                        keyboardType="number-pad"
                        style={[
                            formStyles.input,
                            {
                                borderColor:
                                    focusedInput === 3
                                        ? Colors.blue
                                        : Colors.blueLight
                            },
                            (errorFieldNumber === 2 ||
                                warningInput === 3) &&
                            formStyles.borderRed
                        ]}
                        placeholder="0"
                        value={heightText}
                        onChangeText={(text) =>
                            handleChange(text, "height")
                        }
                        onFocus={() => setFocusedInput(3)}
                        onBlur={() => setFocusedInput(null)}
                        maxLength={6}
                    />
                    <Text style={formStyles.unitLabel}>
                        {isMm ? "мм" : "см"}
                    </Text>
                </View>
            </View>
        </>
    );
}