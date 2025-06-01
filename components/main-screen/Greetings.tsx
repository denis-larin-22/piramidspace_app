import { Text, StyleSheet, } from "react-native";
import { Fonts } from "../../theme/fonts";
import { getGreetingUA } from "../../lib/utils";
import { Avatar } from "../ui/Avatar";
import AnimatedWrapper from "../animation/AnimatedWrapper";

function Greetings({ userName }: { userName: string, isOnline?: boolean }) {
    const greetingValue = getGreetingUA();

    return (
        <AnimatedWrapper
            style={styles.container}
            useOpacity
            offsetY={-40}
        >
            <Text style={styles.greetingText}>
                {greetingValue},
                <Text style={styles.userName}> {userName}!</Text>
            </Text>
            <Avatar />
        </AnimatedWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    greetingText: {
        fontSize: 18,
        fontFamily: Fonts.comfortaa400,
        maxWidth: '75%'
    },
    userName: {
        fontFamily: Fonts.comfortaa700,
    }
});

export default Greetings;
