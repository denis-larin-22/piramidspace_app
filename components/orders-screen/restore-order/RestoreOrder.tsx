import { Image, Pressable, StyleSheet, } from "react-native";
import { Colors } from "../../../theme/colors";
import { useState } from "react";
import { IOrder } from "../../../lib/api/orders-screen/ordersList";
import RestoreForm from "./RestoreForm";
import RestoreConfirm from "./RestoreConfirm";

function RestoreOrder({
    currentOrder,
    updateAfterRestoreHandler
}: {
    currentOrder: IOrder,
    updateAfterRestoreHandler: () => void
}) {
    const [isOpen, setIsOpen] = useState<boolean | null>(false);

    // CONFIRM MODAL
    function confirmHandler() {
        setIsOpen(true);
    }

    function rejectHandler() {
        setIsOpen(false);
    }

    return (
        <>
            <Pressable
                onPress={() => setIsOpen(null)}
                style={styles.restoreDetailBtn}
            >
                <Image
                    source={require('../../../assets/orders-screen/restore.png')}
                    style={styles.restoreDetailIcon}
                />
            </Pressable >


            {isOpen === null ?
                <RestoreConfirm
                    isOpen={isOpen}
                    confirmHandler={confirmHandler}
                    rejectHandler={rejectHandler}
                />
                :
                <RestoreForm
                    currentOrder={currentOrder}
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    updateAfterRestoreHandler={updateAfterRestoreHandler}
                />}
        </>
    )
}

export default RestoreOrder;

const styles = StyleSheet.create({
    restoreDetailBtn: {
        width: 40,
        height: 40,
        backgroundColor: Colors.pale,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
    },
    restoreDetailIcon: {
        width: 18,
        height: 18,
        opacity: 0.3
    }
});