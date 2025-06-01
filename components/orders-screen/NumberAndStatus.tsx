import { FlatList, StyleSheet, Text, View } from "react-native";
import { Fonts } from "../../theme/fonts";
import { IStatusColors } from "../../screens/OrdersScreen";
import { Colors } from "../../theme/colors";
import AnimatedWrapper from "../animation/AnimatedWrapper";

function NumberAndStatus({ statusColorsObjects }: { statusColorsObjects: Array<IStatusColors> }) {
    return (
        <View style={styles.wrapper}>
            <AnimatedWrapper
                useOpacity
                offsetX={50}
                duration={300}
                delay={100}
            >
                <Text style={styles.numberBox}>№</Text>
            </AnimatedWrapper>

            <AnimatedWrapper
                useOpacity
                offsetX={50}
                duration={300}
                delay={200}
                style={styles.statusBox}
            >
                <Text style={styles.statusText}>Статус</Text>
                <FlatList
                    data={statusColorsObjects}
                    renderItem={({ item }) => <Item color={item.color} />}
                    keyExtractor={(item) => item.color}
                    horizontal
                    style={styles.flatList}
                />
            </AnimatedWrapper>
        </View >
    );
}

export default NumberAndStatus;

function Item({ color }: { color: string }) {
    return <View style={[styles.flatItem, {
        backgroundColor: color,
        borderColor: color === "#FFFFFF" ? Colors.gray : color,
    }]}></View>
}

const styles = StyleSheet.create({
    wrapper: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    numberBox: {
        fontFamily: Fonts.comfortaa700,
        fontSize: 14,
        paddingVertical: 7,
        paddingHorizontal: 12,
        backgroundColor: 'white',
        minWidth: '25%',
        borderRadius: 32,
    },
    statusBox: {
        width: '70%',
        paddingVertical: 7,
        paddingHorizontal: 12,
        backgroundColor: 'white',
        borderRadius: 32,
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusText: {
        fontFamily: Fonts.comfortaa700,
        fontSize: 14,
        lineHeight: 17,
    },
    flatList: {
        marginLeft: 10,
    },
    flatItem: {
        width: 16,
        height: 16,
        borderWidth: 1,
        borderRadius: 50,
        marginLeft: 2,
    }
});
