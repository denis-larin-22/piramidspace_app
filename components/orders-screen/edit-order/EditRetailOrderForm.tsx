import {
    Modal,
    Pressable,
    Text,
    View,
    Animated,
    Easing,
    StyleSheet,
    ImageBackground,
    Image,
} from "react-native";
import { useEffect, useRef, useState, useCallback } from "react";
import { ErrorMessage } from "../../ui/ErrorMessage";
import FormField from "../../ui/FormField";
import { formStyles } from "../new-order-steps/third-step-components/form-styles";
import { CloseButton } from "../../ui/CloseButton";
import AnimatedWrapper from "../../animation/AnimatedWrapper";
import Loader from "../../ui/Loader";
import { Colors } from "../../../theme/colors";
import { Fonts } from "../../../theme/fonts";
import { IOrder } from "../../../lib/api/orders-screen/ordersList";

interface IFormState {
    name: string;
    number: string;
    address: string;
    measurements: number | string;
    delivery: number | string;
    installed: number | string;
    subscription: number | string;
    discount: number | string;
    togetherForServices: number | string;
    remainder: number | string;
    summary: number | string;
    discount_uah: number | string;
    goods_total_uah_with_markup: number | string
}

function EditRetailOrderForm({
    isOpen,
    currentOrder,
    saveHandler,
    closeHandler,
}: {
    isOpen: boolean;
    currentOrder: IOrder,
    saveHandler: (updatedRetailData: string) => void
    closeHandler: () => void;
}) {
    const editableColor = '#1EBF9170';

    const modalWidth = 370;
    const translateX = useRef(new Animated.Value(modalWidth)).current;
    // Animation
    useEffect(() => {
        if (isOpen) {
            Animated.timing(translateX, {
                toValue: 0,
                duration: 250,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }).start();
        }
    }, [isOpen]);
    // CLose
    const handleClose = () => {
        Animated.timing(translateX, {
            toValue: modalWidth,
            duration: 200,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
        }).start(() => {
            closeHandler();
        });
    };

    const [isSaveBtnVisible, setIsSaveBtnVisible] = useState(false);

    const actualRetailData = currentOrder.retailDataNormalized;
    const ratailDataIsNull = actualRetailData === null;
    const initFormState: IFormState = {
        name: ratailDataIsNull ? "" : actualRetailData.split('#')[0],
        number: ratailDataIsNull ? "" : actualRetailData.split('#')[1],
        address: ratailDataIsNull ? "" : actualRetailData.split('#')[2],
        measurements: ratailDataIsNull ? 0 : actualRetailData.split('#')[3],
        delivery: ratailDataIsNull ? 0 : actualRetailData.split('#')[4],
        installed: ratailDataIsNull ? 0 : actualRetailData.split('#')[5],
        subscription: ratailDataIsNull ? 0 : actualRetailData.split('#')[7],
        discount: ratailDataIsNull ? 0 : actualRetailData.split('#')[8],
        togetherForServices: ratailDataIsNull ? 0 : actualRetailData.split('#')[6],
        remainder: ratailDataIsNull ? 0 : actualRetailData.split('#')[12],
        summary: ratailDataIsNull ? 0 : actualRetailData.split('#')[11],
        discount_uah: ratailDataIsNull ? 0 : actualRetailData.split('#')[9],
        goods_total_uah_with_markup: ratailDataIsNull ? 0 : actualRetailData.split('#')[10],
    };

    const [formState, setFormState] = useState(initFormState);
    const [activeFieldFocus, setActiveFieldFocus] = useState<number | null>(null);
    const [errorFields, setErrorFields] = useState<number[]>([]);
    const [showErrorMessage, setShowErrorMessage] = useState(false);

    const updateField = useCallback((
        field: keyof typeof formState,
        value: string | number
    ) => {
        setFormState(prev => {
            const updatedState = {
                ...prev,
                [field]: value
            };

            // helper для чисел
            const toNumber = (v: any) =>
                parseFloat(String(v).replace(/\s/g, "")) || 0;

            // 🔥 пересчёт togetherForServices
            const shouldRecalcServices =
                field === "measurements" ||
                field === "delivery" ||
                field === "installed";

            if (shouldRecalcServices) {
                const measurements = toNumber(
                    field === "measurements" ? value : updatedState.measurements
                );

                const delivery = toNumber(
                    field === "delivery" ? value : updatedState.delivery
                );

                const installed = toNumber(
                    field === "installed" ? value : updatedState.installed
                );

                updatedState.togetherForServices =
                    String(measurements + delivery + installed);
            }

            // 🔁 твоя старая логика остатка (оставил как есть по смыслу)
            if (field === "subscription") {
                const summary = toNumber(updatedState.summary);
                const subscription = toNumber(value);

                updatedState.remainder = String(summary - subscription);
            }

            return updatedState;
        });

        setIsSaveBtnVisible(true);

        // ошибки (без изменений)
        if (errorFields.includes(1) && field === 'name') {
            setErrorFields(prev => prev.filter(id => id !== 1));
        }

        if (errorFields.includes(2) && field === 'number') {
            setErrorFields(prev => prev.filter(id => id !== 2));
        }
    }, [errorFields]);

    // save form
    async function saveFormValues() {
        const errors: number[] = [];

        if (!formState.name.trim()) errors.push(1);
        if (!formState.number.trim()) errors.push(2);

        if (errors.length > 0) {
            setErrorFields(errors);
            setShowErrorMessage(true);
            return;
        } else {
            const updatedRetailData = `${formState.name}#${formState.number}#${formState.address}#${formState.measurements}#${formState.delivery}#${formState.installed}#${formState.togetherForServices}#${formState.subscription}#${formState.discount}#${formState.discount_uah}#${formState.goods_total_uah_with_markup}#${formState.summary}#${formState.remainder}`;


            setShowErrorMessage(false); // сброс окна ошибок
            setErrorFields([]); // сброс ошибок
            saveHandler(updatedRetailData);
            handleClose(); // закрытие
        }
    }

    // Автоматическое скрытие ошибки через 4 секунды
    useEffect(() => {
        if (showErrorMessage) {
            const timer = setTimeout(() => {
                setShowErrorMessage(false);
            }, 4000);

            return () => clearTimeout(timer);
        }
    }, [showErrorMessage]);

    return (
        <Modal visible={isOpen} transparent animationType="none">

            <View style={styles.modalOverlay}>
                {/* backdrop */}
                {/* ErrorMessage с авто-скрытием */}
                {showErrorMessage && (
                    <ErrorMessage
                        errorTitle="Майже все"
                        errorText="Заповніть усі потрібні поля"
                    />
                )}

                {/* panel */}
                <Animated.View
                    style={[
                        styles.panel,
                        { transform: [{ translateX }] }
                    ]}
                >
                    {/* header */}
                    <View style={styles.header}>
                        <View style={styles.title}>
                            <Image
                                source={require('../../../assets/orders-screen/edit-btn.png')}
                                style={styles.titleImage}
                            />
                        </View>
                        <Text style={styles.headerTitle}>
                            Деталі замовлення
                        </Text>
                    </View>

                    <View style={styles.formContainer}>
                        <View style={styles.editableInfoRow}>
                            <View style={styles.editableDot} />
                            <Text style={styles.editableText}>
                                – доступні для редагування поля
                            </Text>
                        </View>

                        <View style={styles.clientFieldsContainer}>
                            {/* Client */}
                            <FormField
                                title="Замовник"
                                placeholder="👤 ПІБ"
                                value={formState.name}
                                valueHandler={(value) => updateField('name', value)}
                                maxLength={50}
                                isActive={activeFieldFocus === 1}
                                onFocus={() => setActiveFieldFocus(1)}
                                onBlur={() => setActiveFieldFocus(null)}
                                hasError={errorFields.includes(1)}
                                editableFieldColor={editableColor}
                            />

                            {/* Phone */}
                            <FormField
                                title="Телефон"
                                placeholder="(0__) ___-__-__"
                                fieldType="number-pad"
                                value={formState.number}
                                valueHandler={(value) => updateField('number', value)}
                                maxLength={12}
                                isActive={activeFieldFocus === 2}
                                onFocus={() => setActiveFieldFocus(2)}
                                onBlur={() => setActiveFieldFocus(null)}
                                hasError={errorFields.includes(2)}
                                editableFieldColor={editableColor}
                            />

                            {/* Address */}
                            <FormField
                                title="Адреса"
                                placeholder="Введіть повну адресу"
                                value={formState.address}
                                valueHandler={(value) => updateField('address', value)}
                                isActive={activeFieldFocus === 3}
                                onFocus={() => setActiveFieldFocus(3)}
                                onBlur={() => setActiveFieldFocus(null)}
                                hasError={errorFields.includes(3)}
                                editableFieldColor={editableColor}
                            />
                        </View>

                        <View style={styles.servicesRow}>
                            {/* Замер */}
                            <FormField
                                title="Замір"
                                placeholder="0"
                                fieldType="number-pad"
                                maxLength={8}
                                value={formatNumber(formState.measurements)}
                                valueHandler={(value) => updateField('measurements', value)}
                                isActive={activeFieldFocus === 4}
                                onFocus={() => setActiveFieldFocus(4)}
                                onBlur={() => setActiveFieldFocus(null)}
                                styles={styles.smallField}
                                label="грн"
                                editableFieldColor={editableColor}
                            />
                            {/* Доставка */}
                            <FormField
                                title="Доставка"
                                placeholder="0"
                                fieldType="number-pad"
                                maxLength={8}
                                value={formatNumber(formState.delivery)}
                                valueHandler={(value) => updateField('delivery', value)}
                                isActive={activeFieldFocus === 5}
                                onFocus={() => setActiveFieldFocus(5)}
                                onBlur={() => setActiveFieldFocus(null)}
                                styles={styles.smallField}
                                label="грн"
                                editableFieldColor={editableColor}
                            />
                            {/* Встановлення */}
                            <FormField
                                title="Установка"
                                placeholder="0"
                                fieldType="number-pad"
                                maxLength={8}
                                value={formatNumber(formState.installed)}
                                valueHandler={(value) => updateField('installed', value)}
                                isActive={activeFieldFocus === 6}
                                onFocus={() => setActiveFieldFocus(6)}
                                onBlur={() => setActiveFieldFocus(null)}
                                styles={styles.smallField}
                                label="грн"
                                editableFieldColor={editableColor}
                            />
                        </View>

                        <View style={styles.servicesRow}>
                            {/* Передплата */}
                            <FormField
                                title="Передплата"
                                placeholder="0"
                                fieldType="number-pad"
                                maxLength={8}
                                value={formatNumber(formState.subscription)}
                                valueHandler={(value) => updateField('subscription', value)}
                                isActive={activeFieldFocus === 7}
                                onFocus={() => setActiveFieldFocus(7)}
                                onBlur={() => setActiveFieldFocus(null)}
                                styles={styles.smallField}
                                label="грн"
                                editableFieldColor={editableColor}
                            />
                            {/* Знижка */}
                            <FormField
                                title="Знижка"
                                placeholder="0"
                                fieldType="number-pad"
                                maxLength={8}
                                value={formatNumber(formState.discount)}
                                valueHandler={(value) => updateField('discount', value)}
                                isActive={activeFieldFocus === 8}
                                onFocus={() => setActiveFieldFocus(8)}
                                onBlur={() => setActiveFieldFocus(null)}
                                styles={styles.smallField}
                                label="%"
                                editableFieldColor={editableColor}
                            />
                            {/* Разом за послуги */}
                            <FormField
                                title="За послуги"
                                placeholder="0"
                                fieldType="number-pad"
                                maxLength={8}
                                value={formatNumber(formState.togetherForServices)}
                                valueHandler={(value) => updateField('togetherForServices', value)}
                                editable={false}
                                isActive={activeFieldFocus === 9}
                                onFocus={() => setActiveFieldFocus(9)}
                                onBlur={() => setActiveFieldFocus(null)}
                                styles={styles.smallField}
                                label="грн"
                            />
                        </View>

                        <View style={styles.servicesRow}>
                            {/* Залишок */}
                            <FormField
                                title="Залишок"
                                placeholder="0"
                                fieldType="number-pad"
                                maxLength={8}
                                value={formatNumber(formState.remainder)}
                                valueHandler={(value) => updateField('remainder', value)}
                                editable={false}
                                isActive={activeFieldFocus === 10}
                                onFocus={() => setActiveFieldFocus(10)}
                                onBlur={() => setActiveFieldFocus(null)}
                                styles={styles.smallField}
                                label="грн"
                            />
                            {/* Разом */}
                            <FormField
                                title="Разом"
                                placeholder="0"
                                fieldType="number-pad"
                                maxLength={8}
                                value={formatNumber(formState.summary)}
                                valueHandler={(value) => updateField('summary', value)}
                                editable={false}
                                isActive={activeFieldFocus === 11}
                                onFocus={() => setActiveFieldFocus(11)}
                                onBlur={() => setActiveFieldFocus(null)}
                                styles={styles.smallField}
                                label="грн"
                            />

                        </View>
                        {isSaveBtnVisible && (
                            <Text style={{
                                fontFamily: Fonts.comfortaa700,
                                fontSize: 13,
                                lineHeight: 15,
                                color: Colors.gray,
                                textAlign: 'center'
                            }}>🔘 Перерахунок суми відбудеться після збереження змін</Text>
                        )}
                    </View>

                    {isSaveBtnVisible && (
                        <Pressable
                            style={[formStyles.submitButton, { bottom: -85 }]}
                            onPress={saveFormValues}
                        >
                            <ImageBackground
                                source={require("../../../assets/gradient-small.png")}
                                style={formStyles.submitButtonBg}
                            >
                                <Text style={formStyles.submitButtonText}>Зберегти</Text>
                            </ImageBackground>
                        </Pressable>
                    )}

                    <CloseButton
                        style={styles.closeButton}
                        closeHandler={handleClose}
                    />
                </Animated.View>
            </View>
        </Modal>
    );
}

export default EditRetailOrderForm;

// utils

const formatNumber = (value: string | number) => {
    if (value === "") return "";

    const num = Number(value);

    if (Number.isNaN(num)) return "";

    return Number.isInteger(num)
        ? String(num)
        : String(num).replace(/\.?0+$/, "");
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "#00000050",
        justifyContent: 'center',
    },
    backdrop: {
        flex: 1,
    },
    panel: {
        position: "absolute",
        padding: 12,
        right: 0,
        width: 370,
        backgroundColor: Colors.pale,
        borderTopLeftRadius: 16,
        borderBottomLeftRadius: 16,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 12,
        shadowOffset: { width: -5, height: 0 },
        elevation: 12,
    },
    header: {
        padding: 10,
        marginHorizontal: -13,
        marginTop: -20,
        paddingBottom: 23,
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
        borderBottomWidth: 1,
        borderColor: "#eee",
        backgroundColor: Colors.blue,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        marginBottom: 2
    },
    title: {
        width: 23,
        height: 23,
        backgroundColor: 'white',
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    titleImage: {
        width: 18,
        height: 18,
        borderRadius: 50,
    },
    headerTitle: {
        fontFamily: Fonts.comfortaa700,
        fontSize: 14,
        lineHeight: 16,
        color: 'white',
        textTransform: 'uppercase'
    },
    formContainer: {
        backgroundColor: Colors.pale,
        marginHorizontal: -13,
        marginTop: -18,
        marginBottom: -24,
        borderRadius: 16,
        padding: 12,
        paddingTop: 0
    },
    editableInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        marginLeft: 5,
        marginVertical: 5,
    },
    editableDot: {
        width: 12,
        height: 12,
        borderRadius: 50,
        top: 2,
        backgroundColor: '#1EBF9170'
    },
    editableText: {
        fontFamily: Fonts.openSans400,
        fontSize: 14,
        lineHeight: 16,
        color: Colors.gray
    },
    clientFieldsContainer: {
        backgroundColor: 'white',
        padding: 8,
        borderRadius: 12
    },
    servicesRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 5,
        backgroundColor: 'white',
        padding: 8,
        borderRadius: 12
    },
    fieldContainer: {
        width: '100%',
    },
    smallField: {
        width: 100,
    },
    closeButton: {
        position: 'absolute',
        bottom: -95,
        right: 0,
        zIndex: 10,
    },
    loadingWrap: {
        width: '110%',
        height: '105%',
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: '#00000060',
        zIndex: 20,
        borderTopLeftRadius: 16,
        borderBottomLeftRadius: 16,
        alignItems: 'center',
        justifyContent: 'center'
    },
    loader: {
        width: 70,
        height: 70,
        backgroundColor: Colors.grayLight,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center'
    }
});