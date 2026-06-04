import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { MainGroupsCode } from "../../../lib/api/orders-screen/groups-and-products";
import AnimatedWrapper from "../../animation/AnimatedWrapper";
import { Colors } from "../../../theme/colors";
import { Fonts } from "../../../theme/fonts";
import { INewOrderObject, useCreateOrder } from "../NewOrderProvider";
import RetailOrderButton from "./fourth-step/RetailOrderButton";

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

function FirstStep({ stepHandler }: { stepHandler: (selectedGroup: MainGroupsCode) => void }) {
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

        stepHandler(selectedGroup.code);
    };

    return (
        <>
            <AnimatedWrapper
                offsetY={20}
                useOpacity
                delay={200}
                style={{
                    borderBottomWidth: 2,
                    borderColor: Colors.grayLight,
                    paddingBottom: 5,
                    marginBottom: 5
                }}
            >
                <Text style={{
                    fontFamily: Fonts.comfortaa700,
                    color: 'black',
                    fontSize: 20,
                    textTransform: 'uppercase',
                    marginBottom: 5,
                    textAlign: 'center'
                }}>Оформлення <Text style={{ color: Colors.blue }}>Замовлення</Text></Text>

                <RetailOrderButton
                    style={{ alignSelf: "flex-start" }}
                />
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

                        <Image
                            source={require('../../../assets/orders-screen/arrow.webp')}
                            style={styles.arrow}
                        />
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
        backgroundColor: 'white',
        shadowColor: Colors.gray,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 2,
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
    arrow: {
        width: 5,
        height: 10,
        position: 'absolute',
        right: 15,
    }
});