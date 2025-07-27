import { Modal, StyleSheet } from "react-native";
import AnimatedWrapper from "../animation/AnimatedWrapper";
import { Colors } from "../../theme/colors";

interface CustomModalProps {
    visible: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export const CustomModal = ({ visible, onClose, children }: CustomModalProps) => {
    return (
        <Modal visible={visible} transparent animationType="none">
            <AnimatedWrapper style={styles.modalOverlay} useOpacity duration={200}>
                <AnimatedWrapper style={styles.modalContent} useOpacity useScale delay={100} duration={200}>
                    {children}
                </AnimatedWrapper>
            </AnimatedWrapper>
        </Modal>
    );
};

export const styles = StyleSheet.create({
    modalOverlay: {
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        position: "relative",
        height: "100%",
        width: "100%",
        backgroundColor: "#00000080",
    },
    modalContent: {
        backgroundColor: Colors.pale,
        paddingVertical: 20,
        paddingHorizontal: 12,
        borderRadius: 13,
        width: "90%",
    },
});
