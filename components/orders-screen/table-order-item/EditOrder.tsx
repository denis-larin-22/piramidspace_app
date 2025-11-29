import { Image, ImageBackground, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Colors } from "../../../theme/colors";
import AnimatedWrapper from "../../animation/AnimatedWrapper";
import { useEffect, useState } from "react";
import { IOrder, IOrderItem } from "../../../lib/api/orders-screen/ordersList";
import { getGroupsStructure, ISubgroup, MainGroupsCode } from "../../../lib/api/orders-screen/groups-and-products";
import { formatCharacteristicsString } from "./OrderDetails";
import { Fonts } from "../../../theme/fonts";
import EditableItem from "../edit-order/EditableItem";
import { CloseButton } from "../../ui/CloseButton";
import Loader from "../../ui/Loader";
import Comment from "../edit-order/Comment";
import Address from "../edit-order/Address";
import { ASYNC_STORAGE_USER_LOGIN } from "../../../lib/async-storage/asyncStorageKeys";
import { getDataFromAcyncStorage } from "../../../lib/async-storage/acyncStorage";
import { editOrder, IEditableOrder, IOrderItemToAdd, IOrderItemToDelete, IOrderItemToUpdate } from "../../../lib/api/orders-screen/edit-order";
import { ErrorMessage } from "../../ui/ErrorMessage";
import { fetchAddressList, IAddress } from "../../../lib/api/orders-screen/address";
import { SuccessMessage } from "../../ui/SuccessMessage";

const UNITS = "см";

function EditOrder({
    currentOrder,
    updateAfterEditHandler
}: {
    currentOrder: IOrder,
    updateAfterEditHandler: () => void
}) {
    // Main states
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isDataReady, setIsDataReady] = useState<boolean>(false); // флаг готовности
    const [subgroupData, setSubgroupData] = useState<ISubgroup | null>(null);
    const [addressList, setAddressList] = useState<IAddress | null>(null);
    const [responseResult, setResponseResult] = useState<boolean | null>(null);

    const [isSubmitBtnHidden, setIsSubmitBtnHidden] = useState<boolean>(true);

    // Init state of editable order
    const initEditOrderParams: IEditableOrder = {
        login: '',
        order: {
            "ВидАдресаВЗаказе": currentOrder["ВидАдресаВЗаказе"],
            "адрес доставки": currentOrder["адрес доставки"],
            "комментарий": currentOrder["комментарий"],
            "статус": currentOrder["статус"],
            "предопл": currentOrder["предопл"],
            "скидка": +currentOrder["скидка"]
        },
        items: []
    }
    // Editable object(order) state
    const [editOrderParams, setEditOrderParams] = useState<IEditableOrder>(initEditOrderParams);
    const [editItemsList, setEditItemsList] = useState<(IOrderItemToAdd | IOrderItemToUpdate | IOrderItemToDelete)[]>([]);

    // /////////////////////

    useEffect(() => {
        async function getData() {
            // start
            setIsDataReady(false);


            const groupCode = parseGroupCode(currentOrder['вид заказа']);
            const subgroupCode = parseSubgroupCode(currentOrder.items[0]['наименование']);

            const login = await getDataFromAcyncStorage(ASYNC_STORAGE_USER_LOGIN);

            // products list
            const dataByGroup = await getGroupsStructure(groupCode, login);
            const dataBySubgroup = dataByGroup.groups[0].subgroups.find((subgroup) => subgroup.code === subgroupCode);
            setSubgroupData(dataBySubgroup);
            // addresses list
            const addressList = await fetchAddressList(login);
            setAddressList(addressList);

            // filtering out unchangeable names ("Замер", "Доставка", "Установка")
            const initItemsList: IOrderItem[] = currentOrder.items.map((item) => {
                if (item['наименование'] === "Замер" || item['наименование'] === "Доставка" || item['наименование'] === "Установка") return null;

                return item;
            }).filter((item) => item !== null);

            // solving editable items 
            const editableItemsList: IOrderItemToUpdate[] = initItemsList.map((item) => {
                const { width, height, color, controlSide, fixation } = formatCharacteristicsString(item['характерстика']);

                return {
                    action: "update",
                    old_name: item['наименование'],
                    old_characteristic: item['характерстика'],
                    product_code: item['наименование'],
                    group_code: groupCode,
                    subgroup_code: subgroupCode,
                    width: Number(width),
                    height: Number(height),
                    quantity: +item['кол_во'],
                    side: controlSide,
                    system_color: color,
                    units: UNITS,
                    fixation_type: fixation,
                    options: ""  // ОПЦИИ НА ДРУГИЕ ВИДЫ - ОПЦИОНАЛЬНО
                }
            })
            // solving editable object
            const editOrderObject: IEditableOrder = {
                ...editOrderParams,
                login: login,
                order: {
                    ...editOrderParams.order,
                    "статус": currentOrder['статус'],
                    "адрес доставки": currentOrder['адрес доставки'],
                    "ВидАдресаВЗаказе": currentOrder['ВидАдресаВЗаказе'],
                    "комментарий": currentOrder['комментарий'],
                    "предопл": currentOrder['предопл'],
                    "скидка": +currentOrder['скидка']
                },
                items: editableItemsList
            }
            // set editable object state
            setEditOrderParams(editOrderObject);
            // set editable items state
            setEditItemsList(editableItemsList);

            // finish
            setIsDataReady(true);
        }

        getData();
    }, []);

    async function editResponseHandler() {
        const requestObject: IEditableOrder = {
            ...editOrderParams,
            items: editItemsList
        };

        const response = await editOrder(currentOrder["N_заказа"], requestObject);
        if (response === null) {
            setResponseResult(false);
            setTimeout(() => { setResponseResult(null) }, 3000);
        } else {
            setResponseResult(true);
            setTimeout(() => {
                setResponseResult(null);
                setIsOpen(false);
                updateAfterEditHandler();
            }, 2000);
        }
    }

    return (
        <>
            <Pressable
                onPress={() => setIsOpen(true)}
                style={styles.editDetailBtn}
            >
                <Image
                    source={require('../../../assets/orders-screen/edit.png')}
                    style={styles.editDetailIcon}
                />
            </Pressable >

            <Modal
                visible={isOpen}
                transparent={true}
                animationType="fade"
                statusBarTranslucent={true}
                onRequestClose={() => setIsOpen(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{ flex: 1 }}
                >
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
                            {isDataReady ?
                                <>
                                    <AnimatedWrapper
                                        useOpacity
                                        offsetY={20}
                                        delay={200}
                                    >
                                        <Text style={styles.titleBlue}>Редагування</Text>
                                        <Text style={[styles.title]}>замовлення #{currentOrder['N_заказа']}</Text>

                                        <Image
                                            source={require('../../../assets/orders-screen/pencil.webp')}
                                            style={styles.editDetailLogo}
                                        />
                                    </AnimatedWrapper>

                                    {(responseResult === false) &&
                                        <ErrorMessage
                                            errorText="Помилка редагування замовлення"
                                            styles={styles.notification}
                                        />}
                                    {(responseResult === true) &&
                                        <SuccessMessage
                                            text="Замовлення відредаговано"
                                            styles={styles.notification}
                                        />}

                                    <ScrollView
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        contentContainerStyle={styles.itemsScrollContent}
                                        style={styles.itemsScroll}
                                    >
                                        {editItemsList.map((item, index) => (
                                            <EditableItem
                                                key={index}
                                                item={item as IOrderItemToUpdate}
                                                subgroupData={subgroupData}
                                                index={index}
                                                onItemChange={(updatedItem) => {
                                                    setIsSubmitBtnHidden(false);
                                                    setEditItemsList(prev =>
                                                        prev.map((it, i) => i === index ? updatedItem : it)
                                                    );
                                                }}
                                            />
                                        ))}
                                    </ScrollView>

                                    {/* <Address
                                    address={currentOrder['адрес доставки']}
                                    addressList={addressList}
                                    addressHandler={(address: string) => {
                                        setEditOrderParams({
                                            ...editOrderParams,
                                            order: {
                                                ...editOrderParams.order,
                                                "адрес доставки": address
                                            }
                                        })
                                    }}
                                /> */}

                                    <AnimatedWrapper
                                        useOpacity
                                        offsetY={20}
                                        delay={360}
                                    >
                                        <Comment
                                            comment={currentOrder['комментарий']}
                                            commentHandler={(value: string) => {
                                                setIsSubmitBtnHidden(false);
                                                setEditOrderParams({
                                                    ...editOrderParams,
                                                    order: {
                                                        ...editOrderParams.order,
                                                        "комментарий": value
                                                    }
                                                })
                                            }}
                                        />
                                    </AnimatedWrapper>
                                </>
                                :
                                <View style={styles.loaderWrap}>
                                    <Loader radius={100} />
                                </View>
                            }

                            <CloseButton closeHandler={() => setIsOpen(false)} style={styles.closeButton} />
                            {!isSubmitBtnHidden && <AnimatedWrapper
                                offsetY={20}
                                style={styles.submitButton}
                            >
                                <Pressable onPress={editResponseHandler}>
                                    <ImageBackground
                                        source={require("../../../assets/gradient-small.png")}
                                        style={styles.submitButtonBg}
                                    >
                                        <Text style={styles.submitButtonText}>Зберегти</Text>
                                    </ImageBackground>
                                </Pressable>
                            </AnimatedWrapper>}
                        </AnimatedWrapper>
                    </AnimatedWrapper>
                </KeyboardAvoidingView>
            </Modal>
        </>
    )
};

export default EditOrder;

// DETECT GROUP CODE
function parseGroupCode(typeOrder: string): MainGroupsCode {
    const type = typeOrder.toLowerCase().replace(/[^a-zA-Zа-яА-ЯёЁїЇєЄіІґҐ]/g, "");

    if (type === 'деньніч' || type === 'деньночь') {
        return 'day';
    } else if (type === 'горизонтальныежалюзи') {
        return 'horizontal';
    } else if (type === 'вертикальныежалюзи') {
        return 'vertical';
    } else if (type === 'рулонка') {
        return 'roller';
    } else {
        return typeOrder as MainGroupsCode;
    }
}

// DETECT SUBGROUP CODE
type SubgroupRule = {
    code: string;
    keywords: string[];
};

const subgroupRules: SubgroupRule[] = [
    { code: "day_mini", keywords: ["дн", "mini"] },
    { code: "magic25", keywords: ["magic", "25"] },
    { code: "day_uni_plosk", keywords: ["дн", "uni", "плоск"] },
    { code: "day_uni_p", keywords: ["дн", "uni", "п-образ"] },

    { code: "127mm", keywords: ["127 мм"] },
    { code: "89mm", keywords: ["89 мм"] },
    { code: "25mm_string", keywords: ["25 мм", "стру"] },
    { code: "25mm", keywords: ["25 мм"] },
    { code: "16mm_string", keywords: ["16 мм", "стру"] },
    { code: "16mm", keywords: ["16 мм"] },
    { code: "prishit", keywords: ["прис"] },
    { code: "mini", keywords: ["mini"] },
    { code: "magic30", keywords: ["magic", "30"] },
    { code: "uni_flat", keywords: ["uni", "плоск"] },
    { code: "uni_p", keywords: ["uni", "п-образ"] },
];

function parseSubgroupCode(productName: string): string {
    const name = productName.toLowerCase().replace(/[_-]/g, " ");

    for (const rule of subgroupRules) {
        if (rule.keywords.every(kw => name.includes(kw))) {
            return rule.code;
        }
    }
}

const styles = StyleSheet.create({
    editDetailBtn: {
        width: 40,
        height: 40,
        backgroundColor: Colors.pale,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
    },
    editDetailIcon: {
        width: 18,
        height: 18,
        opacity: 0.3
    },
    editDetailLogo: {
        width: 30,
        height: 30,
        position: 'absolute',
        right: 10,
        top: 5,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0,
        margin: 0,
    },
    modalContent: {
        backgroundColor: Colors.pale,
        paddingVertical: 20,
        paddingHorizontal: 12,
        borderRadius: 13,
        width: '92%',
        maxHeight: '92%',
        minHeight: 300,
    },
    loaderWrap: {
        alignItems: 'center',
        paddingTop: 70
    },
    title: {
        fontSize: 16,
        fontFamily: Fonts.comfortaa600,
        textTransform: "uppercase",
        color: Colors.gray,
    },
    titleBlue: {
        fontSize: 18,
        fontFamily: Fonts.comfortaa700,
        textAlign: "left",
        textTransform: "uppercase",
        color: Colors.blue,
    },
    submitButton: {
        height: 59,
        maxWidth: 180,
        width: "100%",
        borderRadius: 31,
        overflow: "hidden",
        position: "absolute",
        zIndex: 0,
        bottom: -70,
        alignSelf: "center",
    },
    submitButtonBg: {
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    submitButtonText: {
        fontFamily: Fonts.comfortaa600,
        fontSize: 17,
        lineHeight: 22,
        color: "white",
    },
    itemsScroll: {
        flexGrow: 1,
        marginHorizontal: -10,
        marginVertical: 10,
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 5,
        borderColor: Colors.blueLight,
        borderStyle: 'solid',
    },
    itemsScrollContent: {
        flexDirection: 'row',
        paddingHorizontal: 5,
        gap: 12,
    },
    closeButton: {
        position: "absolute",
        zIndex: 0,
        right: 0,
        bottom: -90,
    },
    notification: {
        zIndex: 1000,
        marginTop: 250
    }
});