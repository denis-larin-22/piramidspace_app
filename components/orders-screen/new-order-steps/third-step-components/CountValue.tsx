import { Text, TextInput, View } from "react-native"
import { INewOrderObject } from "../../AddNewOrder"
import { thirdStepStyles } from "../ThirdStep"
import { useState } from "react"
import { Colors } from "../../../../theme/colors";

export default function CountValue({ orderObject, setOrderObject, errorFieldNumber }: { orderObject: INewOrderObject, setOrderObject: React.Dispatch<React.SetStateAction<INewOrderObject>>, errorFieldNumber: number | null }) {
    const [isFocused, setIsFocused] = useState<boolean>(false);

    return (
        <View style={thirdStepStyles.inputContainer}>
            <Text style={thirdStepStyles.detailsText}>Кількість</Text>
            <TextInput
                keyboardType="number-pad"
                style={[
                    thirdStepStyles.input,
                    { borderColor: isFocused ? Colors.blue : 'transparent' },
                    errorFieldNumber === 4 && thirdStepStyles.borderRed
                ]}
                placeholder="0"
                value={orderObject.count_number || ""}
                onChangeText={(value) => {
                    setOrderObject({
                        ...orderObject,
                        count_number: value
                    })
                }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                maxLength={3}
            />
            <Text style={thirdStepStyles.unitLabel}>шт</Text>
        </View>
    )
};