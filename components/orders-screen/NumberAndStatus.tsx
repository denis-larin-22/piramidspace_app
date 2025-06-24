import {
    FlatList,
    Image,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { Fonts } from "../../theme/fonts";
import { IStatusColors } from "../../screens/OrdersScreen";
import { Colors } from "../../theme/colors";
import AnimatedWrapper from "../animation/AnimatedWrapper";
import { useState } from "react";

function NumberAndStatus({
    statusColorsObjects,
    getOrderByNumberHandler,
    getOrdersByStatusHandler,
}: {
    statusColorsObjects: Array<IStatusColors>;
    getOrderByNumberHandler: (numberValue: string) => void;
    getOrdersByStatusHandler: (status: string | null) => void;
}) {
    const [numberInputValue, setNumberInputValue] = useState<string>('');
    const [isStatusModalOpen, setIsStatusModalOpen] = useState<boolean>(false);
    const [activeStatus, setActiveStatus] = useState<string | null>(null);

    return (
        <View style={styles.wrapper}>
            <AnimatedWrapper useOpacity offsetX={50} duration={300} delay={100}>
                <TextInput
                    placeholder="№"
                    style={styles.numberBox}
                    inputMode="numeric"
                    keyboardType="number-pad"
                    maxLength={6}
                    value={numberInputValue}
                    onChange={(e) => {
                        setActiveStatus(null); // reset filters by status

                        const numberValue = e.nativeEvent.text;
                        setNumberInputValue(numberValue);
                        getOrderByNumberHandler(numberValue);
                    }}
                />
            </AnimatedWrapper>

            <AnimatedWrapper
                useOpacity
                offsetX={50}
                duration={300}
                delay={200}
                style={styles.statusBox}
            >
                <Pressable
                    style={styles.statusPressable}
                    onPress={() => setIsStatusModalOpen(true)}
                >
                    <Text style={styles.statusText}>{isStatusModalOpen ? 'Оберіть статус' : 'Статус:'}</Text>
                    {!isStatusModalOpen && <AnimatedWrapper useOpacity duration={400} offsetY={10}>

                        {activeStatus === null ?
                            <FlatList
                                data={statusColorsObjects}
                                renderItem={({ item }) => <Item color={item.color} />}
                                keyExtractor={(item) => item.color}
                                horizontal
                                style={styles.flatList}
                            />
                            :
                            <Text style={[styles.statusText, styles.activeStatus]}>{activeStatus}</Text>
                        }
                    </AnimatedWrapper>}
                </Pressable>
            </AnimatedWrapper>


            {
                <Modal visible={isStatusModalOpen} transparent >
                    <AnimatedWrapper
                        style={styles.modalOverlay}
                        useScale
                        duration={100}
                    >
                        <View style={styles.modalInner}>
                            <Pressable
                                style={styles.modalCloseButton}
                                onPress={() => setIsStatusModalOpen(false)}
                            >
                                <Image
                                    source={require("../../assets/main-screen/close-icon.png")}
                                    style={styles.modalCloseIcon}
                                />
                            </Pressable>

                            <FlatList
                                data={statusColorsObjects}
                                renderItem={({ item, index }) => (
                                    <AnimatedWrapper
                                        useOpacity
                                        offsetX={20}
                                        delay={index * 50}
                                    >
                                        <Pressable
                                            style={[
                                                styles.modalItem,
                                                item.status === activeStatus && styles.activeModalItem,
                                            ]}
                                            onPress={() => {
                                                if (item.status === activeStatus) {
                                                    getOrderByNumberHandler('') // reset filter handler bu Number
                                                    setNumberInputValue(''); // reset number input value

                                                    setActiveStatus(null);
                                                    getOrdersByStatusHandler(null);
                                                } else {
                                                    getOrderByNumberHandler('') // reset filter handler bu Number
                                                    setNumberInputValue(''); // reset number input value

                                                    setActiveStatus(item.status);
                                                    const originalStatus = getOriginalStatus(item.status);
                                                    getOrdersByStatusHandler(originalStatus);
                                                }
                                            }}
                                        >
                                            <Item color={item.color} />
                                            <Text
                                                style={[
                                                    styles.modalItemText,
                                                    item.status === activeStatus && styles.activeModalText,
                                                ]}
                                            >
                                                {item.status}
                                            </Text>
                                        </Pressable>
                                    </AnimatedWrapper>
                                )}
                                keyExtractor={(item) => item.color}
                            />
                        </View>
                    </AnimatedWrapper>
                </Modal>
            }
        </View>
    );
}

export default NumberAndStatus;

function getOriginalStatus(formatedStatus: string): string {
    switch (formatedStatus.toLowerCase()) {
        case "видалений":
            return "удален";
        case "у виробництві":
            return "у виробництві";
        case "виготовлені":
            return "изготовлен";
        case "попередній":
            return "предварительный";
        default:
            return formatedStatus;
    }
}

function Item({ color }: { color: string }) {
    return (
        <View
            style={[
                styles.flatItem,
                {
                    backgroundColor: color,
                    borderColor: color === "#FFFFFF" ? Colors.gray : color,
                },
            ]}
        />
    );
}

const styles = StyleSheet.create({
    wrapper: {
        marginTop: 20,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    numberBox: {
        fontFamily: Fonts.comfortaa700,
        fontSize: 12,
        paddingVertical: 7,
        paddingHorizontal: 12,
        backgroundColor: "white",
        minWidth: "25%",
        borderRadius: 32,
        textAlign: 'center',
        verticalAlign: 'middle'
    },
    statusBox: {
        width: "74%",
        paddingVertical: 7,
        paddingHorizontal: 12,
        backgroundColor: "white",
        borderRadius: 32,
        flexDirection: "row",
        alignItems: "center",
    },
    statusText: {
        fontFamily: Fonts.comfortaa700,
        fontSize: 12,
        lineHeight: 17,
    },
    statusPressable: {
        flexDirection: "row",
        width: '100%'
    },
    flatList: {
        marginLeft: 5,
    },
    flatItem: {
        width: 16,
        height: 16,
        borderWidth: 1,
        borderRadius: 50,
        marginLeft: 2,
    },
    modalOverlay: {
        position: "relative",
        height: "100%",
        width: "100%",
        backgroundColor: "#00000050",
    },
    modalInner: {
        paddingTop: 50,
        maxWidth: 280,
        maxHeight: 450,
        padding: 20,
        borderRadius: 20,
        position: 'absolute',
        right: 0,
        top: '14%',
    },
    modalCloseButton: {
        width: 30,
        height: 30,
        position: "absolute",
        top: 10,
        right: 10,
        zIndex: 52,
        backgroundColor: Colors.pale,
        borderRadius: 50
    },
    modalCloseIcon: {
        width: 30,
        height: 30,
    },
    modalItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginBottom: 8,
        paddingHorizontal: 8,
        paddingVertical: 7,
        borderRadius: 20,
        backgroundColor: Colors.pale,
    },
    activeModalItem: {
        backgroundColor: Colors.blue,
    },
    modalItemText: {
        fontFamily: Fonts.comfortaa700,
        fontSize: 12,
        lineHeight: 12,
        color: "black",
    },
    activeModalText: {
        color: "white",
    },
    activeStatus: {
        color: Colors.gray,
        marginLeft: 10
    }
});