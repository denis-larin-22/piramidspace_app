import { Image, KeyboardAvoidingView, Text, TextInput, View } from "react-native";
import { Fonts } from "../../theme/fonts";
import { Colors } from "../../theme/colors";

const STEP_SCREEN_ID = 3;

function ThirdStep({ activeScreenStep }: { activeScreenStep: number }) {
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
                        width: 344,
                        height: 164,
                        position: 'relative',
                    }}
                >
                    <Image
                        source={require('../../assets/signup-screen/third-step.png')}
                        style={{
                            height: '100%',
                            resizeMode: 'contain',
                            position: 'absolute',
                            right: '-20%',
                        }}
                    />
                </View>

                <Image
                    source={require('../../assets/signup-screen/third-step-text.png')}
                    style={{
                        height: 87,
                        width: 353,
                        resizeMode: 'contain',
                        marginTop: 109
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
                >Дата народження вашого бізнесу</Text>
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

export default ThirdStep;