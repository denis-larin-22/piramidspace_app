import { Text, TextInput, View } from "react-native";
import { thirdStepStyles } from "../ThirdStep";
import { useState } from "react";
import { Colors } from "../../../../theme/colors";
import { useCreateOrder } from "../../NewOrderProvider";

export default function CountValue({ errorFieldNumber }: { errorFieldNumber: number | null }) {
    const { orderParams, setOrderParams } = useCreateOrder();

    const [isFocused, setIsFocused] = useState<boolean>(false);

    return (
        <View style={thirdStepStyles.inputContainer}>
            <Text style={thirdStepStyles.detailsText}>Кількість</Text>
            <TextInput
                keyboardType="number-pad"
                style={[
                    thirdStepStyles.input,
                    { borderColor: isFocused ? Colors.blue : Colors.blueLight },
                    errorFieldNumber === 4 && thirdStepStyles.borderRed
                ]}
                placeholder="0"
                value={orderParams.newOrderObject.count_number || ""}
                onChangeText={(value) => {
                    setOrderParams({
                        ...orderParams,
                        newOrderObject: {
                            ...orderParams.newOrderObject,
                            count_number: value
                        }
                    });
                }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                maxLength={3}
            />
            <Text style={thirdStepStyles.unitLabel}>шт</Text>
        </View>
    )
};