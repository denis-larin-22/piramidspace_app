import { StyleSheet, Text, View } from "react-native";
import { ISubgroup } from "../../../lib/api/orders-screen/groups-and-products";
import WidthAndHeight from "./WidthAndHeight";
import Color from "./Colors";
import ControlType from "./ControlType";
import Count from "./Count";
import { Fonts } from "../../../theme/fonts";
import { Colors } from "../../../theme/colors";
import { useState } from "react";
import FixationType from "./FixationType";
import { IOrderItemToAdd, IOrderItemToDelete, IOrderItemToUpdate } from "../../../lib/api/orders-screen/edit-order";
import AnimatedWrapper from "../../animation/AnimatedWrapper";

function EditableItem({
    item,
    subgroupData,
    index,
    onItemChange,
}: {
    item: IOrderItemToUpdate,
    subgroupData: ISubgroup,
    index: number,
    onItemChange: (updatedItem: IOrderItemToUpdate) => void,
}) {
    // init editeble objact by current orderItem (update mode by default)
    const [editableItem, setEditableItem] = useState<IOrderItemToUpdate>(item);

    // lists
    const targetProduct = subgroupData.tkani.find(
        (tkan) => tkan.short_name === item.product_code
    );
    const controlList = subgroupData.control.map((item) =>
        item === "L" ? "ліворуч" : "праворуч"
    );
    const colorList = Object.keys(subgroupData.colors);
    const fixationList = subgroupData.fixations.map((type) => type.name);


    const updateAndNotify = (updates: Partial<IOrderItemToUpdate>) => {
        const updated = { ...editableItem, ...updates };
        setEditableItem(updated);
        onItemChange(updated);  // ← поднимаем актуальный объект вверх
    };

    return (
        <View style={styles.wrap}>
            <View style={styles.header}>
                <Text style={styles.indexBadge}>{index + 1}</Text>
                <Text style={styles.productCode}>{item.product_code}</Text>
            </View>

            <AnimatedWrapper
                useOpacity
                offsetY={20}
                delay={240}
            >

                <WidthAndHeight
                    width={editableItem.width}
                    maxWidth={targetProduct.max_width}
                    widthHandler={(value) => updateAndNotify({ width: value })}

                    height={editableItem.height}
                    maxHeight={targetProduct.max_height}
                    heightHandler={(value) => updateAndNotify({ height: value })}
                />
            </AnimatedWrapper>

            <AnimatedWrapper
                useOpacity
                offsetY={20}
                delay={260}
            >
                <Count
                    count={Number(editableItem.quantity).toFixed(0)}
                    countHandler={(value) => updateAndNotify({ quantity: value })}
                />
            </AnimatedWrapper>

            <AnimatedWrapper
                useOpacity
                offsetY={20}
                delay={280}
            >
                <Color
                    сolor={editableItem.system_color}
                    colorList={colorList}
                    colorHandler={(color) => updateAndNotify({ system_color: color })}
                />
            </AnimatedWrapper>

            <AnimatedWrapper
                useOpacity
                offsetY={20}
                delay={300}
            >
                <ControlType
                    control={editableItem.side}
                    controlTypesList={controlList}
                    controlHandler={(side) => updateAndNotify({ side: side })}
                />
            </AnimatedWrapper>

            <AnimatedWrapper
                useOpacity
                offsetY={20}
                delay={320}
            >
                <FixationType
                    fixation={editableItem.fixation_type}
                    fixationList={fixationList}
                    fixationHandler={(fixation) => updateAndNotify({ fixation_type: fixation })}
                />
            </AnimatedWrapper>
        </View>
    );
}

export default EditableItem;

const styles = StyleSheet.create({
    wrap: {
        width: 250,
        height: 350,
        backgroundColor: "white",
        marginBottom: 110,
        position: "relative",
        zIndex: 50,
        padding: 7,
        borderRadius: 16,
        // iOS shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        // Android shadow
        elevation: 5,
    },
    header: {
        flexDirection: "row",
        gap: 5,
        alignItems: "center",
        marginBottom: 10,
        paddingBottom: 10,
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
    },
});