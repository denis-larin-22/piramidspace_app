import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { MainGroupsCode } from "../../../lib/api/orders-screen/groups-and-products";
import AnimatedWrapper from "../../animation/AnimatedWrapper";
import { Colors } from "../../../theme/colors";
import { Fonts } from "../../../theme/fonts";
import { INewOrderObject, useCreateOrder } from "../NewOrderProvider";

interface IMainGroupIcons {
    code: MainGroupsCode,
    name: string,
    icon: any,
}

export const mainGroupsIcons: IMainGroupIcons[] = [
    { code: "horizontal", name: 'Горизонтальні', icon: require('../../../assets/orders-screen/horisontal.png') },
    { code: "vertical", name: 'Вертикальні', icon: require('../../../assets/orders-screen/vertical.png') },
    { code: "day", name: 'День-Ніч', icon: require('../../../assets/orders-screen/day-night.png') },
    { code: "roller", name: 'Рулонні', icon: require('../../../assets/orders-screen/roller.png') },
    { code: "components", name: 'Комплектуючі', icon: require('../../../assets/orders-screen/components.png') },
    { code: "ads", name: 'Рекламна продукція', icon: require('../../../assets/orders-screen/promotional-items.png') },
];

function FirstStep({ stepHandler }: { stepHandler: () => void }) {
    const { orderParams, setOrderParams } = useCreateOrder();

    const selectHandler = (selectedGroup: { name: string, code: MainGroupsCode }) => {
        const updatedOrder: INewOrderObject = {
            ...orderParams.newOrderObject,
            id: orderParams.newOrderObject.id || generateId(),
            group: {
                code: selectedGroup.code,
                name: selectedGroup.name
            }
        };

        setOrderParams({
            ...orderParams,
            activeGroup: selectedGroup.code,
            newOrderObject: updatedOrder
        });
        stepHandler();
    };

    return (
        <>
            <AnimatedWrapper
                offsetY={20}
                useOpacity
                delay={200}
            >
                <Text style={{
                    fontFamily: Fonts.comfortaa700,
                    fontSize: 20,
                    textTransform: 'uppercase',
                    marginBottom: 15,
                    textAlign: 'center'
                }}>Оформлення <Text style={{ color: Colors.blue }}>Замовлення</Text></Text>
            </AnimatedWrapper>

            {mainGroupsIcons.map((group, index) => (
                <AnimatedWrapper
                    key={group.code}
                    useOpacity
                    offsetY={20}
                    delay={250 + (index * 60)}
                >
                    <Pressable
                        style={styles.categoryButton}
                        onPress={() => {
                            selectHandler({ code: group.code, name: group.name });
                        }}
                    >
                        <Image
                            source={group.icon}
                            style={styles.categoryIcon}
                        />
                        <Text style={styles.categoryText}>
                            {group.name}
                        </Text>
                    </Pressable>
                </AnimatedWrapper >
            ))
            }
        </>
    );
}

export default FirstStep;

export function generateId(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
}


const styles = StyleSheet.create({
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
        borderColor: Colors.blueLight,
    },
    categoryIcon: {
        width: 21,
        height: 21,
        backgroundColor: Colors.pale,
    },
    categoryText: {
        fontFamily: Fonts.comfortaa400,
        fontSize: 15,
        lineHeight: 17,
        color: 'black',
    },
});