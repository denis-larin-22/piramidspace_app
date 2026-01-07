import { Dimensions, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { ISubgroup } from "../../../lib/api/orders-screen/groups-and-products";
import { Fonts } from "../../../theme/fonts";
import { Colors } from "../../../theme/colors";
import { useState } from "react";
import { IOrderItemToDelete, IOrderItemToUpdate } from "../../../lib/api/orders-screen/edit-order";
import AnimatedWrapper from "../../animation/AnimatedWrapper";
import EditItemForm from "./EditItemForm";

function EditableItem({
    item,
    subgroupData,
    onItemChange,
}: {
    item: IOrderItemToUpdate | IOrderItemToDelete;
    subgroupData: ISubgroup;
    onItemChange: (updatedItem: IOrderItemToUpdate | IOrderItemToDelete) => void;
}) {
    // item to edit
    const [editableItem, setEditableItem] = useState<IOrderItemToUpdate | IOrderItemToDelete>(item);
    // delete btn 
    const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);

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

    function editHandler(updatedItem: IOrderItemToUpdate) {
        setEditableItem(updatedItem);
        onItemChange(updatedItem)
    }

    function deleteHandler() {
        const objToDelete: IOrderItemToDelete = {
            action: 'delete',
            old_characteristic: item.old_characteristic,
            old_name: item.old_name
        };
        onItemChange(objToDelete);
    }

    return (
        <View style={styles.wrap}>
            {/* info */}
            <OrderItem
                item={currentItem}
            />

            <DeleteItemButton
                isOpen={isDeleteOpen}
                setIsOpen={setIsDeleteOpen}
                deleteHandler={deleteHandler}
            />

            {/* edit form */}
            <EditItemForm
                itemToEdit={currentItem}
                editHandler={editHandler}
                subgroupData={subgroupData}
            />
        </View>
    );
}

export default EditableItem;


// UI
function OrderItem({ item }: { item: IOrderItemToUpdate }) {
    return (
        <View style={[styles.itemCard, styles.shadow]}>
            <Text style={styles.itemTitle} numberOfLines={2}>
                {item.product_code || 'Без назви'}
            </Text>

            <Detail label="Кількість:" value={item.quantity} borderBottom />
            <Detail label="Ширина:" value={item.width + " см"} />
            <Detail label="Висота:" value={item.height + " см"} borderBottom />
            <Detail label="Керування:" value={(item.side === "right" || item.side === "R") ? "праворуч" : "ліворуч"} />
            <Detail label="Колір:" value={item.system_color} />
            <Detail label="Фіксація:" value={item.fixation_type} />
        </View>
    )
};

function Detail({ label, value, borderBottom = false }: { label: string, value: string | number | null, borderBottom?: boolean }) {
    return (
        <View style={[styles.detailRow, borderBottom && styles.bordeBottom]}>
            <Text style={styles.detailLabel}>{label}</Text>
            <Text style={styles.detailValue}>{value ? value : '—'}</Text>
        </View>
    );
}

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
                        onPress={() => {
                            deleteHandler();
                            setIsOpen(false);
                        }}
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
        position: 'relative',
        marginBottom: 40
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
        bottom: -40,
        right: 5,
        width: 30,
        height: 30,
        backgroundColor: "white",
        borderRadius: 50,
        padding: 5,
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

    itemCard: {
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 12,
        width: 250,
        minHeight: 200,
        maxWidth: Dimensions.get('window').width - 60,
        overflow: 'hidden',
    },
    itemTitle: {
        fontFamily: Fonts.comfortaa600,
        fontSize: 14,
        lineHeight: 16,
        color: 'white',
        backgroundColor: Colors.blue,
        paddingVertical: 7,
        paddingHorizontal: 9,
        marginBottom: 4,
        top: -12,
        left: -12,
        width: '115%',
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 7,
        marginBottom: 4,
    },
    detailLabel: {
        fontFamily: Fonts.comfortaa400,
        fontSize: 14,
        lineHeight: 17,
        color: Colors.gray,
    },
    detailValue: {
        fontFamily: Fonts.comfortaa600,
        fontSize: 14,
        lineHeight: 16,
        color: 'black',
        maxWidth: '60%',
    },
    bordeBottom: {
        borderBottomWidth: 2,
        borderColor: Colors.grayLight,
        paddingBottom: 5,
        marginBottom: 5,
    },
});