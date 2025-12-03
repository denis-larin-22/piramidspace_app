import { Text, TextInput, View } from "react-native";
import { useState } from "react";
import { Colors } from "../../../../theme/colors";
import { useCreateOrder } from "../../NewOrderProvider";
import { formStyles } from "./form-styles";

export default function CountValue({ errorFieldNumber }: { errorFieldNumber: number | null }) {
    const { orderParams, setOrderParams } = useCreateOrder();

    const [isFocused, setIsFocused] = useState<boolean>(false);

    return (
        <View style={formStyles.inputContainer}>
            <Text style={formStyles.detailsText}>Кількість</Text>
            <TextInput
                keyboardType="number-pad"
                style={[
                    formStyles.input,
                    { borderColor: isFocused ? Colors.blue : Colors.blueLight },
                    errorFieldNumber === 4 && formStyles.borderRed
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
            <Text style={formStyles.unitLabel}>шт</Text>
        </View>
    )
};