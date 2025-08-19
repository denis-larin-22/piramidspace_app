import React, { useRef, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Fonts } from '../../theme/fonts';
import AnimatedWrapper from '../animation/AnimatedWrapper';
import { IOrder } from '../../lib/api/orders';
import OrderItem from './OrderItem';
import { Colors } from '../../theme/colors';
import Loader from '../ui/Loader';


export default function TableOrders({
    isLoading,
    ordersList,
    activePage,
    setActivePage,
    totalPages,
}: {
    isLoading: boolean,
    ordersList: Array<IOrder>,
    activePage: number,
    setActivePage: (page: number) => void,
    totalPages: number | undefined,
}) {
    const [activeOrderId, setActiveOrderId] = useState<number | null>(null);

    const scrollRef = useRef<ScrollView>(null);

    const paginationHandler = (page: number) => {
        setActiveOrderId(null);
        setActivePage(page);
    }

    return (
        <AnimatedWrapper
            style={tableStyles.ordersTable}
            useOpacity
            offsetX={50}
            duration={150}
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
                {isLoading ?
                    <LoadingView />
                    :
                    ordersList.map((order) => (
                        <OrderItem
                            key={order['N_заказа']}
                            order={order}
                            activeOrderId={activeOrderId}
                            setActiveOrderId={setActiveOrderId}
                        />
                    ))
                }
            </ScrollView >

            {/* Pagination */}
            <Pagination
                currentPage={activePage}
                totalPages={totalPages}
                onPageChange={paginationHandler}
            />
        </AnimatedWrapper >
    );
}


type PaginationProps = {
    currentPage: number;
    totalPages?: number;
    onPageChange: (page: number) => void;
};

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
    if (!totalPages || totalPages <= 1) return null;

    const safeCurrentPage = Math.max(currentPage || 1, 1);

    const getPages = (): (number | 'dots')[] => {
        const windowSize = 5;
        const half = Math.floor(windowSize / 2);
        const pages: (number | 'dots')[] = [];

        let start = Math.max(safeCurrentPage - half, 1);
        let end = Math.min(safeCurrentPage + half, totalPages);

        if (safeCurrentPage <= half) end = Math.min(windowSize, totalPages);
        if (safeCurrentPage + half > totalPages) start = Math.max(totalPages - windowSize + 1, 1);

        if (start > 1) {
            pages.push(1);
            if (start > 2) pages.push('dots');
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (end < totalPages) {
            if (end < totalPages - 1) pages.push('dots');
            pages.push(totalPages);
        }

        return pages;
    };

    const pages = getPages();

    return (
        <AnimatedWrapper useOpacity offsetY={10} style={paginationStyles.container}>
            {/* Левая стрелка */}
            <Pressable
                onPress={() => onPageChange(Math.max(safeCurrentPage - 1, 1))}
                disabled={safeCurrentPage === 1}
                style={({ pressed }) => [
                    paginationStyles.pageButton,
                    safeCurrentPage === 1 && paginationStyles.disabled,
                    pressed && paginationStyles.pressed,
                ]}
            >
                <Image source={require('../../assets/orders-screen/arrow.webp')} style={paginationStyles.arrowLeft} />
            </Pressable>

            {/* Номера страниц */}
            <View style={paginationStyles.numbersWrap}>
                {pages.map((page, index) =>
                    page === 'dots' ? (
                        <Text key={`dots-${index}`} style={[paginationStyles.pageText, paginationStyles.dots]}>
                            ...
                        </Text>
                    ) : (
                        <Pressable
                            key={page}
                            onPress={() => onPageChange(page)}
                            style={({ pressed }) => [
                                paginationStyles.pageButton,
                                pressed && paginationStyles.pressed,
                                page === safeCurrentPage ? paginationStyles.activePage : paginationStyles.notActivePage,
                            ]}
                        >
                            <Text
                                style={[
                                    paginationStyles.pageText,
                                    page === safeCurrentPage
                                        ? paginationStyles.activeText
                                        : paginationStyles.notActiveText,
                                ]}
                            >
                                {page}
                            </Text>
                        </Pressable>
                    )
                )}
            </View>

            {/* Правая стрелка */}
            <Pressable
                onPress={() => onPageChange(Math.min(safeCurrentPage + 1, totalPages))}
                disabled={safeCurrentPage === totalPages}
                style={({ pressed }) => [
                    paginationStyles.pageButton,
                    safeCurrentPage === totalPages && paginationStyles.disabled,
                    pressed && paginationStyles.pressed,
                ]}
            >
                <Image source={require('../../assets/orders-screen/arrow.webp')} style={paginationStyles.arrowRight} />
            </Pressable>
        </AnimatedWrapper>
    );
};


function LoadingView() {
    return (
        <AnimatedWrapper
            useOpacity
            offsetX={100}
            style={tableStyles.loadingWrap}>
            <AnimatedWrapper
                delay={1000}
                style={tableStyles.loadiingBlock}>
                <Loader radius={100} />
            </AnimatedWrapper>
        </AnimatedWrapper>
    )
}

const COLUMN_WIDTH = {
    col1: 50,
    col2: 120,
    col3: 100,
    col4: 60,
    col5: 60,
};

const paginationStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderRadius: 16,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: 5,
        borderWidth: 1,
        borderColor: Colors.grayLight
    },
    numbersWrap: {
        flexDirection: 'row',
        gap: 7
    },
    pageButton: {
        borderRadius: 50,
        backgroundColor: 'transparent',
        width: 28,
        height: 28
    },
    pressed: {
        opacity: 0.6,
    },
    disabled: {
        opacity: 0.3,
    },
    activePage: {
        backgroundColor: Colors.blue,
    },
    notActivePage: {
        backgroundColor: 'transparent',
    },
    pageText: {
        fontSize: 13,
        lineHeight: 27,
        textAlign: 'center',
        verticalAlign: 'middle',
        borderRadius: 50
    },
    dots: {
        opacity: 0.2,
        fontWeight: 600
    },
    activeText: {
        color: 'white',
        fontWeight: 'bold',
    },
    notActiveText: {
        color: Colors.gray,
        fontWeight: '400',
    },
    arrowButton: {
        fontSize: 20,
        color: Colors.blue
    },
    arrowRight: {
        width: 10,
        height: 20,
        top: 5
    },
    arrowLeft: {
        width: 10,
        height: 20,
        top: 5,
        left: 15,
        transform: [{ rotate: '180deg' }],
    }
});


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
        borderBottomWidth: 2,
        borderColor: Colors.grayLight,
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
    loadingWrap: {
        width: '100%', height: '1200%',
        backgroundColor: Colors.pale,
        opacity: 0.3,
        borderLeftWidth: 20,
        borderColor: Colors.pale
    },
    loadiingBlock: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        paddingTop: 160
    }
});
