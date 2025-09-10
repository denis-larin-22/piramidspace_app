import { Image, Pressable, StyleSheet, Text } from "react-native";
import { MainGroupsCode } from "../../../lib/api/orders-screen/groups-and-products";
import AnimatedWrapper from "../../animation/AnimatedWrapper";
import { Colors } from "../../../theme/colors";
import { Fonts } from "../../../theme/fonts";

interface IMainGroup {
    code: MainGroupsCode,
    name: string,
    icon: any,
}

function FirstStep({ stepHandler }: {
    stepHandler: (selectedCategory: {
        name: string;
        code: MainGroupsCode;
    }) => void
}) {
    const mainGroups: IMainGroup[] = [
        { code: "horizontal", name: 'Горизонтальні', icon: require('../../../assets/orders-screen/horisontal.png') },
        { code: "vertical", name: 'Вертикальні', icon: require('../../../assets/orders-screen/vertical.png') },
        { code: "day", name: 'День-Ніч', icon: require('../../../assets/orders-screen/day-night.png') },
        { code: "roller", name: 'Рулонні', icon: require('../../../assets/orders-screen/roller.png') },
        { code: "components", name: 'Комплектуючі', icon: require('../../../assets/orders-screen/components.png') },
        { code: "ads", name: 'Рекламна продукція', icon: require('../../../assets/orders-screen/promotional-items.png') },
    ];

    return (
        <>
            <Text style={{
                fontFamily: Fonts.comfortaa700,
                fontSize: 18,
                textTransform: 'uppercase',
                marginBottom: 30,
                textAlign: 'center'
            }}>Оформлення <Text style={{ color: Colors.blue }}>Замовлення</Text></Text>

            {mainGroups.map((group, index) => (
                <AnimatedWrapper
                    key={group.code}
                    useOpacity
                    offsetY={20}
                    delay={index * 60}
                >
                    <Pressable
                        style={({ pressed }) => [
                            {
                                backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
                            },
                            styles.categoryButton
                        ]}
                        onPress={() => {
                            stepHandler({ code: group.code, name: group.name });
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
        borderColor: '#3372F923',
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