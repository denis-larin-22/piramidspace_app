import { StyleSheet, Text, TextInput, View } from "react-native";
import { Fonts } from "../../../theme/fonts";
import { Colors } from "../../../theme/colors";
import { formStyles } from "../new-order-steps/third-step-components/form-styles";

function Count({ count, countHandler }: { count: number, countHandler: (value: number) => void }) {
    return (
        <View style={styles.wrap}>
            <View style={{ minWidth: '47%' }}>
                <View style={formStyles.rowLabel}>
                    <Text style={formStyles.detailsText}>Кількість </Text>
                    {/* <Text style={styles.labelNote}>(габарит)</Text> */}
                </View>
                <TextInput
                    keyboardType="number-pad"
                    style={[formStyles.input, { borderColor: Colors.blueLight }]}
                    placeholder="0"
                    value={count === 0 ? '' : count.toString()}
                    onChangeText={(value) => { countHandler(+Number(value).toFixed(0)) }}
                    maxLength={3}
                />
                <Text style={formStyles.unitLabel}>од</Text>
            </View>
        </View>
    )
}

export default Count;

const styles = StyleSheet.create({
    wrap: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
});