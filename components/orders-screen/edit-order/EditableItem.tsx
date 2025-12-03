import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { ISubgroup } from "../../../lib/api/orders-screen/groups-and-products";
import WidthAndHeight from "./WidthAndHeight";
import Color from "./Colors";
import ControlType from "./ControlType";
import Count from "./Count";
import { Fonts } from "../../../theme/fonts";
import { Colors } from "../../../theme/colors";
import { useEffect, useState } from "react";
import FixationType from "./FixationType";
import { IOrderItemToDelete, IOrderItemToUpdate } from "../../../lib/api/orders-screen/edit-order";
import AnimatedWrapper from "../../animation/AnimatedWrapper";
import { IUserInfo, UnitsTypes } from "../../../lib/api/auth";
import { getDataFromAcyncStorage } from "../../../lib/async-storage/acyncStorage";
import { ASYNC_STORAGE_USER_INFO_OBJECT } from "../../../lib/async-storage/asyncStorageKeys";

function EditableItem({
    item,
    subgroupData,
    index,
    onItemChange,
}: {
    item: IOrderItemToUpdate | IOrderItemToDelete;
    subgroupData: ISubgroup;
    index: number;
    onItemChange: (updatedItem: IOrderItemToUpdate | IOrderItemToDelete) => void;
}) {
    const [editableItem, setEditableItem] = useState<IOrderItemToUpdate | IOrderItemToDelete>(item);
    const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
    const [unit, setUnit] = useState<UnitsTypes | null>(null);

    useEffect(() => {
        setEditableItem(item);

        async function getUnits() {
            const userInfo = await getDataFromAcyncStorage(ASYNC_STORAGE_USER_INFO_OBJECT);
            const { "логин": login, units } = JSON.parse(userInfo) as IUserInfo;
            setUnit(units); // save main unit
        }

        getUnits()
    }, [item]);

    // Определяем удалена ли позиция
    const markedAsDelete = "action" in editableItem && editableItem.action === "delete";

    // ========================================= //
    // DELETE MARK MODE
    // Если удалена
    if (markedAsDelete) {
        return null;
    }

    // ========================================= //
    // UPDATE MARK MODE
    // ВНИМАНИЕ: ТОЛЬКО ЗДЕСЬ мы уверены, что это IOrderItemToUpdate
    const currentItem = editableItem as IOrderItemToUpdate;

    const targetProduct = subgroupData.tkani.find(
        (tkan) => tkan.short_name === currentItem.product_code
    );
    const controlList = subgroupData.control.map((item) =>
        item === "L" ? "ліворуч" : "праворуч"
    );
    const colorList = Object.keys(subgroupData.colors);
    const fixationList = subgroupData.fixations.map((type) => type.name);

    const updateAndNotify = (updates: Partial<IOrderItemToUpdate>) => {
        const updated = { ...currentItem, ...updates };
        setEditableItem(updated);
        onItemChange(updated);
    };

    return (
        <View style={styles.wrap}>
            {/* blackout bcg when delete is open */}
            {isDeleteOpen && <View style={styles.overlay}></View>}

            <View style={styles.header}>
                <Text style={styles.indexBadge}>{index + 1}</Text>
                <Text style={styles.productCode}>{currentItem.product_code}</Text>

                <DeleteItemButton
                    isOpen={isDeleteOpen}
                    setIsOpen={setIsDeleteOpen}
                    deleteHandler={() => {
                        const markedToDelete = {
                            action: 'delete',
                            old_characteristic: currentItem.old_characteristic,
                            old_name: currentItem.old_name
                        } as IOrderItemToDelete;
                        setEditableItem(markedToDelete)
                        onItemChange(markedToDelete);
                    }}
                />
            </View>

            <WidthAndHeight
                unit={unit}

                width={currentItem.width}
                maxWidth={targetProduct.max_width}
                widthHandler={(value) => updateAndNotify({ width: value })}

                height={currentItem.height}
                maxHeight={targetProduct.max_height}
                heightHandler={(value) => updateAndNotify({ height: value })}
            />

            <Count
                count={Number(currentItem.quantity).toFixed(0)}
                countHandler={(value) => updateAndNotify({ quantity: value })}
            />

            <Color
                сolor={currentItem.system_color}
                colorList={colorList}
                colorHandler={(color) => updateAndNotify({ system_color: color })}
            />

            <ControlType
                control={currentItem.side}
                controlTypesList={controlList}
                controlHandler={(side) => updateAndNotify({ side: side })}
            />

            <FixationType
                fixation={currentItem.fixation_type}
                fixationList={fixationList}
                fixationHandler={(fixation) => updateAndNotify({ fixation_type: fixation })}
            />
        </View>
    );
}

export default EditableItem;

// UI
function DeleteItemButton({
    isOpen,
    setIsOpen,
    deleteHandler
}: {
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    deleteHandler: () => void
}) {
    return (
        <>
            <Pressable
                style={styles.deleteButton}
                onPress={() => { setIsOpen(!isOpen) }}
            >
                <Image
                    source={require('../../../assets/orders-screen/delete.webp')}
                    style={styles.deleteIcon}
                />
            </Pressable>

            {isOpen && <AnimatedWrapper
                useOpacity
                offsetY={100}
                duration={200}
                style={styles.deleteWrap}
            >
                <Image
                    source={require("../../../assets/orders-screen/warning.png")}
                    style={styles.warningIcon}
                    resizeMode="contain"
                />
                <Text style={styles.modalTitle}>Видалити найменування?</Text>

                <View style={styles.confirmButtons}>
                    <Pressable
                        style={styles.deleteConfirmButton}
                        onPress={deleteHandler}
                    >
                        <Text style={styles.deleteConfirmButtonText}>Так</Text>
                    </Pressable>
                    <Pressable
                        style={styles.cancelButton}
                        onPress={() => setIsOpen(false)}
                    >
                        <Text style={styles.cancelButtonText}>Ні</Text>
                    </Pressable>
                </View>
            </AnimatedWrapper>}
        </>
    )
}

const styles = StyleSheet.create({
    wrap: {
        width: 250,
        minHeight: 350,
        backgroundColor: "white",
        marginBottom: 110,
        position: "relative",
        zIndex: 50,
        padding: 7,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    overlay: {
        backgroundColor: '#00000020',
        width: '106%',
        height: '104%',
        borderRadius: 16,
        position: 'absolute',
        top: '0%',
        zIndex: 50
    },
    header: {
        flexDirection: "row",
        gap: 5,
        alignItems: "center",
        marginBottom: 5,
        paddingBottom: 5,
        borderBottomWidth: 1,
        borderColor: Colors.grayLight,
    },
    indexBadge: {
        width: 20,
        height: 20,
        backgroundColor: Colors.blue,
        textAlign: "center",
        lineHeight: 17,
        borderRadius: 50,
        color: "white",
        fontFamily: Fonts.openSans400,
        fontSize: 14,
    },
    productCode: {
        fontFamily: Fonts.openSans400,
        fontSize: 15,
        lineHeight: 17,
        color: "black",
        maxWidth: 180,
    },
    deleteButton: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 25,
        height: 25,
        backgroundColor: Colors.pale,
        borderRadius: 50,
        padding: 3
    },
    deleteIcon: {
        width: '100%',
        height: '100%',
        opacity: 0.3,
    },
    deleteWrap: {
        backgroundColor: Colors.pale,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 13,
        width: '100%',
        position: 'absolute',
        zIndex: 100,
        top: 50,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    warningIcon: {
        width: 30,
        height: 30,
        marginBottom: 10
    },
    modalTitle: {
        fontFamily: Fonts.comfortaa600,
        fontSize: 14,
        color: 'black',
        marginBottom: 10
    },
    confirmButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10
    },
    cancelButton: {
        padding: 5,
        borderWidth: 1,
        borderColor: Colors.blue,
        borderRadius: 14,
        width: 60,
    },
    cancelButtonText: {
        fontFamily: Fonts.openSans400,
        color: Colors.blue,
        textAlign: 'center',
        fontSize: 14,
    },
    deleteConfirmButton: {
        padding: 5,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#A2A2A870',
        width: 60,
    },
    deleteConfirmButtonText: {
        fontFamily: Fonts.openSans400,
        fontSize: 14,
        color: Colors.gray,
        textAlign: 'center',
    },
});