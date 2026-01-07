import { StyleSheet, Text, TextInput, View } from "react-native";
import { Colors } from "../../../theme/colors";
import Warning from "../../ui/Warning";
import { useEffect, useState } from "react";
import { formStyles } from "../new-order-steps/third-step-components/form-styles";
import Switcher from "../../ui/Switcher";

interface IProps {
    subgroupCode?: string;

    width: number;        // ВСЕГДА В СМ
    maxWidth: number;     // ВСЕГДА В СМ
    widthHandler: (value: number) => void; // принимает СМ

    height: number;       // ВСЕГДА В СМ
    maxHeight: number;    // ВСЕГДА В СМ
    heightHandler: (value: number) => void; // принимает СМ
}

/* ===================== utils ===================== */

const toCm = (value: number, isMm: boolean) =>
    isMm ? value / 10 : value;

const fromCm = (value: number, isMm: boolean) =>
    isMm ? value * 10 : value;

const toStr = (v: number) => (v > 0 ? String(v) : "");

function WidthAndHeight({
    subgroupCode,
    width: widthGabCm,
    height: heightGabCm,
    maxWidth,
    maxHeight,
    widthHandler,
    heightHandler,
}: IProps) {
    if (subgroupCode === "day_uni_plosk") {
        return <UniPloskiWH
            width={widthGabCm}
            height={heightGabCm}
            maxWidth={maxWidth}
            maxHeight={maxHeight}
            widthHandler={widthHandler}
            heightHandler={heightHandler}
        />
    } else if (subgroupCode === "day_uni_p") {
        return <OtherGroupsWH
            width={widthGabCm}
            height={heightGabCm}
            maxWidth={maxWidth}
            maxHeight={maxHeight}
            widthHandler={widthHandler}
            heightHandler={heightHandler}

            withShtapik={false}
        />
    } else if (subgroupCode === "89mm" || subgroupCode === "127mm") {
        return <OtherGroupsWH
            width={widthGabCm}
            height={heightGabCm}
            maxWidth={maxWidth}
            maxHeight={maxHeight}
            widthHandler={widthHandler}
            heightHandler={heightHandler}

            withShtapik={false}
        />
    } else {
        return <OtherGroupsWH
            width={widthGabCm}
            height={heightGabCm}
            maxWidth={maxWidth}
            maxHeight={maxHeight}
            widthHandler={widthHandler}
            heightHandler={heightHandler}

            withShtapik
        />
    }
}

export default WidthAndHeight;

function OtherGroupsWH({
    width: widthGabCm,
    height: heightGabCm,
    maxWidth,
    maxHeight,
    widthHandler,
    heightHandler,
    withShtapik = false
}: IProps & { withShtapik?: boolean }) {
    const [isMm, setIsMm] = useState(false);
    const [warningInput, setWarningInput] = useState<number | null>(null);

    const WIDTH_DIFF = 3;   // см
    const HEIGHT_DIFF = 5;  // см

    /* ===== вычисляем значения по штапику (в СМ) ===== */
    const widthShtapikCm = Math.max(0, widthGabCm - WIDTH_DIFF);
    const heightShtapikCm = Math.max(0, heightGabCm - HEIGHT_DIFF);

    const showWarning = (id: number) => {
        setWarningInput(id);
        setTimeout(() => setWarningInput(null), 3000);
    };

    /* ===== парсинг ввода (в ТЕКУЩИХ единицах) ===== */
    const parseInput = (text: string): number => {
        if (!text) return 0;
        const cleaned = text.trim().replace(/,/g, ".");
        const num = parseFloat(cleaned);
        return isNaN(num) ? 0 : Math.max(0, num);
    };

    /* ================= ГАБАРИТ ================= */

    const handleGabWidth = (v: string) => {
        const input = parseInput(v);
        const valueCm = toCm(input, isMm);

        if (valueCm > maxWidth) {
            showWarning(1);
            return;
        }

        widthHandler(valueCm);
    };

    const handleGabHeight = (v: string) => {
        const input = parseInput(v);
        const valueCm = toCm(input, isMm);

        if (valueCm > maxHeight) {
            showWarning(3);
            return;
        }

        heightHandler(valueCm);
    };

    /* ================= ПО ШТАПИКУ ================= */

    const handleShtapikWidth = (v: string) => {
        const input = parseInput(v);
        const valueCm = toCm(input, isMm);

        if (valueCm > maxWidth - WIDTH_DIFF) {
            showWarning(2);
            return;
        }

        widthHandler(valueCm + WIDTH_DIFF);
    };

    const handleShtapikHeight = (v: string) => {
        const input = parseInput(v);
        const valueCm = toCm(input, isMm);

        if (valueCm > maxHeight - HEIGHT_DIFF) {
            showWarning(4);
            return;
        }

        heightHandler(valueCm + HEIGHT_DIFF);
    };

    return (
        <View style={styles.container}>
            <Switcher
                styles={{
                    position: "absolute",
                    top: -32,
                    left: 0,
                }}
                option1="см"
                option2="мм"
                switchState={isMm}
                switchHandler={setIsMm}
            />

            {/* ===== ГАБАРИТ ===== */}
            <View style={styles.row}>
                {/* Ширина (габарит) */}
                <View style={formStyles.inputContainer}>
                    <View style={formStyles.rowLabel}>
                        <Text style={formStyles.detailsText}>Ширина </Text>
                        <Text style={formStyles.labelNote}>(габарит)</Text>
                    </View>

                    <Warning
                        isVissible={warningInput === 1}
                        text={
                            isMm
                                ? `${maxWidth * 10} мм`
                                : `${maxWidth} см`
                        }
                    />

                    <TextInput
                        keyboardType="number-pad"
                        inputMode="decimal"
                        style={[formStyles.input, { borderColor: Colors.blueLight }]}
                        placeholder="0"
                        value={toStr(fromCm(widthGabCm, isMm))}
                        onChangeText={handleGabWidth}
                        maxLength={8}
                    />

                    <Text style={formStyles.unitLabel}>
                        {isMm ? "мм" : "см"}
                    </Text>
                </View>

                {/* Высота (габарит) */}
                <View style={formStyles.inputContainer}>
                    <View style={formStyles.rowLabel}>
                        <Text style={formStyles.detailsText}>Высота </Text>
                        <Text style={formStyles.labelNote}>(габарит)</Text>
                    </View>

                    <Warning
                        isVissible={warningInput === 3}
                        text={
                            isMm
                                ? `${maxHeight * 10} мм`
                                : `${maxHeight} см`
                        }
                    />

                    <TextInput
                        keyboardType="number-pad"
                        inputMode="decimal"
                        style={[formStyles.input, { borderColor: Colors.blueLight }]}
                        placeholder="0"
                        value={toStr(fromCm(heightGabCm, isMm))}
                        onChangeText={handleGabHeight}
                        maxLength={8}
                    />

                    <Text style={formStyles.unitLabel}>
                        {isMm ? "мм" : "см"}
                    </Text>
                </View>
            </View>

            {/* ===== ПО ШТАПИКУ ===== */}
            {withShtapik && <View style={styles.row}>
                {/* Ширина по штапику */}
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
                                ? `${(maxWidth - WIDTH_DIFF) * 10} мм`
                                : `${maxWidth - WIDTH_DIFF} см`
                        }
                    />

                    <TextInput
                        keyboardType="number-pad"
                        inputMode="decimal"
                        style={[formStyles.input, { borderColor: Colors.blueLight }]}
                        placeholder="0"
                        value={toStr(fromCm(widthShtapikCm, isMm))}
                        onChangeText={handleShtapikWidth}
                        maxLength={8}
                    />

                    <Text style={formStyles.unitLabel}>
                        {isMm ? "мм" : "см"}
                    </Text>
                </View>

                {/* Высота по штапику */}
                <View style={formStyles.inputContainer}>
                    <View style={formStyles.rowLabel}>
                        <Text style={formStyles.detailsText}>Высота </Text>
                        <Text style={formStyles.labelNoteSmall}>
                            (по штапику)
                        </Text>
                    </View>

                    <Warning
                        isVissible={warningInput === 4}
                        text={
                            isMm
                                ? `${(maxHeight - HEIGHT_DIFF) * 10} мм`
                                : `${maxHeight - HEIGHT_DIFF} см`
                        }
                    />

                    <TextInput
                        keyboardType="number-pad"
                        inputMode="decimal"
                        style={[formStyles.input, { borderColor: Colors.blueLight }]}
                        placeholder="0"
                        value={toStr(fromCm(heightShtapikCm, isMm))}
                        onChangeText={handleShtapikHeight}
                        maxLength={8}
                    />

                    <Text style={formStyles.unitLabel}>
                        {isMm ? "мм" : "см"}
                    </Text>
                </View>
            </View>}
        </View>
    );
}

function UniPloskiWH({
    width: widthGabCm,
    height: heightGabCm,
    maxWidth,
    maxHeight,
    widthHandler,
    heightHandler,
}: IProps) {
    const [isMm, setIsMm] = useState(false);
    const [warningInput, setWarningInput] = useState<number | null>(null);

    const showWarning = (id: number) => {
        setWarningInput(id);
        setTimeout(() => setWarningInput(null), 3000);
    };

    /* ===== парсинг ввода (в ТЕКУЩИХ единицах) ===== */
    const parseInput = (text: string): number => {
        if (!text) return 0;
        const cleaned = text.trim().replace(/,/g, ".");
        const num = parseFloat(cleaned);
        return isNaN(num) ? 0 : Math.max(0, num);
    };

    const handleGabWidth = (v: string) => {
        const input = parseInput(v);
        const valueCm = toCm(input, isMm);

        if (valueCm > maxWidth) {
            showWarning(1);
            return;
        }

        widthHandler(valueCm);
    };

    const handleGabHeight = (v: string) => {
        const input = parseInput(v);
        const valueCm = toCm(input, isMm);

        if (valueCm > maxHeight) {
            showWarning(3);
            return;
        }

        heightHandler(valueCm);
    };

    return (
        <View style={styles.container}>
            <Switcher
                styles={{
                    position: "absolute",
                    top: -32,
                    left: 0,
                }}
                option1="см"
                option2="мм"
                switchState={isMm}
                switchHandler={setIsMm}
            />

            {/* ===== ГАБАРИТ ===== */}
            <View style={[styles.row, { marginTop: 30, flexDirection: 'column' }]}>
                {/* Ширина (габарит) */}
                <View style={[formStyles.inputContainer, { width: '100%' }]}>
                    <View style={formStyles.rowLabel}>
                        <Text style={formStyles.detailsText}>Ширина </Text>
                        <Text style={[formStyles.labelNote, { maxWidth: 240 }]}>(відстань між внутрішніми углами штапіків)</Text>
                    </View>

                    <Warning
                        isVissible={warningInput === 1}
                        text={
                            isMm
                                ? `${maxWidth * 10} мм`
                                : `${maxWidth} см`
                        }
                    />

                    <TextInput
                        keyboardType="number-pad"
                        inputMode="decimal"
                        style={[formStyles.input, { borderColor: Colors.blueLight }]}
                        placeholder="0"
                        value={toStr(fromCm(widthGabCm, isMm))}
                        onChangeText={handleGabWidth}
                        maxLength={8}
                    />

                    <Text style={formStyles.unitLabel}>
                        {isMm ? "мм" : "см"}
                    </Text>
                </View>

                {/* Высота (габарит) */}
                <View style={[formStyles.inputContainer, { width: '100%' }]}>
                    <View style={formStyles.rowLabel}>
                        <Text style={formStyles.detailsText}>Высота </Text>
                        <Text style={formStyles.labelNote}>(по замкам штапіків)</Text>
                    </View>

                    <Warning
                        isVissible={warningInput === 3}
                        text={
                            isMm
                                ? `${maxHeight * 10} мм`
                                : `${maxHeight} см`
                        }
                    />

                    <TextInput
                        keyboardType="number-pad"
                        inputMode="decimal"
                        style={[formStyles.input, { borderColor: Colors.blueLight }]}
                        placeholder="0"
                        value={toStr(fromCm(heightGabCm, isMm))}
                        onChangeText={handleGabHeight}
                        maxLength={8}
                    />

                    <Text style={formStyles.unitLabel}>
                        {isMm ? "мм" : "см"}
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        gap: 8,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 12,
    },
});
