import { useEffect, useState } from "react";
import AnimatedWrapper from "../animation/AnimatedWrapper";
import { ImageBackground, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../../theme/colors";
import { Fonts } from "../../theme/fonts";
import { useDollarRate } from "../../lib/hooks/useDollarRate";
import { useNetworkStatus } from "../../lib/hooks/useNetworkStatus";
import { useBalanceValue } from "../../lib/hooks/useBalanceValue";
import ThirdStep from "./new-order-steps/ThirdStep";
import FirstStep, { generateId } from "./new-order-steps/FirstStep";
import SecondStep from "./new-order-steps/SecondStep";
import FinalStep from "./new-order-steps/FinalStep";
import { INewOrderObject, initCreateOrderParams, useCreateOrder } from "./NewOrderProvider";
import { CloseButton } from "../ui/CloseButton";

function AddNewOrder({ triggerRefetch }: { triggerRefetch: () => void }) {
    const { isConnected } = useNetworkStatus();
    const { rate } = useDollarRate(isConnected);
    const { balance } = useBalanceValue(isConnected);
    // context
    const { orderParams, setOrderParams } = useCreateOrder();
    // 
    const [isModalVissible, setIsModalVissible] = useState<boolean>(false);
    const [activeStep, setActiveStep] = useState<number>(1);
    // 
    const [isControlButtonsHidden, setIsControlButtonsHidden] = useState(false);

    // buttons handlers
    const backButtonHandler = () => {
        const { group } = orderParams.newOrderObject;

        if (activeStep === 3) {
            setOrderParams({
                ...orderParams,
                newOrderObject: {
                    ...initCreateOrderParams.newOrderObject,
                    group,
                }
            });
        }

        setActiveStep(prev => prev - 1);
    };

    function closeButtonHandler() {
        setOrderParams(initCreateOrderParams);
        setActiveStep(1);
        setIsModalVissible(false);
    }

    return (
        <>
            <AnimatedWrapper useOpacity offsetX={50} duration={300} delay={400}>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setIsModalVissible(true)}
                >
                    <ImageBackground source={require('../../assets/gradient-small.png')}>
                        <Text style={styles.addButtonText}>+</Text>
                    </ImageBackground>
                </TouchableOpacity>
            </AnimatedWrapper>

            <Modal
                visible={isModalVissible}
                transparent={true}
                animationType="fade"
                statusBarTranslucent={true}
            >
                <AnimatedWrapper
                    style={styles.modalOverlay}
                    useOpacity
                    duration={200}
                >
                    <AnimatedWrapper
                        useOpacity
                        useScale
                        offsetY={100}
                        delay={100}
                        duration={200}
                        style={styles.modalContent}
                    >
                        {/* Steps */}
                        {activeStep === 1 ?
                            // #1
                            <FirstStep stepHandler={() => setActiveStep(2)} />
                            :
                            activeStep === 2 ?
                                // #2
                                <SecondStep
                                    balanceValue={balance}
                                    rateValue={rate}
                                    stepHandler={() => setActiveStep(3)}
                                />
                                :
                                activeStep === 3 ?
                                    // #3
                                    <ThirdStep
                                        stepHandler={() => setActiveStep(4)}
                                    />
                                    :
                                    // #4
                                    <FinalStep
                                        balanceValue={balance}
                                        rateValue={rate}
                                        closeHandler={() => {
                                            setOrderParams(initCreateOrderParams);
                                            setIsModalVissible(false);
                                            setActiveStep(1);
                                            triggerRefetch();
                                        }}
                                        stepHandler={() => {
                                            const oneMoreItem: INewOrderObject = {
                                                ...initCreateOrderParams.newOrderObject,
                                                group: orderParams.newOrderObject.group,
                                                subgroup: orderParams.newOrderObject.subgroup,
                                                id: generateId()
                                            }

                                            setOrderParams({
                                                ...orderParams,
                                                newOrderObject: oneMoreItem
                                            });
                                            setActiveStep(3);
                                        }}
                                        buttonsHideHandler={setIsControlButtonsHidden}
                                    />
                        }

                        {/* Back and close */}
                        {!isControlButtonsHidden && <View style={{ zIndex: -1 }}>
                            {!(activeStep === 1 || (activeStep === 3 && orderParams.ordersList.length !== 0)) && (
                                <BackButton backHandler={backButtonHandler} />
                            )}
                            <CloseButton
                                style={styles.closeButton}
                                closeHandler={closeButtonHandler}
                            />
                        </View>}
                    </AnimatedWrapper>
                </AnimatedWrapper>
            </Modal>
        </>
    );
}

export default AddNewOrder;

// UI
function BackButton({ backHandler }: { backHandler: () => void }) {
    return (
        <AnimatedWrapper delay={200} useOpacity offsetY={-30}>
            <Pressable style={[styles.button, styles.backButton]} onPress={backHandler}>
                <ImageBackground
                    source={require('../../assets/gradient-small.png')}
                    style={styles.buttonBg}
                >
                    <Text style={styles.backButtonText}>{'<'}</Text>
                </ImageBackground>
            </Pressable>
        </AnimatedWrapper>
    );
}

const styles = StyleSheet.create({
    addButton: {
        width: 60,
        height: 60,
        alignSelf: 'flex-end',
        borderRadius: 50,
        overflow: "hidden",
        // marginBottom: 10,
        backgroundColor: Colors.blue
    },
    addButtonText: {
        color: "white",
        fontSize: 36,
        lineHeight: 45,
        fontFamily: Fonts.comfortaa600,
        width: '100%',
        textAlign: "center",
        paddingVertical: 9
    },
    modalOverlay: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        position: "relative",
        height: "100%",
        width: "100%",
        backgroundColor: "#00000080",
    },
    modalContent: {
        backgroundColor: Colors.pale,
        paddingVertical: 20,
        paddingHorizontal: 12,
        borderRadius: 13,
        width: '100%',
        position: 'relative',
        top: '-5%',
    },
    button: {
        width: 59,
        height: 59,
        borderRadius: 50,
        overflow: 'hidden',
    },
    closeButton: {
        position: 'absolute',
        bottom: -90,
        right: 0
    },
    backButton: {
        position: 'absolute',
        bottom: -90,
        left: 0,
    },
    buttonBg: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },

    backButtonText: {
        fontFamily: Fonts.comfortaa400,
        fontSize: 30,
        lineHeight: 38,
        color: 'white'
    },

});

