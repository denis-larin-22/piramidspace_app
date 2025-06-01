import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import { Colors } from "../../theme/colors";

function BurgerMenu({ isOpen, setIsOpen }: {
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
    const { width, height } = Dimensions.get('window');

    if (!isOpen) {
        return null;
    } else {
        return (
            <View
                style={[styles.menuWrap, {
                    height: height,
                    width: width,
                }]}
            >
                <View
                    style={{
                        width: width / 2,
                        height: height,
                        backgroundColor: Colors.pale,
                    }}
                >

                </View>
                <TouchableOpacity
                    style={{
                        width: width / 2,
                        height: height,
                        backgroundColor: '#00000070',
                        alignSelf: 'flex-end'
                    }}
                    onPress={() => setIsOpen(false)}
                ></TouchableOpacity>
            </View>
        )
    }
};

export default BurgerMenu;

const styles = StyleSheet.create({
    menuWrap: {
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        zIndex: 10,
        flexDirection: 'row'
    }
})