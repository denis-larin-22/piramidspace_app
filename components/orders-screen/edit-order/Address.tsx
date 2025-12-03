import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native"
import { Fonts } from "../../../theme/fonts";
import { Colors } from "../../../theme/colors";
import { useState } from "react";
import AnimatedWrapper from "../../animation/AnimatedWrapper";
import { IAddress } from "../../../lib/api/orders-screen/address";
import { formatAddressNP, formatAddressPrivat } from "../../../lib/utils";
import { ArrowDown } from "../../ui/ArrowDown";

function Address({
    address,
    addressList,
    addressHandler
}: {
    address: string,
    addressList: IAddress,
    addressHandler: (address: string) => void;

}) {
    const [listIsOpen, setListIsOpen] = useState<boolean>(false);

    return (
        <View style={styles.wrap}>
            <Text style={styles.detailsText}>Адреса </Text>

            <AnimatedWrapper useOpacity offsetY={20} delay={150}>
                <Text style={[styles.textArea, {
                    opacity: address === "адреса не вказана" ? 0.4 : 1,
                }]}>{address}</Text>
            </AnimatedWrapper>

            <AnimatedWrapper
                useOpacity offsetY={20} delay={100}
            >
                <Pressable onPress={() => setListIsOpen(!listIsOpen)}>
                    <Text style={styles.selectField}>
                        {Object.keys(addressList).find(opt => opt === address)}
                    </Text>
                </Pressable>
                <ArrowDown isRotate={listIsOpen} style={styles.arrowIcon} />
            </AnimatedWrapper>

            {listIsOpen && (
                <AnimatedWrapper
                    useOpacity
                    useScale
                    offsetY={-20}
                    style={styles.list}
                >
                    <ScrollView
                        style={styles.scrollModal}
                        nestedScrollEnabled={true}
                    >
                        {Object.keys(addressList).map((addressType, index) => (
                            <AnimatedWrapper
                                key={index}
                                useOpacity
                                offsetY={10}
                                delay={150 + (30 * index)}
                            >
                                <Pressable
                                    style={[
                                        styles.addressItem,
                                        address === addressType && { backgroundColor: Colors.pale },
                                    ]}
                                    pointerEvents="box-only"
                                    onPress={() => {
                                        const activeAddress = addressList[addressType];

                                        if (activeAddress === false) {
                                            addressHandler("");
                                            setListIsOpen(false);
                                        } else {
                                            if (addressType === "основний") {
                                                const addressValue = formatAddressNP(activeAddress);
                                                console.log(addressValue);
                                            } else if (addressType === "за адресою") {
                                                const addressValue = formatAddressPrivat(activeAddress);
                                                console.log(addressValue);
                                            }
                                        }

                                        setListIsOpen(false);
                                        // addressHandler(activeAddress);
                                    }}
                                >
                                    <Text style={styles.addressItemText}>
                                        {addressType.toLowerCase()}
                                    </Text>
                                </Pressable>
                            </AnimatedWrapper>
                        ))}
                    </ScrollView>
                </AnimatedWrapper>
            )}
        </View>
    )
};

export default Address;

const styles = StyleSheet.create({
    wrap: {
        marginTop: -110,
        position: 'relative',
        zIndex: -1
    },
    detailsText: {
        marginTop: 5,
        fontFamily: Fonts.comfortaa600,
        fontSize: 14,
        lineHeight: 16,
        color: Colors.gray,
    },
    selectField: {
        marginTop: 4,
        fontFamily: Fonts.openSans400,
        fontSize: 14,
        lineHeight: 16,
        color: "black",
        backgroundColor: "white",
        borderRadius: 31,
        borderWidth: 2,
        paddingVertical: 5,
        paddingHorizontal: 12,
        borderColor: Colors.blueLight
    },
    arrowIcon: {
        position: "absolute",
        zIndex: 10,
        right: 10,
        top: -20,
    },
    list: {
        minHeight: 50,
        maxHeight: 120,
        width: "100%",
        backgroundColor: "white",
        borderRadius: 17,
        position: "absolute",
        bottom: -120,
        zIndex: 1000,
        elevation: 1,
        padding: 8,
        paddingBottom: 4,
        pointerEvents: 'box-none'
    },
    scrollModal: {
        maxHeight: 120,
    },
    addressItem: {
        paddingTop: 3,
        paddingBottom: 5,
        marginBottom: 5,
        borderRadius: 70,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderColor: Colors.pale,
    },
    addressItemText: {
        fontFamily: Fonts.openSans400,
        fontSize: 14,
        color: "black",
    },
    textArea: {
        minHeight: 100,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 10,
        fontFamily: Fonts.openSans400,
        fontSize: 14,
        color: 'black',
        marginTop: 5,
    },
});