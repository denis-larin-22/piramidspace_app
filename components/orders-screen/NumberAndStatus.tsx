import {
    FlatList,
    Image,
    Keyboard,
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
    idValue,
    idValueHandler,
    statusValue,
    statusHandler
}: {
    statusColorsObjects: Array<IStatusColors>;
    idValue: string,
    idValueHandler: (numberValue: string) => void;
    statusValue: string,
    statusHandler: (statusValue: string) => void;
}) {
    const [idValueInput, setidValueInput] = useState<string>(idValue || "");
    const [isStatusModalOpen, setIsStatusModalOpen] = useState<boolean>(false);
    const [activeStatus, setActiveStatus] = useState<string>(statusValue || "");

    function resetId() {
        setidValueInput("");
        idValueHandler("");
    }

    function resetStatus() {
        setActiveStatus("");
        statusHandler("");
    }

    return (
        <View style={styles.wrapper}>
            <AnimatedWrapper useOpacity offsetX={50} duration={300} delay={100}>
                <TextInput
                    placeholder="    №"
                    placeholderTextColor={"#A2A2A8"}
                    style={styles.numberBox}
                    inputMode="numeric"
                    keyboardType="number-pad"
                    maxLength={6}
                    value={idValueInput}
                    onChange={(e) => {
                        // setActiveStatus(""); // reset filters by status
                        setidValueInput(e.nativeEvent.text);

                        if (e.nativeEvent.text.length === 6) {
                            Keyboard.dismiss();
                            resetStatus();
                            idValueHandler(e.nativeEvent.text); // триггерим новый запрос
                        }
                        if (e.nativeEvent.text.length === 0) {
                            idValueHandler("");
                        }
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

                        {activeStatus.length === 0 ?
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
                                                if (activeStatus === item.status) {
                                                    resetId();
                                                    statusHandler(""); // reset to full order list
                                                    setActiveStatus("");
                                                } else {
                                                    resetId();
                                                    statusHandler(item.origin);
                                                    setActiveStatus(item.status);
                                                }
                                            }}
                                        >
                                            <View style={[{ backgroundColor: item.color }, styles.modalItemColor]}></View>
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
        color: 'black',
        paddingLeft: 12,
        paddingRight: 11,
        backgroundColor: "white",
        minWidth: '18%',
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statusBox: {
        width: "80%",
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
        color: 'black'
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
        backgroundColor: "#00000060",
    },
    modalInner: {
        paddingBottom: 70,
        maxWidth: 280,
        maxHeight: 450,
        padding: 20,
        borderRadius: 20,
        position: 'absolute',
        right: 5,
        top: '20%',
        backgroundColor: Colors.pale
    },
    modalCloseButton: {
        width: 50,
        height: 50,
        position: "absolute",
        bottom: 10,
        right: 20,
        zIndex: 52,
        backgroundColor: 'white',
        borderRadius: 50,
        borderWidth: 1,
        borderColor: Colors.grayLight
    },
    modalCloseIcon: {
        width: 30,
        height: 30,
        top: 9,
        left: 9
    },
    modalItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginBottom: 7,
        paddingHorizontal: 8,
        paddingVertical: 7,
        borderRadius: 10,
        backgroundColor: 'white',
        overflow: 'hidden'
    },
    activeModalItem: {
        backgroundColor: Colors.blue,
    },
    modalItemText: {
        fontFamily: Fonts.comfortaa700,
        fontSize: 12,
        lineHeight: 14,
        color: "black",
        marginLeft: -10
    },
    activeModalText: {
        color: "white",
    },
    activeStatus: {
        color: Colors.gray,
        marginLeft: 10
    },
    modalItemColor: {
        width: 22,
        height: '230%',
        left: -10
    }
});