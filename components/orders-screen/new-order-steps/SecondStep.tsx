import { useEffect, useState } from "react";
import { INewOrderObject } from "../AddNewOrder";
import { getGroupsStructure, ISubgroup } from "../../../lib/api/orders-screen/groups-and-products";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import AnimatedWrapper from "../../animation/AnimatedWrapper";
import Loader from "../../ui/Loader";
import { Fonts } from "../../../theme/fonts";
import { Colors } from "../../../theme/colors";
import { getDataFromAcyncStorage } from "../../../lib/async-storage/acyncStorage";
import { ASYNC_STORAGE_USER_LOGIN } from "../../../lib/async-storage/asyncStorageKeys";
import { mainGroupsIcons } from "./FirstStep";

function SecondStep({ orderObject, rateValue, balanceValue, stepHandler }: {
    orderObject: INewOrderObject
    rateValue: string | null,
    balanceValue: number | null,
    stepHandler: (selectedSubgroup: ISubgroup) => void
}) {
    const { group: { code, name } } = orderObject;

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
                    const subgroups = groupsStructure.groups[0].subgroups;
                    setSubGroupsList(subgroups);
                }
            } else {
                setSubGroupsList(null);
            }
        }

        getSubgroups();
    }, [orderObject]);
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
            </AnimatedWrapper>

            {rateValue && balanceValue && <AnimatedWrapper
                useOpacity
                offsetY={25}
                delay={200}
                style={styles.detailsBlock}
            >
                <Text style={styles.detailsText}>{`Курс: ${rateValue} грн`}</Text>
                <Text style={styles.detailsText}>{`Баланс: ${balanceValue} $`}</Text>
            </AnimatedWrapper>
            }

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
                                onPress={() => stepHandler(subGroup)}
                            >
                                <Text style={styles.categoryText}>
                                    {subGroup.name}
                                </Text>
                                {/* {subGroup.option && (
                                <Text style={styles.categoryOptionText}>в коробі</Text>
                            )} */}
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
        marginBottom: 7,
        textAlign: 'center',
        color: Colors.gray,
    },
    stepCategory: {
        fontFamily: Fonts.comfortaa700,
        fontSize: 30,
        textTransform: 'uppercase',
        marginBottom: 15,
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
        marginVertical: 5,
        borderWidth: 1,
        borderColor: '#3372F923',
    },
    categoryText: {
        fontFamily: Fonts.comfortaa400,
        fontSize: 15,
        lineHeight: 17,
        color: 'black',
    },
});
