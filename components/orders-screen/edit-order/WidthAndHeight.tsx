import { StyleSheet, Text, TextInput, View } from "react-native";
import { Colors } from "../../../theme/colors";
import Warning from "../../ui/Warning";
import { useEffect, useState } from "react";
import { formStyles } from "../new-order-steps/third-step-components/form-styles";
import { UnitsTypes } from "../../../lib/api/auth";

interface IProps {
    unit: UnitsTypes;

    width: number;
    maxWidth: number;
    widthHandler: (value: number) => void;

    height: number;
    maxHeight: number;
    heightHandler: (value: number) => void;
}

function WidthAndHeight({
    unit,
    width: widthGab,
    height: heightGab,
    maxWidth,
    maxHeight,
    widthHandler,
    heightHandler,
}: IProps) {
    const [widthShtapik, setWidthShtapik] = useState<number>(0);
    const [heightShtapik, setHeightShtapik] = useState<number>(0);
    const [warningInput, setWarningInput] = useState<number | null>(null);

    const isCm = unit === "см";
    const WIDTH_DIFF = isCm ? 3 : 30;
    const HEIGHT_DIFF = isCm ? 5 : 50;

    const widthLimit = isCm ? maxWidth : maxWidth * 10;
    const heightLimit = isCm ? maxHeight : maxHeight * 10;

    // Синхронизация значений «по штапику» при изменении габарита
    useEffect(() => {
        setWidthShtapik(Math.max(0, widthGab - WIDTH_DIFF));
    }, [widthGab, WIDTH_DIFF]);

    useEffect(() => {
        setHeightShtapik(Math.max(0, heightGab - HEIGHT_DIFF));
    }, [heightGab, HEIGHT_DIFF]);

    const showWarning = (id: number) => {
        setWarningInput(id);
        setTimeout(() => setWarningInput(null), 3000);
    };

    // Универсальная функция парсинга с защитой от запятой и мусора
    const parseInput = (text: string): number => {
        if (!text) return 0;
        const cleaned = text.trim().replace(/,/g, "."); // запятая → точка
        const num = parseFloat(cleaned);
        return isNaN(num) ? 0 : Math.max(0, num); // отрицательные тоже обнуляем
    };

    // Обработчики габаритов
    const handleGabWidth = (v: string) => {
        const num = parseInput(v);
        if (num > widthLimit) {
            showWarning(1);
            return;
        }
        widthHandler(num);
    };

    const handleGabHeight = (v: string) => {
        const num = parseInput(v);
        if (num > heightLimit) {
            showWarning(3);
            return;
        }
        heightHandler(num);
    };

    // Обработчики «по штапику»
    const handleShtapikWidth = (v: string) => {
        const num = parseInput(v);
        if (num > widthLimit - WIDTH_DIFF) {
            showWarning(2);
            return;
        }
        widthHandler(num + WIDTH_DIFF);
    };

    const handleShtapikHeight = (v: string) => {
        const num = parseInput(v);
        if (num > heightLimit - HEIGHT_DIFF) {
            showWarning(4);
            return;
        }
        heightHandler(num + HEIGHT_DIFF);
    };

    // Преобразуем число → строку только если > 0
    const toStr = (v: number) => (v > 0 ? String(v) : "");

    return (
        <View style={styles.container}>
            {/* ГАБАРИТ */}
            <View style={styles.row}>
                {/* Ширина (габарит) */}
                <View style={formStyles.inputContainer}>
                    <View style={formStyles.rowLabel}>
                        <Text style={formStyles.detailsText}>Ширина </Text>
                        <Text style={formStyles.labelNote}>(габарит)</Text>
                    </View>
                    <Warning isVissible={warningInput === 1} text={`${widthLimit} ${unit}`} />
                    <TextInput
                        keyboardType="number-pad"
                        inputMode="decimal"
                        style={[formStyles.input, { borderColor: Colors.blueLight }]}
                        placeholder="0"
                        value={toStr(widthGab)}
                        onChangeText={handleGabWidth}
                        maxLength={8}
                    />
                    <Text style={formStyles.unitLabel}>{unit}</Text>
                </View>

                {/* Высота (габарит) */}
                <View style={formStyles.inputContainer}>
                    <View style={formStyles.rowLabel}>
                        <Text style={formStyles.detailsText}>Высота </Text>
                        <Text style={formStyles.labelNote}>(габарит)</Text>
                    </View>
                    <Warning isVissible={warningInput === 3} text={`${heightLimit} ${unit}`} />
                    <TextInput
                        keyboardType="number-pad"
                        inputMode="decimal"
                        style={[formStyles.input, { borderColor: Colors.blueLight }]}
                        placeholder="0"
                        value={toStr(heightGab)}
                        onChangeText={handleGabHeight}
                        maxLength={8}
                    />
                    <Text style={formStyles.unitLabel}>{unit}</Text>
                </View>
            </View>

            {/* ПО ШТАПИКУ */}
            <View style={styles.row}>
                {/* Ширина по штапику */}
                <View style={formStyles.inputContainer}>
                    <View style={formStyles.rowLabel}>
                        <Text style={formStyles.detailsText}>Ширина </Text>
                        <Text style={formStyles.labelNoteSmall}>(по штапику)</Text>
                    </View>
                    <Warning
                        isVissible={warningInput === 2}
                        text={`${widthLimit - WIDTH_DIFF} ${unit}`}
                    />
                    <TextInput
                        keyboardType="number-pad"
                        inputMode="decimal"
                        style={[formStyles.input, { borderColor: Colors.blueLight }]}
                        placeholder="0"
                        value={toStr(widthShtapik)}
                        onChangeText={handleShtapikWidth}
                        maxLength={8}
                    />
                    <Text style={formStyles.unitLabel}>{unit}</Text>
                </View>

                {/* Высота по штапику */}
                <View style={formStyles.inputContainer}>
                    <View style={formStyles.rowLabel}>
                        <Text style={formStyles.detailsText}>Высота </Text>
                        <Text style={formStyles.labelNoteSmall}>(по штапику)</Text>
                    </View>
                    <Warning
                        isVissible={warningInput === 4}
                        text={`${heightLimit - HEIGHT_DIFF} ${unit}`}
                    />
                    <TextInput
                        keyboardType="number-pad"
                        inputMode="decimal"
                        style={[formStyles.input, { borderColor: Colors.blueLight }]}
                        placeholder="0"
                        value={toStr(heightShtapik)}
                        onChangeText={handleShtapikHeight}
                        maxLength={8}
                    />
                    <Text style={formStyles.unitLabel}>{unit}</Text>
                </View>
            </View>
        </View>
    );
}

export default WidthAndHeight;

const styles = StyleSheet.create({
    container: {
        marginTop: 12,
        gap: 8,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 12,
    },
});