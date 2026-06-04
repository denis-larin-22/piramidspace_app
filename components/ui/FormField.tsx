import { KeyboardTypeOptions, StyleProp, StyleSheet, Text, TextInput, View, ViewStyle } from "react-native";
import { formStyles } from "../orders-screen/new-order-steps/third-step-components/form-styles";
import { Fonts } from "../../theme/fonts";
import { Colors } from "../../theme/colors";
import { useEffect, useState } from "react";

// FormField 
function FormField({
    title,
    placeholder,
    fieldType = "default",
    value,
    valueHandler,
    editable = true,
    isActive,
    onFocus,
    onBlur,
    maxLength = 200,
    styles: customStyles,
    label,
    hasError = false,
    editableFieldColor = "#3372F923",
}: {
    title: string,
    placeholder: string,
    fieldType?: KeyboardTypeOptions,
    value: string,
    valueHandler: (text: string) => void,
    editable?: boolean,
    isActive: boolean,
    onFocus: () => void,
    onBlur: () => void,
    maxLength?: number,
    styles?: StyleProp<ViewStyle>,
    label?: string,
    hasError?: boolean,
    editableFieldColor?: string
}) {
    return (
        <View style={[formStyles.inputContainer, styles.fieldContainer, customStyles]}>
            <Text
                style={styles.fieldTitle}
                numberOfLines={1}
                ellipsizeMode="tail"
            >{title}</Text>
            <View style={styles.inputWrapper}>
                <TextInput
                    keyboardType={fieldType}
                    editable={editable}
                    style={[
                        formStyles.input,
                        {
                            fontSize: 15,
                            lineHeight: 17,
                            paddingLeft: 10,
                            borderColor: hasError
                                ? Colors.redLight
                                : isActive
                                    ? Colors.blue
                                    : editableFieldColor
                        },
                    ]}
                    placeholder={placeholder}
                    value={value}
                    onChangeText={valueHandler}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    maxLength={maxLength}
                />
                {label && <Text style={styles.label}>{label}</Text>}
            </View>
        </View>
    );
}

export default FormField;

export function FormNumberField({
    title,
    placeholder,
    fieldType = "default",
    value,
    valueHandler,
    editable = true,
    isActive,
    onFocus,
    onBlur,
    maxLength = 200,
    styles: customStyles,
    label,
    hasError = false,
    editableFieldColor = "#3372F923",
}: {
    title: string,
    placeholder: string,
    fieldType?: KeyboardTypeOptions,
    value: string,
    valueHandler: (text: string) => void,
    editable?: boolean,
    isActive: boolean,
    onFocus: () => void,
    onBlur: () => void,
    maxLength?: number,
    styles?: StyleProp<ViewStyle>,
    label?: string,
    hasError?: boolean,
    editableFieldColor?: string
}) {
    const [displayValue, setDisplayValue] = useState('');

    // Форматування цифр під маску (0__) ***-**-**
    const formatPhone = (digits: string): string => {
        if (!digits) return '';

        let result = '(';

        // Перші 3 цифри
        result += digits.slice(0, 3);
        if (digits.length > 3) result += ') ';

        // Наступні 3 цифри
        if (digits.length > 3) {
            result += digits.slice(3, 6);
        }

        // Далі -**
        if (digits.length > 6) {
            result += '-' + digits.slice(6, 8);
        }

        // Останні **
        if (digits.length > 8) {
            result += '-' + digits.slice(8, 10);
        }

        return result;
    };

    // Синхронізація зовнішнього value
    useEffect(() => {
        setDisplayValue(formatPhone(value));
    }, [value]);

    const handleChangeText = (text: string) => {
        // Витягуємо тільки цифри з того, що ввів користувач
        const digitsOnly = text.replace(/\D/g, '').slice(0, 10); // max 10 цифр

        const formatted = formatPhone(digitsOnly);

        setDisplayValue(formatted);
        valueHandler(digitsOnly); // передаємо тільки цифри нагору
    };

    return (
        <View style={[formStyles.inputContainer, styles.fieldContainer, customStyles]}>
            <Text style={styles.fieldTitle}>{title}</Text>
            <View style={styles.inputWrapper}>
                <TextInput
                    keyboardType="phone-pad"
                    editable={editable}
                    style={[
                        formStyles.input,
                        {
                            fontSize: 15,
                            lineHeight: 17,
                            paddingLeft: 10,
                            borderColor: hasError
                                ? Colors.redLight
                                : isActive
                                    ? Colors.blue
                                    : editableFieldColor
                        },
                    ]}
                    placeholder={placeholder}
                    value={displayValue}
                    onChangeText={handleChangeText}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    maxLength={20}
                />
                {label && <Text style={styles.label}>{label}</Text>}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    fieldContainer: {
        width: '100%',
    },
    fieldTitle: {
        marginTop: 5,
        fontFamily: Fonts.comfortaa600,
        fontSize: 14,
        lineHeight: 16,
        color: Colors.gray,
    },
    inputWrapper: {
        position: 'relative',
    },
    label: {
        fontFamily: Fonts.comfortaa600,
        fontSize: 12,
        lineHeight: 14,
        color: Colors.gray,
        position: 'absolute',
        zIndex: 10,
        top: 17,
        right: 4,
    },
});