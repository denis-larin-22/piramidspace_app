import { useEffect, useState } from "react";
import AnimatedWrapper from "../animation/AnimatedWrapper";
import { Image, ImageBackground, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../../theme/colors";
import { Fonts } from "../../theme/fonts";

function AddNewOrder() {
    const [isTooltipVissible, setIsTooltipVissible] = useState<boolean>(true);
    const [isModalVissible, setIsModalVissible] = useState<boolean>(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsTooltipVissible(false);
        }, 5000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            {isTooltipVissible && (
                <AnimatedWrapper
                    useOpacity
                    offsetX={100}
                    delay={1000}
                    duration={600}
                    style={styles.addBtnNotice}>
                    <Text style={styles.addBtnNoticeText}>Додати замовлення</Text>
                </AnimatedWrapper>
            )}

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
                        <Image
                            source={require('../../assets/orders-screen/add-new-text.png')}
                            style={styles.modalTitleImage}
                            resizeMode="contain"
                        />

                        <FirstStep />

                        <CloseButton closeHandler={() => setIsModalVissible(false)} />
                    </AnimatedWrapper>
                </AnimatedWrapper>
            </Modal>
        </>
    );
}

export default AddNewOrder;

function FirstStep() {
    const [activeCategory, setActiveCategory] = useState<null | number>(null);

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
            {categories.map((category, index) => (
                <AnimatedWrapper
                    key={category.id}
                    useOpacity
                    useScale
                    offsetY={20}
                    delay={index * 80}
                >
                    <Pressable
                        style={[
                            styles.categoryButton,
                            activeCategory === category.id && styles.categoryButtonActive
                        ]}
                        onPress={() =>
                            setActiveCategory(prev => prev === category.id ? null : category.id)
                        }
                    >
                        <Image
                            source={category.icon}
                            style={styles.categoryIcon}
                        />
                        <Text
                            style={[
                                styles.categoryText,
                                activeCategory === category.id && styles.categoryTextActive
                            ]}
                        >
                            {category.name}
                        </Text>
                    </Pressable>
                </AnimatedWrapper>
            ))}
        </>
    );
}

function CloseButton({ closeHandler }: { closeHandler: () => void }) {
    return (
        <AnimatedWrapper delay={200} useOpacity offsetY={-30}>
            <Pressable style={styles.closeButton} onPress={closeHandler}>
                <ImageBackground
                    source={require('../../assets/gradient-small.png')}
                    style={styles.closeButtonBg}
                >
                    <Text style={styles.closeButtonText}>+</Text>
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
        borderRadius: 13
    },
    modalTitleImage: {
        width: 305,
        height: 82,
        marginBottom: 20
    },
    categoryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 12,
        paddingHorizontal: 18,
        backgroundColor: 'white',
        borderRadius: 32,
        marginVertical: 5,
    },
    categoryButtonActive: {
        backgroundColor: Colors.blue,
    },
    categoryIcon: {
        width: 21,
        height: 21,
        backgroundColor: Colors.pale
    },
    categoryText: {
        fontFamily: Fonts.comfortaa400,
        fontSize: 14,
        lineHeight: 16,
        color: 'black'
    },
    categoryTextActive: {
        color: 'white'
    },
    closeButton: {
        width: 59,
        height: 59,
        borderRadius: 50,
        overflow: 'hidden',
        position: 'absolute',
        bottom: -100,
        right: 0
    },
    closeButtonBg: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeButtonText: {
        fontFamily: Fonts.comfortaa400,
        fontSize: 40,
        lineHeight: 50,
        transform: [{ rotate: '45deg' }],
        color: 'white'
    }
});
