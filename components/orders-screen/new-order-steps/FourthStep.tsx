import AnimatedWrapper from "../../animation/AnimatedWrapper";
import { Colors } from "../../../theme/colors";
import RetailOrderForm from "./fourth-step/RetailOrderForm";
import { useState } from "react";
import { ICreateOrderParams, useCreateOrder } from "../NewOrderProvider";
import { calculateCreateHandler } from "./FinalStep";
import { Image, StyleSheet, Text, View } from "react-native";
import { Fonts } from "../../../theme/fonts";

function FourthStep({
    buttonsHideHandler,
    closeHandler,
}: {
    buttonsHideHandler: React.Dispatch<React.SetStateAction<boolean>>,
    closeHandler: () => void,
}) {
    const [isCreateButtonVissible, setIsCreateButtonVissible] = useState<boolean>(true);

    const initReport = {
        isVissible: false,
        isError: false,
        message: ""
    };
    const [report, setReport] = useState(initReport);


    async function calcCreate(finalOrderParams: ICreateOrderParams) {
        buttonsHideHandler(true);
        setIsCreateButtonVissible(false);

        const placeOrder = await calculateCreateHandler(finalOrderParams, true);

        if (placeOrder === null) {
            setReport({
                isVissible: true,
                isError: true,
                message: "Помилка при створенні замовлення  Ми вже працюємо над усуненням цієї проблеми"
            });

            setTimeout(() => {
                setReport(initReport);
                buttonsHideHandler(false);
                setIsCreateButtonVissible(true);
            }, 3500);
        } else {
            setReport({
                isVissible: true,
                isError: false,
                message: `Створено попереднє замовлення №${placeOrder.order_number}`
            });

            setTimeout(() => {
                setReport(initReport);
                buttonsHideHandler(false);
                setIsCreateButtonVissible(true);
                closeHandler();
            }, 3500);
        }
    }


    return (
        <>

            <AnimatedWrapper
                offsetY={20}
                useOpacity
                delay={200}
                style={{
                    borderBottomWidth: 2,
                    borderColor: Colors.grayLight,
                    paddingBottom: 5,
                    marginBottom: 5
                }}
            >
                <RetailOrderForm
                    isBtnVissible={isCreateButtonVissible}
                    createBtnHandler={(finalOrderParams: ICreateOrderParams) => { calcCreate(finalOrderParams) }}
                />
            </AnimatedWrapper >

            <Report
                isVissible={report.isVissible}
                isError={report.isError}
                message={report.message}
            />
        </>
    );
}

export default FourthStep;


// Report Component
export function Report({ isVissible, message, isError = false }: { isVissible: boolean, message: string, isError?: boolean }) {
    if (isVissible) {
        return (
            <View style={styles.reportOverlay}>
                <AnimatedWrapper useOpacity useScale>
                    {isError ? (
                        <Image
                            source={require("../../../assets/orders-screen/error.webp")}
                            style={styles.reportIcon}
                        />
                    ) : (
                        <Image
                            source={require("../../../assets/orders-screen/success.webp")}
                            style={styles.reportIcon}
                        />
                    )}

                    <View style={[
                        styles.reportProgressBar,
                        isError ? styles.reportProgressBarError : styles.reportProgressBarSuccess
                    ]}></View>

                    {!isError && (
                        <Text style={styles.reportThanks}>Дякуємо!</Text>
                    )}
                    <Text style={styles.reportMessage}>{message}</Text>
                </AnimatedWrapper>
            </View>
        )
    }
    return null;
}

const styles = StyleSheet.create({
    // Report styles
    reportOverlay: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 100,
        backgroundColor: Colors.pale,
        justifyContent: 'center',
        borderRadius: 16
    },
    reportIcon: {
        width: 70,
        height: 70,
        alignSelf: "center",
        resizeMode: "contain",
        alignItems: "center",
    },
    reportProgressBar: {
        marginVertical: 30,
        width: '70%',
        alignSelf: 'center',
        height: 16,
        borderRadius: 20,
        borderWidth: 7,
    },
    reportProgressBarError: {
        backgroundColor: Colors.red,
        borderColor: "#FF0A0A10",
    },
    reportProgressBarSuccess: {
        backgroundColor: Colors.green,
        borderColor: "#1EBF9150",
    },
    reportMessage: {
        fontFamily: Fonts.comfortaa600,
        fontSize: 16,
        lineHeight: 22,
        textAlign: 'center',
        marginTop: 20,
        color: Colors.gray
    },
    reportThanks: {
        fontFamily: Fonts.comfortaa600,
        fontSize: 18,
        color: 'black',
        textAlign: 'center',
        opacity: 0.9
    },
});