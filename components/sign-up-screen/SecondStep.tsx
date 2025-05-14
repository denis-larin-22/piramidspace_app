import { Image, KeyboardAvoidingView, Text, TextInput, View } from "react-native";
import { Fonts } from "../../theme/fonts";
import { Colors } from "../../theme/colors";

const STEP_SCREEN_ID = 2;

function SecondStep({ activeScreenStep }: { activeScreenStep: number }) {
    if (activeScreenStep !== STEP_SCREEN_ID) {
        return null
    } else {
        return (
            <View
                style={{
                    marginTop: 54
                }}
            >
                <View
                    style={{
                        width: 486,
                        height: 222,
                        position: 'relative',
                    }}
                >
                    <Image
                        source={require('../../assets/signup-screen/second-step.png')}
                        style={{
                            height: '100%',
                            resizeMode: 'contain',
                            position: 'absolute',
                            left: '-25%',
                        }}
                    />
                </View>

                <Image
                    source={require('../../assets/signup-screen/second-step-text.png')}
                    style={{
                        height: 75,
                        width: 353,
                        resizeMode: 'contain',
                        marginTop: 58
                    }}
                />

                <Text
                    style={{
                        fontFamily: Fonts.comfortaa700,
                        fontSize: 16,
                        marginTop: 50,
                        marginBottom: 6,
                        paddingLeft: 16
                    }}
                >Ваше місто</Text>
                <TextInput
                    placeholder="Введіть назву вашого міста"
                    placeholderTextColor={Colors.gray}
                    style={{
                        backgroundColor: 'white',
                        paddingVertical: 10,
                        paddingLeft: 16,
                        borderRadius: 31,
                        color: 'black',
                    }}
                />
            </View >
        )
    };
}

export default SecondStep;