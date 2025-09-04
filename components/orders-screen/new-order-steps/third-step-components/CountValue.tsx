import { Text, TextInput, View } from "react-native"
import { INewOrderObject } from "../../AddNewOrder"
import { thirdStepStyles } from "../ThirdStep"

export default function CountValue({ orderObject, setOrderObject, errorFieldNumber }: { orderObject: INewOrderObject, setOrderObject: React.Dispatch<React.SetStateAction<INewOrderObject>>, errorFieldNumber: number | null }) {
    return (
        <View style={thirdStepStyles.inputContainer}>
            <Text style={thirdStepStyles.detailsText}>Кількість</Text>
            <TextInput
                keyboardType="number-pad"
                style={[thirdStepStyles.input, errorFieldNumber === 4 && thirdStepStyles.borderRed]}
                placeholder="0"
                value={orderObject.count_number || ""}
                onChangeText={(value) => {
                    setOrderObject({
                        ...orderObject,
                        count_number: value
                    })
                }}
            />
            <Text style={thirdStepStyles.unitLabel}>шт</Text>
        </View>
    )
};