import React from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Fonts } from '../../theme/fonts';
import AnimatedWrapper from '../animation/AnimatedWrapper';

const orders = [
    { number: '#242378', type: 'вертикальні штори', status: 'в обробці', price: 'xxxxx' },
    { number: '#246873', type: 'горизонтальні штори', status: 'попередній', price: 'xxxxx' },
    { number: '#247340', type: 'вертикальні штори', status: 'в обробці', price: 'xxxxx' },
    { number: '#242332', type: 'рулонні штори', status: 'у виробництві', price: 'xxxxxxxx' },
    { number: '#246873', type: 'горизонтальні штори', status: 'попередній', price: 'xxxxx' },
    { number: '#247340', type: 'вертикальні штори', status: 'в обробці', price: 'xxxxx' },
    { number: '#242378', type: 'вертикальні штори', status: 'в обробці', price: 'xxxxx' },
    { number: '#246873', type: 'горизонтальні штори', status: 'попередній', price: 'xxxxx' },
    { number: '#247340', type: 'вертикальні штори', status: 'в обробці', price: 'xxxxx' },
    { number: '#242332', type: 'рулонні штори', status: 'у виробництві', price: 'xxxxxxxx' },
    { number: '#246873', type: 'горизонтальні штори', status: 'попередній', price: 'xxxxx' },
    { number: '#247340', type: 'вертикальні штори', status: 'в обробці', price: 'xxxxx' },
    { number: '#242378', type: 'вертикальні штори', status: 'в обробці', price: 'xxxxx' },
    { number: '#246873', type: 'горизонтальні штори', status: 'попередній', price: 'xxxxx' },
    { number: '#247340', type: 'вертикальні штори', status: 'в обробці', price: 'xxxxx' },
    { number: '#242332', type: 'рулонні штори', status: 'у виробництві', price: 'xxxxxxxx' },
    { number: '#246873', type: 'горизонтальні штори', status: 'попередній', price: 'xxxxx' },
    { number: '#247340', type: 'вертикальні штори', status: 'в обробці', price: 'xxxxx' },
];

const getStatusStyle = (status: string) => {
    switch (status) {
        case 'в обробці':
            return styles.statusYellow;
        case 'попередній':
            return styles.statusBlue;
        case 'у виробництві':
            return styles.statusGreen;
        default:
            return styles.statusDefault;
    }
};

export default function TableOrders() {
    return (
        <AnimatedWrapper
            style={styles.ordersTable}
            useOpacity
            offsetX={50}
            duration={300}
            delay={300}
        >
            <ScrollView
                style={styles.scrollVertical}
                nestedScrollEnabled

            >
                <ScrollView horizontal>
                    <View style={styles.container}>
                        {/* titles */}
                        <View style={styles.row}>
                            <Text style={[styles.cellTitle, styles.column1, styles.cellTitleFontSize]}>№</Text>
                            <Text style={[styles.cellTitle, styles.column2]}>вид{'\n'}замовлення</Text>
                            <Text style={[styles.cellTitle, styles.column3, styles.cellTitleNoPadding]}>статус</Text>
                            <Text style={[styles.cellTitle, styles.column4]}>сума</Text>
                            <Text style={[styles.cellTitle, styles.column5]}>інше</Text>
                        </View>

                        {/* orders data */}
                        {orders.map((order, index) => (
                            <View key={index} style={styles.row}>
                                <Text style={[styles.cell, styles.column1, styles.link]}>{order.number}</Text>
                                <Text style={[styles.cell, styles.column2]}>{order.type}</Text>
                                <Text style={[styles.cell, styles.column3, getStatusStyle(order.status)]}>{order.status}</Text>
                                <Text style={[styles.cell, styles.column4]}>{order.price}</Text>
                                <View style={[styles.column5, styles.iconsContainer]}>
                                    <Pressable style={styles.iconEditBtn}>
                                        <Image source={require('../../assets/orders-screen/edit-icon.png')} style={styles.iconImage} />
                                    </Pressable>
                                    <Pressable style={styles.iconDeleteBtn}>
                                        <Image source={require('../../assets/orders-screen/delete-icon.png')} style={styles.iconImage} />
                                    </Pressable>
                                    <Pressable style={styles.iconOptionsBtn}>
                                        <Image source={require('../../assets/orders-screen/options-icon.png')} style={styles.iconImage} />
                                    </Pressable>
                                </View>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </ScrollView>
        </AnimatedWrapper>
    );
}

const COLUMN_WIDTH = {
    col1: 60,
    col2: 115,
    col3: 116,
    col4: 60,
    col5: 60,
};

const styles = StyleSheet.create({
    ordersTable: {
        marginVertical: 20,
        backgroundColor: 'white',
        borderRadius: 13,
        flexGrow: 1,
        overflow: 'hidden'
    },
    scrollVertical: {
        height: '50%',
    },
    container: {
        position: 'relative',
        padding: 15,
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#D9D9D9',
    },
    cellTitle: {
        fontFamily: Fonts.comfortaa700,
        fontSize: 12,
        lineHeight: 12,
        color: '#A2A2A8',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 9,
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    cellTitleFontSize: {
        fontSize: 14,
    },
    cellTitleNoPadding: {
        paddingVertical: 0,
    },
    cell: {
        fontFamily: Fonts.comfortaa700,
        fontSize: 12,
        lineHeight: 12,
        textAlignVertical: 'center',
    },
    column1: {
        width: COLUMN_WIDTH.col1,
    },
    column2: {
        width: COLUMN_WIDTH.col2,
    },
    column3: {
        width: COLUMN_WIDTH.col3,
        borderRadius: 6,
        textAlign: 'center',
        paddingVertical: 23,
        marginVertical: 3,
    },
    column4: {
        width: COLUMN_WIDTH.col4,
        textAlign: 'center',
        marginHorizontal: 10,
    },
    column5: {
        width: COLUMN_WIDTH.col5,
        textAlign: 'center',
    },
    link: {
        color: '#337ef7',
        fontFamily: Fonts.openSans400,
        textAlignVertical: 'center',
    },
    statusYellow: {
        backgroundColor: '#FFEE6D',
    },
    statusBlue: {
        backgroundColor: '#62BDEA',
    },
    statusGreen: {
        backgroundColor: '#AFFFA5',
    },
    statusDefault: {
        backgroundColor: '#ffffff',
    },
    iconsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
    },
    iconEditBtn: {
        width: 12,
        height: 12,
    },
    iconDeleteBtn: {
        width: 11,
        height: 13,
    },
    iconOptionsBtn: {
        width: 3,
        height: 11,
    },
    iconImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
});
