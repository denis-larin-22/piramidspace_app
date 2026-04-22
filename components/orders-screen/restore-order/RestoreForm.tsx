import { useEffect, useState } from "react";
import { getGroupsStructure, ISubgroup } from "../../../lib/api/orders-screen/groups-and-products";
import { fetchAddressList, IAddress } from "../../../lib/api/orders-screen/address";
import { editOrder, IEditableOrder, IOrderItemToAdd, IOrderItemToDelete, IOrderItemToUpdate } from "../../../lib/api/orders-screen/edit-order";
import { parseGroupCode, parseSubgroupCode } from "../table-order-item/EditOrder";
import { getDataFromAcyncStorage } from "../../../lib/async-storage/acyncStorage";
import { ASYNC_STORAGE_USER_INFO_OBJECT } from "../../../lib/async-storage/asyncStorageKeys";
import { IUserInfo } from "../../../lib/api/auth";
import { IOrder, IOrderItem } from "../../../lib/api/orders-screen/ordersList";
import { formatCharacteristicsString } from "../table-order-item/OrderDetails";
import { ImageBackground, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Colors } from "../../../theme/colors";
import { Fonts } from "../../../theme/fonts";
import AnimatedWrapper from "../../animation/AnimatedWrapper";
import { ErrorMessage } from "../../ui/ErrorMessage";
import { SuccessMessage } from "../../ui/SuccessMessage";
import EditableItem from "../edit-order/EditableItem";
import Address from "../edit-order/Address";
import Comment from "../edit-order/Comment";
import Loader from "../../ui/Loader";
import { CloseButton } from "../../ui/CloseButton";
import { calculateOrderPriceDayNight, ICalculateOrderItem, ICalculateOrderObject } from "../../../lib/api/orders-screen/calculate-order";

function RestoreForm({
    currentOrder,
    isOpen,
    setIsOpen,
    updateAfterRestoreHandler
}: {
    currentOrder: IOrder,
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    updateAfterRestoreHandler: () => void
}) {
    const [isDataReady, setIsDataReady] = useState<boolean>(false); // флаг готовности
    const [subgroupData, setSubgroupData] = useState<ISubgroup | null>(null);
    const [addressList, setAddressList] = useState<IAddress | null>(null);
    const [address, setAddress] = useState({ type: "", address: "" });
    const [responseResult, setResponseResult] = useState<boolean | null>(null);

    const [isSubmitBtnHidden, setIsSubmitBtnHidden] = useState<boolean>(true);

    // Init state of editable order to restore
    const initRestoreOrderParams: IEditableOrder = { //!!!!!!!!
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
    // Editable object(order) state to restore
    const [editOrderParams, setEditOrderParams] = useState<IEditableOrder>(initRestoreOrderParams);
    const [editItemsList, setEditItemsList] = useState<(IOrderItemToAdd | IOrderItemToUpdate | IOrderItemToDelete)[]>([]);
    // /////////////////////

    useEffect(() => {
        async function getData() {
            // start
            setIsDataReady(false);

            const groupCode = parseGroupCode(currentOrder['вид заказа']);
            const subgroupCode = parseSubgroupCode(currentOrder.items[0]['наименование']);

            const userInfo = await getDataFromAcyncStorage(ASYNC_STORAGE_USER_INFO_OBJECT);
            const { "логин": login } = JSON.parse(userInfo) as IUserInfo;

            // products list
            const dataByGroup = await getGroupsStructure(groupCode, login)

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
                    units: "см",
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

            // current address by current order
            setAddress({
                type: currentOrder['ВидАдресаВЗаказе'],
                address: currentOrder['адрес доставки'],
            });
            // set editable object state
            setEditOrderParams(editOrderObject);
            // set editable items state
            setEditItemsList(editableItemsList);

            // finish
            setIsDataReady(true);
        }

        getData();
    }, []);

    useEffect(() => {
        if (editItemsList.length === 0) {
            setIsSubmitBtnHidden(false);
        } else {
            setIsSubmitBtnHidden(true);
        }

    }, [editItemsList]);

    async function restoreResponseHandler() {
        const filtredList = editItemsList.filter((item) => item.action !== "delete");
        const responseProductList: ICalculateOrderItem[] = filtredList.map((item) => {
            const { width, height, color, controlSide, fixation } = formatCharacteristicsString(item['old_characteristic']);

            return {
                product_code: item.product_code,
                subgroup_code: item.subgroup_code,
                group_code: item.group_code,
                width: width ? +width : 0,
                height: height ? +height : 0,
                side: controlSide ?
                    controlSide === "праворуч" ?
                        "right"
                        :
                        "left"
                    : 'right',
                units: "см",
                quantity: item.quantity,
                system_color: color ? color.trim() : "",
                fixation_type: fixation ? fixation.trim() : "",
                options: ""
            }
        });

        const requestParams: ICalculateOrderObject = {
            login: editOrderParams.login || "",
            place_order: true,
            items: responseProductList,
            comment: editOrderParams.order["комментарий"],
            adrType: editOrderParams.order["ВидАдресаВЗаказе"],
            delivery_adr: editOrderParams.order["адрес доставки"],
            product_type: parseGroupCode(currentOrder['вид заказа']),
            retailData: "",
            predopl: 0
        }

        const response = await calculateOrderPriceDayNight(requestParams);

        if (response === null) {
            setResponseResult(false);
            setTimeout(() => { setResponseResult(null) }, 3000);
        } else {
            setResponseResult(true);
            setTimeout(() => {
                setResponseResult(null);
                setIsOpen(false);
                updateAfterRestoreHandler();
            }, 2000);
        }
    }

    return (
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
                                    style={styles.titleWrap}
                                >
                                    <Text style={styles.titleBlue}>Відновлення замовлення</Text>
                                    <Text style={styles.titleSmall}>за потреби відредагуйте параметри наіменувань</Text>
                                </AnimatedWrapper>

                                {(responseResult === false) &&
                                    <ErrorMessage
                                        errorText="Помилка відновлення замовлення"
                                        styles={styles.notification}
                                    />}
                                {(responseResult === true) &&
                                    <SuccessMessage
                                        text="Замовлення відновленно"
                                        styles={styles.notification}
                                    />}


                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={styles.itemsScrollContent}
                                    style={styles.itemsScroll}
                                >
                                    {editItemsList.map((item, index) => {
                                        if (item.action === "delete") {
                                            return null;
                                        } else {
                                            return (
                                                <EditableItem
                                                    key={index}
                                                    item={item as IOrderItemToUpdate}
                                                    subgroupData={subgroupData}
                                                    onItemChange={(updatedItem) => {
                                                        setEditItemsList(prev =>
                                                            prev.map((it, i) => i === index ? updatedItem : it)
                                                        );
                                                    }}
                                                />
                                            )
                                        }
                                    })}
                                </ScrollView>

                                <Address
                                    address={address.address}
                                    currentAddressType={address.type}
                                    addressList={addressList}
                                    addressHandler={(type: string, address: string) => {
                                        setAddress({
                                            type: type,
                                            address: address
                                        });
                                    }}
                                />

                                <AnimatedWrapper
                                    useOpacity
                                    offsetY={20}
                                    delay={360}
                                >
                                    <Comment
                                        comment={currentOrder['комментарий']}
                                        commentHandler={(value: string) => {
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

                        <CloseButton
                            style={styles.closeButton}
                            closeHandler={() => { setIsOpen(false) }}
                        />
                        {isSubmitBtnHidden && <AnimatedWrapper
                            offsetY={20}
                            style={styles.submitButton}
                        >
                            <Pressable onPress={restoreResponseHandler}>
                                <ImageBackground
                                    source={require("../../../assets/gradient-small.png")}
                                    style={styles.submitButtonBg}
                                >
                                    <Text style={styles.submitButtonText}>Відновити</Text>
                                </ImageBackground>
                            </Pressable>
                        </AnimatedWrapper>}
                    </AnimatedWrapper>
                </AnimatedWrapper>
            </KeyboardAvoidingView>
        </Modal>
    )
}

export default RestoreForm;

const styles = StyleSheet.create({
    restoreDetailBtn: {
        width: 40,
        height: 40,
        backgroundColor: Colors.pale,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
    },
    restoreDetailIcon: {
        width: 18,
        height: 18,
        opacity: 0.3
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
        borderRadius: 20,
        width: '92%',
        maxHeight: '80%',
        minHeight: 300,
    },
    loaderWrap: {
        alignItems: 'center',
        paddingTop: 70
    },
    titleWrap: {
        flexDirection: 'column',
    },
    titleBlue: {
        fontSize: 18,
        fontFamily: Fonts.comfortaa700,
        textTransform: "uppercase",
        color: Colors.blue,
    },
    titleSmall: {
        marginTop: 5,
        fontSize: 14,
        lineHeight: 16,
        fontFamily: Fonts.comfortaa700,
        color: Colors.gray,
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
        borderColor: Colors.grayLight,
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
    },
});