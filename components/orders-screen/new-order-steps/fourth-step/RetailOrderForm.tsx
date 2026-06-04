import {
    Pressable,
    Text,
    View,
    StyleSheet,
    ImageBackground,
    Image,
    Keyboard,
} from "react-native";
import { useEffect, useState, useCallback, useRef } from "react";
import { Colors } from "../../../../theme/colors";
import { Fonts } from "../../../../theme/fonts";
import { formStyles } from "../third-step-components/form-styles";
import { ICreateOrderParams, useCreateOrder } from "../../NewOrderProvider";
import { calculateCreateHandler } from "../FinalStep";
import AnimatedWrapper from "../../../animation/AnimatedWrapper";
import Loader from "../../../ui/Loader";
import FormField, { FormNumberField } from "../../../ui/FormField";
import { isValidPhoneNumber } from "../../../../lib/utils";

function RetailOrderForm({
    isBtnVissible,
    createBtnHandler,
}: {
    isBtnVissible: boolean,
    createBtnHandler: (finalOrderParams: ICreateOrderParams) => void
}) {
    const editableColor = '#1EBF9170';
    const [isLoading, setIsLoading] = useState(false);

    const initFormState: {
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
    } = {
        name: "",
        number: "",
        address: "",
        measurements: 0,
        delivery: 0,
        installed: 0,
        subscription: 0,
        discount: 0,
        togetherForServices: 0,
        remainder: 0,
        summary: 0,
        discount_uah: 0,
        goods_total_uah_with_markup: 0
    };

    const [formState, setFormState] = useState(initFormState);
    const [activeFieldFocus, setActiveFieldFocus] = useState<number | null>(null);
    const [errorFields, setErrorFields] = useState<number[]>([]);
    const [showErrorMessage, setShowErrorMessage] = useState(false);

    const { orderParams, setOrderParams } = useCreateOrder();

    // refs for latest state (to avoid stale closure)
    const formStateRef = useRef(formState);
    const orderParamsRef = useRef(orderParams);

    useEffect(() => {
        formStateRef.current = formState;
    }, [formState]);

    useEffect(() => {
        orderParamsRef.current = orderParams;
    }, [orderParams]);

    useEffect(() => {
        async function retailCalcResponse() {
            setIsLoading(true);

            try {
                const updatedParams = {
                    ...orderParams,
                    newOrderObject: {
                        ...orderParams.newOrderObject,
                        retailData: (orderParams.newOrderObject.retailData === null ||
                            orderParams.newOrderObject.retailData.length === 0)
                            ? " # # "
                            : `${orderParams.newOrderObject.retailData.split('#')[0]}#
                            ${orderParams.newOrderObject.retailData.split('#')[1]}#
                            ${orderParams.newOrderObject.retailData.split('#')[2]}#####
                            ${orderParams.newOrderObject.retailData.split('#')[7]}#`
                    }
                };

                setOrderParams(updatedParams);

                const result = await calculateCreateHandler(updatedParams, false);
                if (!result) return;

                const arr = result.retailDataNormalized.split("#");

                setFormState({
                    name: arr[0],
                    number: arr[1],
                    address: arr[2],
                    measurements: arr[3],
                    delivery: arr[4],
                    installed: arr[5],
                    subscription: arr[7],
                    discount: arr[8],
                    togetherForServices: arr[6],
                    remainder: arr[12],
                    summary: arr[11],
                    discount_uah: arr[9],
                    goods_total_uah_with_markup: arr[10]
                });

                setOrderParams({
                    ...orderParams,
                    newOrderObject: {
                        ...orderParams.newOrderObject,
                        retailData: result.retailDataNormalized
                    }
                });

            } finally {
                setIsLoading(false);
            }
        }

        retailCalcResponse();
    }, []);

    const updateField = useCallback((field: keyof typeof formState, value: string | number) => {
        setFormState(prev => ({
            ...prev,
            [field]: value
        }));

        if (errorFields.includes(1) && field === 'name') {
            setErrorFields(prev => prev.filter(id => id !== 1));
        }
        if (errorFields.includes(2) && field === 'number') {
            setErrorFields(prev => prev.filter(id => id !== 2));
        }
    }, [errorFields]);

    const runRecalculation = useCallback(async () => {
        const state = formStateRef.current;
        const params = orderParamsRef.current;

        const updatedRetailData =
            `${state.name}#` +
            `${state.number}#` +
            `${state.address}#` +
            `${state.measurements || 0}#` +
            `${state.delivery || 0}#` +
            `${state.installed || 0}#` +
            `${state.togetherForServices || 0}#` +
            `${state.subscription || 0}#` +
            `${state.discount || 0}#` +
            `${state.discount_uah || 0}#` +
            `${state.goods_total_uah_with_markup || 0}#` +
            `${state.summary || 0}#` +
            `${state.remainder || 0}`;

        const updatedOrderParams = {
            ...params,
            newOrderObject: {
                ...params.newOrderObject,
                retailData: updatedRetailData,
            },
        };

        setOrderParams(updatedOrderParams);
        setIsLoading(true);

        try {
            const result = await calculateCreateHandler(updatedOrderParams, false);
            if (!result) return;

            const arr = result.retailDataNormalized.split("#");

            setFormState({
                name: arr[0],
                number: arr[1],
                address: arr[2],
                measurements: arr[3],
                delivery: arr[4],
                installed: arr[5],
                togetherForServices: arr[6],
                subscription: arr[7],
                discount: arr[8],
                discount_uah: arr[9],
                goods_total_uah_with_markup: arr[10],
                summary: arr[11],
                remainder: arr[12],
            });

        } finally {
            setIsLoading(false);
        }
    }, []);

    // 🔥 KEY CHANGE: recalculation only on keyboard hide
    useEffect(() => {
        const sub = Keyboard.addListener("keyboardDidHide", () => {
            runRecalculation();
        });

        return () => sub.remove();
    }, [runRecalculation]);

    async function saveFormValues() {
        const isNumberValid = isValidPhoneNumber(formState.number);
        const errors: number[] = [];

        if (!formState.name.trim()) errors.push(1);
        if (!formState.number.trim() || !isNumberValid) errors.push(2);

        if (errors.length > 0) {
            setErrorFields(errors);
            setShowErrorMessage(true);
            return;
        } else {
            const updatedRetailData =
                `${formState.name}#${formState.number}#${formState.address}#${formState.measurements}#${formState.delivery}#${formState.installed}#${formState.togetherForServices}#${formState.subscription}#${formState.discount}#${formState.discount_uah}#${formState.goods_total_uah_with_markup}#${formState.summary}#${formState.remainder}`;

            const updatedOrderParams = {
                ...orderParams,
                newOrderObject: {
                    ...orderParams.newOrderObject,
                    retailData: updatedRetailData
                }
            };

            setOrderParams(updatedOrderParams);
            setErrorFields([]);
            setShowErrorMessage(false);
            createBtnHandler(updatedOrderParams);
        }
    }

    useEffect(() => {
        if (showErrorMessage) {
            const timer = setTimeout(() => {
                setShowErrorMessage(false);
            }, 4000);

            return () => clearTimeout(timer);
        }
    }, [showErrorMessage]);

    return (
        <>
            {isLoading && <Loading />}

            <View style={styles.header}>
                <View style={styles.title}>
                    <Image
                        source={require('../../../../assets/orders-screen/edit-btn.png')}
                        style={styles.titleImage}
                    />
                </View>
                <Text style={styles.headerTitle}>
                    Деталі замовлення роздрібу
                </Text>
            </View>

            <View style={styles.mainContainer}>
                <View style={styles.editableInfoRow}>
                    <View style={styles.editableDot} />
                    <Text style={styles.editableText}>
                        – доступні для редагування поля
                    </Text>
                </View>

                <View style={{ opacity: isLoading ? 0.6 : 1 }}>
                    <View style={styles.clientFieldsContainer}>
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

                        <FormNumberField
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

                    <View style={styles.bottomSection}>
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
                        <FormField
                            title="Знижка"
                            placeholder="0"
                            fieldType="number-pad"
                            maxLength={6}
                            value={formatNumber(formState.discount)}
                            valueHandler={(value) => updateField('discount', value)}
                            isActive={activeFieldFocus === 8}
                            onFocus={() => setActiveFieldFocus(8)}
                            onBlur={() => setActiveFieldFocus(null)}
                            styles={styles.smallField}
                            label="%"
                            editableFieldColor={editableColor}
                        />
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

                    <View style={styles.remainderRow}>
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
                </View>
            </View>

            {isBtnVissible &&
                <Pressable
                    style={[formStyles.submitButton, styles.saveButton]}
                    onPress={saveFormValues}
                >
                    <ImageBackground
                        source={require("../../../../assets/gradient-small.png")}
                        style={formStyles.submitButtonBg}
                    >
                        <Text style={formStyles.submitButtonText}>Створити</Text>
                    </ImageBackground>
                </Pressable>
            }
        </>
    );
}

function Loading() {
    return (
        <AnimatedWrapper useScale duration={100} delay={200} style={styles.loadingWrap}>
            <View style={styles.loader}>
                <Loader radius={80} />
            </View>
        </AnimatedWrapper>
    );
}

const formatNumber = (value: string | number) => {
    if (value === "") return "";
    const num = Number(value);
    if (Number.isNaN(num)) return "";
    return Number.isInteger(num)
        ? String(num)
        : String(num).replace(/\.?0+$/, "");
};

const styles = StyleSheet.create({
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
        width: 30,
        height: 30,
        backgroundColor: 'white',
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    titleImage: {
        width: 20,
        height: 20,
        borderRadius: 50,
    },
    headerTitle: {
        fontFamily: Fonts.comfortaa700,
        fontSize: 14,
        lineHeight: 16,
        color: 'white',
        textTransform: 'uppercase'
    },
    mainContainer: {
        backgroundColor: Colors.pale,
        marginHorizontal: -13,
        marginTop: -18,
        marginBottom: -24,
        borderRadius: 16,
        padding: 12
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
    bottomSection: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginTop: 5,
        paddingTop: 5,
        borderTopWidth: 2,
        borderColor: Colors.grayLight,
        backgroundColor: 'white',
        padding: 8,
        borderRadius: 12
    },
    remainderRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        padding: 8,
        borderRadius: 12,
        marginTop: 5
    },
    smallField: {
        width: 100,
    },
    saveButton: {
        bottom: -90
    },
    loadingWrap: {
        width: '110%',
        height: '100%',
        position: 'absolute',
        top: -12,
        left: -12,
        backgroundColor: 'transparent',
        zIndex: 20,
        borderTopLeftRadius: 16,
        borderBottomLeftRadius: 16,
        alignItems: 'center',
        justifyContent: 'center'
    },
    loader: {
        width: 100,
        height: 100,
        backgroundColor: Colors.blueLight,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default RetailOrderForm;