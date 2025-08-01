import { useEffect, useState } from "react";
import AnimatedWrapper from "../animation/AnimatedWrapper";
import { Image, ImageBackground, ImageStyle, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Colors } from "../../theme/colors";
import { Fonts } from "../../theme/fonts";
import { useDollarRate } from "../../lib/hooks/useDollarRate";
import { useNetworkStatus } from "../../lib/hooks/useNetworkStatus";
import { useBalanceValue } from "../../lib/hooks/useBalanceValue";
import { getGroupsStructure, getProductsByCodes, IProductByCodes, ISubgroup, MainGroupsCode } from "../../lib/api/orders";
import Loader from "../ui/Loader";
import ThirdStep from "./new-order-steps/ThirdStep";
import FirstStep from "./new-order-steps/FirstStep";
import SecondStep from "./new-order-steps/SecondStep";

export interface INewOrderObject {
    group: {
        name: string | null,
        code: MainGroupsCode | null
    },
    subgroup: {
        name: string | null,
        code: string | null
    },
}

function AddNewOrder() {
    const { isConnected } = useNetworkStatus();
    const { rate } = useDollarRate(isConnected);
    const { balance } = useBalanceValue(isConnected);

    const [isModalVissible, setIsModalVissible] = useState<boolean>(false);
    //
    const initNewOrderObject: INewOrderObject = {
        group: { code: null, name: null },
        subgroup: { code: null, name: null }
    };

    const [activeStep, setActiveStep] = useState<number>(1);
    const [newOrderObject, setNewOrderObject] = useState<INewOrderObject>(initNewOrderObject);


    const firstStepHandler = (selectedGroup: { name: string, code: MainGroupsCode }) => {
        const updatedOrder: INewOrderObject = {
            ...newOrderObject,
            group: {
                code: selectedGroup.code,
                name: selectedGroup.name
            }
        };

        setNewOrderObject(updatedOrder);
        setActiveStep(2);
    };

    const secondStepHandler = (selectedSubgroup: { name: string, code: string }) => {
        const updatedOrder: INewOrderObject = {
            ...newOrderObject,
            subgroup: {
                code: selectedSubgroup.code,
                name: selectedSubgroup.name
            }
        };

        setNewOrderObject(updatedOrder);
        setActiveStep(3);
    }

    const backButtonHandler = () => {
        setActiveStep(activeStep - 1);
    }

    const closeButtonHandler = () => {
        setNewOrderObject(initNewOrderObject);
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

            <Modal visible={isModalVissible} transparent>
                <AnimatedWrapper
                    style={styles.modalOverlay}
                    useOpacity
                    duration={200}
                >
                    <AnimatedWrapper
                        useOpacity
                        useScale
                        delay={100}
                        duration={200}
                        style={styles.modalContent}
                    >
                        {activeStep === 1 ?
                            <FirstStep stepHandler={firstStepHandler} />
                            :
                            activeStep === 2 ?
                                <SecondStep
                                    orderObject={newOrderObject}
                                    balanceValue={balance}
                                    rateValue={rate}
                                    stepHandler={secondStepHandler}
                                />
                                :
                                <ThirdStep orderObject={newOrderObject} />
                        }
                        {(activeStep !== 1) && <BackButton backHandler={backButtonHandler} />}
                        <CloseButton closeHandler={closeButtonHandler} />
                    </AnimatedWrapper>
                </AnimatedWrapper>
            </Modal>
        </>
    );
}

export default AddNewOrder;

// UI
export function CloseButton({ closeHandler }: { closeHandler: () => void }) {
    return (
        <AnimatedWrapper delay={200} useOpacity offsetY={-30}>
            <Pressable style={[styles.button, styles.closeButton]} onPress={closeHandler}>
                <ImageBackground
                    source={require('../../assets/gradient-small.png')}
                    style={styles.buttonBg}
                >
                    <Text style={[styles.closeButtonText, styles.rotate]}>+</Text>
                </ImageBackground>
            </Pressable>
        </AnimatedWrapper>
    );
}

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
        marginBottom: 10,
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
        top: '-5%'
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
        left: 0
    },
    buttonBg: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeButtonText: {
        fontFamily: Fonts.comfortaa400,
        fontSize: 40,
        lineHeight: 50,
        color: 'white'
    },
    backButtonText: {
        fontFamily: Fonts.comfortaa400,
        fontSize: 30,
        lineHeight: 38,
        color: 'white'
    },
    rotate: {
        transform: [{ rotate: '45deg' }],
    },
});

