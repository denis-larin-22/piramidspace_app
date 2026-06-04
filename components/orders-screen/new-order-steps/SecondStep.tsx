import { useEffect, useState } from "react";
import { getGroupsStructure, ISubgroup } from "../../../lib/api/orders-screen/groups-and-products";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import AnimatedWrapper from "../../animation/AnimatedWrapper";
import Loader from "../../ui/Loader";
import { Fonts } from "../../../theme/fonts";
import { Colors } from "../../../theme/colors";
import { getDataFromAcyncStorage } from "../../../lib/async-storage/acyncStorage";
import { ASYNC_STORAGE_USER_LOGIN } from "../../../lib/async-storage/asyncStorageKeys";
import { INewOrderObject, useCreateOrder } from "../NewOrderProvider";
import RetailOrderButton from "./fourth-step/RetailOrderButton";

function SecondStep({ rateValue, balanceValue, stepHandler }: {
    rateValue: string | null,
    balanceValue: number | null,
    stepHandler: () => void
}) {
    const { orderParams, setOrderParams } = useCreateOrder();
    const { group: { code, name } } = orderParams.newOrderObject;

    const [subGroupsList, setSubGroupsList] = useState<ISubgroup[] | null>(null);

    useEffect(() => {
        async function getSubgroups() {
            const login = await getDataFromAcyncStorage(ASYNC_STORAGE_USER_LOGIN);
            if (code === null || name === null || login === undefined) {
                setSubGroupsList([]);
                return;
            }

            const groupsStructure = await getGroupsStructure(code, login);

            if (groupsStructure) {
                if (groupsStructure.groups.length === 0) {
                    setSubGroupsList(null);
                } else {
                    const subgroups = groupsStructure.groups[0].subgroups.filter((subgroup) => subgroup.name !== 'Готові вироби');
                    setSubGroupsList(subgroups);
                }
            } else {
                setSubGroupsList(null);
            }
        }

        getSubgroups();
    }, [orderParams.newOrderObject]);

    const selectHandler = (selectedSubgroup: ISubgroup) => {
        const updatedOrder: INewOrderObject = {
            ...orderParams.newOrderObject,
            subgroup: selectedSubgroup
        };

        setOrderParams({ ...orderParams, newOrderObject: updatedOrder });
        stepHandler();
    }
    return (
        <>
            <AnimatedWrapper
                useOpacity
                delay={100}
                offsetY={25}
            >
                <Text style={styles.stepSubtitle}>Оформлення Замовлення</Text>
            </AnimatedWrapper>

            <AnimatedWrapper
                useOpacity
                delay={150}
                offsetY={25}
            >
                <Text style={styles.stepCategory}>{name}</Text>
                <RetailOrderButton
                    style={{ alignSelf: "flex-start", marginBottom: 15 }}
                />
            </AnimatedWrapper>

            {/* {rateValue && balanceValue && <AnimatedWrapper
                useOpacity
                offsetY={25}
                delay={200}
                style={styles.detailsBlock}
            >
                <Text style={styles.detailsText}>{`Курс: ${rateValue} грн`}</Text>
                <Text style={styles.detailsText}>{`Баланс: ${balanceValue} $`}</Text>
            </AnimatedWrapper>
            } */}

            {subGroupsList !== null ?
                <ScrollView
                    style={{ minHeight: 200, maxHeight: 300 }}
                >
                    {subGroupsList.map((subGroup, index) => (
                        <AnimatedWrapper
                            key={subGroup.code}
                            useOpacity
                            offsetY={20}
                            delay={100 + (index * 60)}
                        >
                            <Pressable
                                style={styles.categoryButton}
                                onPress={() => selectHandler(subGroup)}
                            >
                                <Text style={styles.categoryText}>
                                    {subGroup.name}
                                </Text>
                                <Image
                                    source={require('../../../assets/orders-screen/arrow.webp')}
                                    style={styles.arrow}
                                />
                            </Pressable>
                        </AnimatedWrapper>
                    ))}
                </ScrollView>
                :
                <View style={{
                    width: '100%',
                    height: 200,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Loader radius={150} />
                </View>
            }
        </>
    );
}

export default SecondStep;

const styles = StyleSheet.create({
    stepSubtitle: {
        fontFamily: Fonts.comfortaa400,
        fontSize: 16,
        textTransform: 'uppercase',
        textAlign: 'center',
        color: Colors.gray,
    },
    stepCategory: {
        fontFamily: Fonts.comfortaa700,
        fontSize: 30,
        textTransform: 'uppercase',
        marginBottom: 5,
        marginLeft: 10,
        textAlign: 'left',
        color: Colors.blue,
    },
    detailsBlock: {
        marginBottom: 22,
        marginLeft: 10,
    },
    detailsText: {
        fontFamily: Fonts.comfortaa600,
        fontSize: 16,
        color: Colors.gray,
    },
    categoryButton: {
        overflow: 'hidden',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 12,
        paddingHorizontal: 18,
        borderRadius: 32,
        backgroundColor: 'white',
        marginVertical: 5,
        shadowColor: Colors.gray,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 2,
    },
    categoryText: {
        fontFamily: Fonts.comfortaa400,
        fontSize: 15,
        lineHeight: 17,
        color: 'black',
    },
    arrow: {
        width: 5,
        height: 10,
        position: 'absolute',
        right: 15,
    }
});
