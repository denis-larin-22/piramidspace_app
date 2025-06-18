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
                    onChange={(e) => {
                        const numberValue = e.nativeEvent.text;
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
                    <Text style={styles.statusText}>Статус</Text>
                    <FlatList
                        data={statusColorsObjects}
                        renderItem={({ item }) => <Item color={item.color} />}
                        keyExtractor={(item) => item.color}
                        horizontal
                        style={styles.flatList}
                    />
                </Pressable>
            </AnimatedWrapper>

            <Modal visible={isStatusModalOpen} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <Text style={styles.statusText}>Статус</Text>

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

                        <Text style={styles.modalTitle}>Оберіть статус:</Text>

                        <FlatList
                            data={statusColorsObjects}
                            renderItem={({ item }) => (
                                <Pressable
                                    style={[
                                        styles.modalItem,
                                        item.status === activeStatus && styles.activeModalItem,
                                    ]}
                                    onPress={() => {
                                        if (item.status === activeStatus) {
                                            setActiveStatus(null);
                                            getOrdersByStatusHandler(null);
                                            setIsStatusModalOpen(false);
                                        } else {
                                            setActiveStatus(item.status);
                                            const originalStatus = getOriginalStatus(item.status);
                                            getOrdersByStatusHandler(originalStatus);
                                            setIsStatusModalOpen(false);
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
                            )}
                            keyExtractor={(item) => item.color}
                        />
                    </View>
                </View>
            </Modal>
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
    },
    statusBox: {
        width: "70%",
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
    },
    flatList: {
        marginLeft: 10,
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
        backgroundColor: "#00000070",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    modalInner: {
        backgroundColor: Colors.pale,
        maxHeight: 450,
        padding: 20,
        borderRadius: 20,
    },
    modalCloseButton: {
        width: 20,
        height: 20,
        position: "absolute",
        top: 10,
        right: 10,
        zIndex: 52,
    },
    modalCloseIcon: {
        width: 20,
        height: 20,
    },
    modalTitle: {
        fontFamily: Fonts.comfortaa700,
        fontSize: 16,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderColor: Colors.gray,
        marginBottom: 10,
    },
    modalItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginBottom: 7,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
        backgroundColor: "#A2A2A830",
    },
    activeModalItem: {
        backgroundColor: Colors.blue,
    },
    modalItemText: {
        fontFamily: Fonts.comfortaa600,
        fontSize: 12,
        lineHeight: 12,
        color: "black",
    },
    activeModalText: {
        color: "white",
    },
});
