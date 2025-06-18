import React, { useMemo, useRef, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable } from 'react-native';
import { Fonts } from '../../theme/fonts';
import AnimatedWrapper from '../animation/AnimatedWrapper';
import { IOrder } from '../../lib/api/orders';
import OrderItem from './OrderItem';

const ITEMS_PER_PAGE = 30;

export default function TableOrders({ ordersList }: { ordersList: Array<IOrder> }) {
    const scrollRef = useRef<ScrollView>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(ordersList.length / ITEMS_PER_PAGE);

    const paginatedOrders = useMemo(() => {
        if (ordersList.length < ITEMS_PER_PAGE) return ordersList;
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        return ordersList.slice(start, end);
    }, [ordersList, currentPage]);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        scrollRef.current?.scrollTo({ y: 0, animated: true });
    };

    return (
        <AnimatedWrapper
            style={tableStyles.ordersTable}
            useOpacity
            offsetX={50}
            duration={300}
            delay={300}
        >
            <ScrollView
                style={tableStyles.scrollVertical}
                ref={scrollRef}
                nestedScrollEnabled
            >
                {/* Header */}
                <View style={tableStyles.row}>
                    <Text style={[tableStyles.cellTitle, tableStyles.column1, tableStyles.cellTitleFontSize]}>№</Text>
                    <Text style={[tableStyles.cellTitle, tableStyles.column2]}>вид{'\n'}замовлення</Text>
                    <Text style={[tableStyles.cellTitle, tableStyles.column3, tableStyles.cellTitleNoPadding]}>статус</Text>
                    <Text style={[tableStyles.cellTitle, tableStyles.column4]}>сума</Text>
                </View>

                {/* Rows */}
                {paginatedOrders.map((order, index) => (
                    <OrderItem key={index} order={order} index={index} />
                ))}
            </ScrollView>

            {/* Pagination */}
            {ordersList.length > ITEMS_PER_PAGE && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}
        </AnimatedWrapper>
    );
}

function Pagination({
    currentPage,
    totalPages,
    onPageChange,
}: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}) {
    return (
        <View style={tableStyles.pagination}>
            <Pressable
                onPress={() => onPageChange(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                style={({ pressed }) => [
                    tableStyles.pageButton,
                    currentPage === 1 && tableStyles.disabled,
                    pressed && tableStyles.pressed
                ]}
            >
                <Text style={tableStyles.pageText}>{'<'}</Text>
            </Pressable>
            <Text style={tableStyles.pageInfo}>
                {currentPage} / {totalPages}
            </Text>
            <Pressable
                onPress={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
                style={({ pressed }) => [
                    tableStyles.pageButton,
                    currentPage === totalPages && tableStyles.disabled,
                    pressed && tableStyles.pressed
                ]}
            >
                <Text style={tableStyles.pageText}>{'>'}</Text>
            </Pressable>
        </View>
    );
}

const COLUMN_WIDTH = {
    col1: 50,
    col2: 120,
    col3: 100,
    col4: 60,
    col5: 60,
};

export const tableStyles = StyleSheet.create({
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
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#D9D9D9',
        padding: 10
    },
    cellTitle: {
        fontFamily: Fonts.comfortaa700,
        fontSize: 12,
        lineHeight: 12,
        color: '#A2A2A8',
        textAlign: 'center',
        verticalAlign: 'middle',
    },
    cellTitleFontSize: {
        fontSize: 12,
        verticalAlign: 'middle'
    },
    cellTitleNoPadding: {
        paddingVertical: 0,
    },
    column1: {
        width: COLUMN_WIDTH.col1,
    },
    column2: {
        width: COLUMN_WIDTH.col2,
        textAlign: 'center',
        marginHorizontal: 5
    },
    column3: {
        width: COLUMN_WIDTH.col3,
        borderRadius: 6,
        textAlign: 'center',
        paddingVertical: 20,
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
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        gap: 20,
    },
    pageButton: {
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#337ef7',
        borderRadius: 50,
    },
    pageText: {
        color: 'white',
        fontWeight: 'bold',
    },
    pageInfo: {
        fontSize: 14,
        color: '#333',
    },
    disabled: {
        backgroundColor: '#ccc',
    },
    pressed: {
        opacity: 0.7,
    },
});
