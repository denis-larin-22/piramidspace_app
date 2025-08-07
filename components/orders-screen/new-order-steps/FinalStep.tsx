import { ImageBackground, Pressable, StyleSheet, Text, View } from "react-native";
import { INewOrderObject } from "../AddNewOrder";
import AnimatedWrapper from "../../animation/AnimatedWrapper";
import { Fonts } from "../../../theme/fonts";

function FinalStep({ orderObject }: { orderObject: INewOrderObject }) {
    return (
        <>
            <View>
                <Text style={styles.title}>🧾 ЗАМОВЛЕННЯ</Text>

                <Text style={styles.section}>🔹 Група: {orderObject.group.name}</Text>
                <Text style={styles.section}>🔹 Підгрупа: {orderObject.subgroup.name}</Text>
                <Text style={styles.section}>🔹 Продукт: {orderObject.product?.name || 'Не обрано'}</Text>
                <Text style={styles.section}>🔹 Код товару: {orderObject.product?.code || 'Не обрано'}</Text>

                <Text style={styles.divider}>──────────</Text>

                <Text style={styles.section}>📐 Розміри:</Text>
                <Text style={styles.detail}>✦ Ширина (по штапику): {orderObject.width}</Text>
                <Text style={styles.detail}>✦ Висота (по штапику): {orderObject.height}</Text>
                <Text style={styles.detail}>✦ Ширина (габарит): {orderObject.width_gab}</Text>
                <Text style={styles.detail}>✦ Висота (габарит): {orderObject.height_gab}</Text>

                <Text style={[styles.section, styles.mt20]}>⚙ Тип управління: {orderObject.typeManagment || 'Не обрано'}</Text>
                <Text style={styles.section}>
                    🔧 Тип фіксації: {orderObject.fixation_type?.name || 'Не обрано'}
                </Text>
                <Text style={styles.section}>🎨 Колір системи: {orderObject.color_system}</Text>
                <Text style={styles.section}>🔢 Кількість: {orderObject.count_number} шт.</Text>

                <Text style={styles.divider}>──────────</Text>

                <Text style={styles.section}>💰 Ціна за одиницю: {orderObject.price} грн</Text>
                <Text style={styles.section}>💰 Загальна сума: {orderObject.final_price} грн</Text>

            </View>

            {/* Кнопка отправки */}
            <AnimatedWrapper
                style={styles.submitButton}
                offsetY={-20}
            >
                <Pressable onPress={() => { }}>
                    <ImageBackground
                        source={require("../../../assets/gradient-small.png")}
                        style={styles.submitButtonBg}
                    >
                        <Text style={styles.submitButtonText}>Створити</Text>
                    </ImageBackground>
                </Pressable>
            </AnimatedWrapper>
        </>
    )
}

export default FinalStep;

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    section: {
        fontSize: 16,
        marginBottom: 4,
    },
    detail: {
        fontSize: 15,
        paddingLeft: 10,
        color: '#555',
    },
    divider: {
        textAlign: 'center',
        color: '#ccc',
        marginVertical: 8,
    },
    thankyou: {
        marginTop: 16,
        fontSize: 16,
        textAlign: 'center',
        fontWeight: '500',
        color: '#333',
    },
    submitButton: {
        height: 59,
        maxWidth: 180,
        width: "100%",
        borderRadius: 31,
        overflow: "hidden",
        position: "absolute",
        bottom: -70,
        alignSelf: "center",
    },
    submitButtonBg: {
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    submitButtonText: {
        fontFamily: Fonts.comfortaa600,
        fontSize: 17,
        lineHeight: 22,
        color: "white",
    },
    mt20: {
        marginTop: 20
    }
});