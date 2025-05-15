import { Dimensions, Image, Text, View, StyleSheet } from "react-native";
import { Fonts } from "../../theme/fonts";
import AnimatedWrapper from "../animation/AnimatedWrapper";

const STEP_SCREEN_ID = 4;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

function FourthStep({ activeScreenStep }: { activeScreenStep: number }) {
    if (activeScreenStep !== STEP_SCREEN_ID) return null;

    return (
        <View style={styles.container}>
            <AnimatedWrapper offsetY={80} useScale useOpacity>
                <Image
                    source={require('../../assets/signup-screen/fourth-step-text.png')}
                    style={styles.topTextImage}
                />
            </AnimatedWrapper>

            <AnimatedWrapper offsetY={80} useScale useOpacity delay={200}>
                <Text style={styles.message}>
                    Бажаємо чудового настрою і великих продажів!
                </Text>
            </AnimatedWrapper>

            <AnimatedWrapper offsetY={80} useScale useOpacity delay={400}>
                <Image
                    source={require('../../assets/signup-screen/fourth-step.png')}
                    style={styles.bottomImage}
                />
            </AnimatedWrapper>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 54,
    },
    topTextImage: {
        height: 75,
        width: 353,
        resizeMode: 'contain',
        marginTop: 58,
    },
    message: {
        marginTop: 17,
        marginBottom: 80,
        fontFamily: Fonts.openSans400,
        fontSize: 16,
        color: 'black',
        textAlign: 'center',
    },
    bottomImage: {
        height: 167,
        width: SCREEN_WIDTH,
        resizeMode: 'cover',
        left: '-5%',
    },
});

export default FourthStep;
