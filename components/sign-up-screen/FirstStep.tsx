import { Image, KeyboardAvoidingView, Text, TextInput, View } from "react-native";
import { Fonts } from "../../theme/fonts";
import { Colors } from "../../theme/colors";

const STEP_SCREEN_ID = 1;

function FirstStep({ activeScreenStep }: { activeScreenStep: number }) {
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
                        width: 450,
                        height: 252,
                        position: 'relative'
                    }}
                >
                    <Image
                        source={require('../../assets/signup-screen/first-step.png')}
                        style={{
                            height: '100%',
                            resizeMode: 'contain',
                            position: 'absolute',
                            right: 0,
                        }}
                    />
                </View>

                <Text
                    style={{
                        marginTop: 52,
                        fontFamily: Fonts.comfortaa700,
                        fontSize: 36,
                        textTransform: 'uppercase'
                    }}
                >Як ви назвали свій <Text style={{ color: Colors.blue }}>бізнес</Text>?</Text>

                <Text
                    style={{
                        fontFamily: Fonts.comfortaa700,
                        fontSize: 16,
                        marginTop: 50,
                        marginBottom: 6,
                        paddingLeft: 16
                    }}
                >Назва</Text>
                <TextInput
                    placeholder="Введіть назву вашого бізнесу"
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

export default FirstStep;