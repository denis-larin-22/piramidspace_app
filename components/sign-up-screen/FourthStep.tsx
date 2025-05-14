import { Dimensions, Image, Text, View } from "react-native";
import { Fonts } from "../../theme/fonts";

const STEP_SCREEN_ID = 4;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

function FourthStep({ activeScreenStep }: { activeScreenStep: number }) {
    if (activeScreenStep !== STEP_SCREEN_ID) {
        return null
    } else {
        return (
            <View
                style={{
                    marginTop: 54
                }}
            >


                <Image
                    source={require('../../assets/signup-screen/fourth-step-text.png')}
                    style={{
                        height: 75,
                        width: 353,
                        resizeMode: 'contain',
                        marginTop: 58
                    }}
                />

                <Text style={{
                    marginTop: 17,
                    marginBottom: 80,
                    fontFamily: Fonts.openSans400,
                    fontSize: 16,
                    color: 'black',
                    textAlign: 'center'
                }}>Бажаємо чудового настрою і великих продажів!</Text>

                <View
                    style={{
                        position: 'relative'
                    }}
                >
                    <Image
                        source={require('../../assets/signup-screen/fourth-step.png')}
                        style={{
                            height: 167,
                            width: SCREEN_WIDTH,
                            resizeMode: 'cover',
                            position: 'absolute',
                            left: '-5%'
                        }}
                    />
                </View>
            </View >
        )
    };
}

export default FourthStep;