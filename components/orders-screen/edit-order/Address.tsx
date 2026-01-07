import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native"
import { Fonts } from "../../../theme/fonts";
import { Colors } from "../../../theme/colors";
import { useState } from "react";
import AnimatedWrapper from "../../animation/AnimatedWrapper";
import { IAddress, IAddressValuesPrivat } from "../../../lib/api/orders-screen/address";
import { formatAddressNP, formatAddressPrivat } from "../../../lib/utils";
import { ArrowDown } from "../../ui/ArrowDown";

function Address({
    address,
    currentAddressType,
    addressList,
    addressHandler
}: {
    address: string,
    currentAddressType: string,
    addressList: IAddress,
    addressHandler: (type: string, address: string) => void;

}) {
    const [listIsOpen, setListIsOpen] = useState<boolean>(false);

    function setActiveAddress(type: keyof IAddress) {
        if (type === "довільний") {
            return {
                type: type,
                address: formatAddressNP(addressList["основний"])
            }
        } else if (type === "основний") {
            return {
                type: "основний",
                address: formatAddressNP(addressList["основний"])
            }
        } else if (type === "За адресою") {
            return {
                type: "За адресою",
                address: formatAddressPrivat(addressList["За адресою"] as IAddressValuesPrivat)
            }
        } else if (type === "додатковий") {
            return {
                type: type,
                address: formatAddressNP(addressList["основний"])
            }
        } else {
            return {
                type: type,
                address: formatAddressNP(addressList["основний"])
            }
        }
    }

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
                        {currentAddressType}
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
                                        currentAddressType === addressType && { backgroundColor: Colors.pale },
                                    ]}
                                    pointerEvents="box-only"
                                    onPress={() => {
                                        const { type, address } = setActiveAddress(addressType as keyof IAddress);
                                        addressHandler(type, address);

                                        setListIsOpen(false);
                                    }}
                                >
                                    <Text style={styles.addressItemText}>
                                        {addressType}
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
        position: 'relative',
    },
    detailsText: {
        marginTop: 5,
        fontFamily: Fonts.comfortaa600,
        fontSize: 14,
        lineHeight: 16,
        color: Colors.gray,
    },
    selectField: {
        marginTop: 7,
        fontFamily: Fonts.openSans400,
        fontSize: 16,
        color: "black",
        backgroundColor: "white",
        paddingVertical: 9,
        paddingHorizontal: 13,
        borderRadius: 31,
        borderWidth: 2,
        borderColor: Colors.blueLight
    },
    arrowIcon: {
        position: "absolute",
        zIndex: 10,
        right: 15,
        top: -27,
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