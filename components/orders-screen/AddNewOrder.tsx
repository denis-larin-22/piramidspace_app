import { useEffect, useState } from "react";
import AnimatedWrapper from "../animation/AnimatedWrapper";
import { Image, ImageBackground, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../../theme/colors";
import { Fonts } from "../../theme/fonts";
import { useDollarRate } from "../../lib/hooks/useDollarRate";
import { useNetworkStatus } from "../../lib/hooks/useNetworkStatus";
import { useBalanceValue } from "../../lib/hooks/useBalanceValue";

interface INewOrderObject {
    category: {
        name: string | null,
        id: number | null
    },
    subcategory: {
        name: string | null,
        id: number | null
    },
}

function AddNewOrder() {
    const { isConnected } = useNetworkStatus();
    const { rate } = useDollarRate(isConnected);
    const { balance } = useBalanceValue(isConnected);

    const [isModalVissible, setIsModalVissible] = useState<boolean>(false);
    //
    const initNewOrderObject: INewOrderObject = {
        category: { id: null, name: null },
        subcategory: { id: null, name: null }
    };

    const [activeStep, setActiveStep] = useState<number>(1);
    const [newOrderObject, setNewOrderObject] = useState<INewOrderObject>(initNewOrderObject);

    const firstStepHandler = (selectedCategory: { name: string, id: number }) => {
        setNewOrderObject({
            ...newOrderObject,
            category: {
                id: selectedCategory.id,
                name: selectedCategory.name
            }
        });
        setActiveStep(2);
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
                        <FirstStep
                            activeStep={activeStep}
                            stepHandler={firstStepHandler}
                        />
                        <SecondStep
                            activeStep={activeStep}
                            selectedCategory={newOrderObject.category.name as string}
                            balanceValue={balance}
                            rateValue={rate}
                        />

                        {(activeStep !== 1) && <BackButton backHandler={backButtonHandler} />}
                        <CloseButton closeHandler={closeButtonHandler} />
                    </AnimatedWrapper>
                </AnimatedWrapper>
            </Modal>
        </>
    );
}

export default AddNewOrder;

function FirstStep({ activeStep, stepHandler }: {
    activeStep: number,
    stepHandler: (selectedCategory: {
        name: string;
        id: number;
    }) => void
}) {
    const STEP_ID = 1;
    if (activeStep !== STEP_ID) return null;

    const categories = [
        { id: 3, name: 'Горизонтальні', icon: require('../../assets/orders-screen/horisontal.png') },
        { id: 4, name: 'Вертикальні', icon: require('../../assets/orders-screen/vertical.png') },
        { id: 1, name: 'День-Ніч', icon: require('../../assets/orders-screen/day-night.png') },
        { id: 2, name: 'Рулонні', icon: require('../../assets/orders-screen/roller.png') },
        { id: 5, name: 'Комплектуючі', icon: require('../../assets/orders-screen/components.png') },
        { id: 6, name: 'Рекламна продукція', icon: require('../../assets/orders-screen/promotional-items.png') },
    ];

    return (
        <>
            <Text style={{
                fontFamily: Fonts.comfortaa700,
                fontSize: 18,
                textTransform: 'uppercase',
                marginBottom: 30,
                textAlign: 'center'
            }}>Оформлення <Text style={{ color: Colors.blue }}>Замовлення</Text></Text>

            {categories.map((category, index) => (
                <AnimatedWrapper
                    key={category.id}
                    useOpacity
                    offsetY={20}
                    delay={index * 60}
                >
                    <Pressable
                        style={({ pressed }) => [
                            {
                                backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
                            },
                            styles.categoryButton
                        ]}
                        onPress={() => {
                            stepHandler(category);
                        }}
                    >
                        <Image
                            source={category.icon}
                            style={styles.categoryIcon}
                        />
                        <Text style={styles.categoryText}>
                            {category.name}
                        </Text>
                    </Pressable>
                </AnimatedWrapper >
            ))
            }
        </>
    );
}

function SecondStep({ activeStep, selectedCategory, rateValue, balanceValue }: { activeStep: number, selectedCategory: string, rateValue: string | null, balanceValue: number | null }) {
    const STEP_ID = 2;
    if (activeStep !== STEP_ID) return null;
    //


    const subCategories = [
        { id: 3, name: `${selectedCategory} MINI`, option: false },
        { id: 4, name: `${selectedCategory} UNI плоскі`, option: true },
        { id: 2, name: `${selectedCategory} UNI П-образні`, option: true },
    ];

    return (
        <>
            <Text style={styles.stepSubtitle}>Оформлення Замовлення</Text>

            <Text style={styles.stepCategory}>{selectedCategory}</Text>

            {rateValue && balanceValue && <AnimatedWrapper
                useOpacity
                offsetY={20}
                style={styles.detailsBlock}
            >
                <Text style={styles.detailsText}>Готовність на: 03.07.2025</Text>
                <Text style={styles.detailsText}>{`Курс: ${rateValue} грн`}</Text>
                <Text style={styles.detailsText}>{`Баланс: ${balanceValue} $`}</Text>
            </AnimatedWrapper>}

            {subCategories.map((subCategory, index) => (
                <AnimatedWrapper
                    key={subCategory.id}
                    useOpacity
                    offsetY={5}
                    delay={index * 60}
                >
                    <Pressable
                        style={styles.categoryButton}
                        onPress={() => { }}
                    >
                        <Text style={styles.categoryText}>
                            {subCategory.name}
                        </Text>
                        {subCategory.option && (
                            <Text style={styles.categoryOptionText}>в коробі</Text>
                        )}
                    </Pressable>
                </AnimatedWrapper>
            ))}
        </>
    );
}

function CloseButton({ closeHandler }: { closeHandler: () => void }) {
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
    addBtnNotice: {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'center',
        backgroundColor: 'white',
        paddingBottom: 5,
        paddingTop: 2,
        width: 155,
        borderRadius: 15,
        position: 'absolute',
        bottom: 28,
        alignSelf: 'flex-end',
        right: 75
    },
    addBtnNoticeText: {
        fontFamily: Fonts.comfortaa400,
        fontSize: 12,
        opacity: 0.5
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
        width: '90%'
    },
    categoryButton: {
        overflow: 'hidden',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 12,
        paddingHorizontal: 18,
        // backgroundColor: 'white',
        borderRadius: 32,
        marginVertical: 5,
        borderWidth: 1,
        borderColor: '#3372F923'
    },
    categoryIcon: {
        width: 21,
        height: 21,
        backgroundColor: Colors.pale
    },
    categoryText: {
        fontFamily: Fonts.comfortaa400,
        fontSize: 15,
        lineHeight: 17,
        color: 'black'
    },
    categoryTextActive: {
        color: 'white'
    },
    button: {
        width: 59,
        height: 59,
        borderRadius: 50,
        overflow: 'hidden',
    },
    closeButton: {
        position: 'absolute',
        bottom: -100,
        right: 0
    },
    backButton: {
        position: 'absolute',
        bottom: -100,
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
    stepSubtitle: {
        fontFamily: Fonts.comfortaa400,
        fontSize: 16,
        textTransform: 'uppercase',
        marginBottom: 7,
        textAlign: 'right',
        color: Colors.gray,
    },
    stepCategory: {
        fontFamily: Fonts.comfortaa700,
        fontSize: 30,
        textTransform: 'uppercase',
        marginBottom: 30,
        textAlign: 'left',
        color: Colors.blue,
    },
    detailsBlock: {
        marginLeft: 18,
        marginBottom: 22,
    },
    detailsText: {
        fontFamily: Fonts.comfortaa400,
        fontSize: 16,
        color: Colors.gray,
    },
    categoryOptionText: {
        fontFamily: Fonts.comfortaa400,
        fontSize: 14,
        lineHeight: 16,
        color: Colors.red,
        flexGrow: 1,
        textAlign: 'right',
    },
});
