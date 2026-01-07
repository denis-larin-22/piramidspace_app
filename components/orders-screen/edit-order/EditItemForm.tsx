import { useState } from "react";
import { Image, ImageBackground, KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import AnimatedWrapper from "../../animation/AnimatedWrapper";
import { Colors } from "../../../theme/colors";
import WidthAndHeight from "./WidthAndHeight";
import Count from "./Count";
import Color from "./Colors";
import ControlType from "./ControlType";
import FixationType from "./FixationType";
import { CloseButton } from "../../ui/CloseButton";
import { ISubgroup } from "../../../lib/api/orders-screen/groups-and-products";
import { IOrderItemToAdd, IOrderItemToUpdate } from "../../../lib/api/orders-screen/edit-order";
import { Fonts } from "../../../theme/fonts";

function EditItemForm({
    itemToEdit,
    editHandler,
    subgroupData
}: {
    itemToEdit: IOrderItemToUpdate,
    editHandler: React.Dispatch<React.SetStateAction<IOrderItemToUpdate>>,
    subgroupData: ISubgroup
}) {
    const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

    return (
        <>
            <Pressable
                style={styles.editButton}
                onPress={() => { setIsFormOpen(!isFormOpen) }}
            >
                <Image
                    source={require('../../../assets/orders-screen/edit.png')}
                    style={styles.editIcon}
                />
            </Pressable>

            <EditForm
                isOpen={isFormOpen}
                setIsOpen={setIsFormOpen}

                itemToEdit={itemToEdit}
                editHandler={editHandler}
                subgroupData={subgroupData}
            />
        </>
    )
}

export default EditItemForm;

function EditForm({
    isOpen,
    setIsOpen,
    itemToEdit,
    editHandler,
    subgroupData,
}: {
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    itemToEdit: IOrderItemToUpdate | IOrderItemToAdd,
    editHandler: React.Dispatch<React.SetStateAction<IOrderItemToUpdate | IOrderItemToAdd>>,
    subgroupData: ISubgroup,
}) {
    const [isSubmitHidden, setIsSubmitHidden] = useState<boolean>(true);

    const colorList = Object.keys(subgroupData.colors);

    // width\height limits
    const targetTkan = subgroupData.tkani.find((tkan) => tkan.short_name === itemToEdit.product_code || tkan.name === itemToEdit.product_code);

    const maxWidth = targetTkan.max_width;
    const maxHeight = targetTkan.max_height;

    return (
        <Modal
            visible={isOpen}
            transparent={true}
            animationType="fade"
            statusBarTranslucent={true}
            onRequestClose={() => setIsOpen(false)}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <AnimatedWrapper
                    style={styles.modalOverlay}
                    useOpacity
                    duration={200}
                >
                    <AnimatedWrapper
                        useOpacity
                        useScale
                        delay={100}
                        duration={200}
                        style={styles.modalContent}
                    >
                        <View style={styles.titleWrap}>
                            <View style={styles.editDetailLogoWrap}>
                                <Image
                                    source={require('../../../assets/orders-screen/pencil.webp')}
                                    style={styles.editDetailLogo}
                                />
                            </View>
                            <Text style={styles.title}>{itemToEdit.product_code}</Text>
                        </View>

                        <WidthAndHeight
                            subgroupCode={subgroupData.code}

                            width={itemToEdit.width}
                            maxWidth={maxWidth}
                            widthHandler={(value) => {
                                setIsSubmitHidden(false);
                                editHandler({ ...itemToEdit, width: value });
                            }}

                            height={itemToEdit.height}
                            maxHeight={maxHeight}
                            heightHandler={(value) => {
                                setIsSubmitHidden(false);
                                editHandler({ ...itemToEdit, height: value });
                            }}
                        />

                        <View style={{
                            flexDirection: 'row',
                            gap: 20
                        }}>
                            <ControlType
                                control={itemToEdit.side}
                                controlTypesList={subgroupData.control}
                                controlHandler={(side) => {
                                    setIsSubmitHidden(false);
                                    editHandler({ ...itemToEdit, side: side });
                                }}
                            />

                            <Count
                                count={itemToEdit.quantity}
                                countHandler={(value) => {
                                    setIsSubmitHidden(false);
                                    editHandler({ ...itemToEdit, quantity: value });
                                }}
                            />
                        </View>

                        <Color
                            сolor={itemToEdit.system_color}
                            colorList={colorList}
                            colorHandler={(color) => {
                                setIsSubmitHidden(false);
                                editHandler({ ...itemToEdit, system_color: color });
                            }}
                        />


                        <FixationType
                            fixation={itemToEdit.fixation_type}
                            fixationList={subgroupData.fixations}
                            fixationHandler={(fixation) => {
                                setIsSubmitHidden(false);
                                editHandler({ ...itemToEdit, fixation_type: fixation });
                            }}
                        />

                        <CloseButton
                            style={styles.deleteBtn}
                            closeHandler={() => setIsOpen(false)}
                        />
                        {!isSubmitHidden && <AnimatedWrapper
                            offsetY={20}
                            style={styles.submitButton}
                        >
                            <Pressable onPress={() => { setIsOpen(false) }}>
                                <ImageBackground
                                    source={require("../../../assets/gradient-small.png")}
                                    style={styles.submitButtonBg}
                                >
                                    <Text style={styles.submitButtonText}>Зберегти</Text>
                                </ImageBackground>
                            </Pressable>
                        </AnimatedWrapper>}
                    </AnimatedWrapper>
                </AnimatedWrapper>
            </KeyboardAvoidingView>

        </Modal>
    )
}

const styles = StyleSheet.create({
    editButton: {
        position: 'absolute',
        bottom: -40,
        right: 45,
        width: 30,
        height: 30,
        backgroundColor: "white",
        borderRadius: 50,
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    editIcon: {
        width: '80%',
        height: '80%',
        opacity: 0.3,
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0,
        margin: 0,
    },
    modalContent: {
        backgroundColor: Colors.pale,
        paddingVertical: 20,
        paddingHorizontal: 12,
        borderRadius: 13,
        width: '92%',
        maxHeight: '90%',
        minHeight: 300,
    },
    titleWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        borderBottomWidth: 2,
        borderColor: Colors.blueLight,
        paddingBottom: 10,
        marginBottom: 10,
    },
    title: {
        fontFamily: Fonts.comfortaa700,
        color: Colors.blue,
        fontSize: 18,
        lineHeight: 20,
    },
    editDetailLogoWrap: {
        width: 30,
        height: 30,
        backgroundColor: 'white',
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    editDetailLogo: {
        width: '70%',
        height: '70%',
    },
    deleteBtn: {
        position: 'absolute',
        top: 35,
        right: 0
    },
    submitButton: {
        height: 59,
        maxWidth: 180,
        width: "100%",
        borderRadius: 31,
        overflow: "hidden",
        position: "absolute",
        zIndex: 0,
        bottom: -75,
        alignSelf: "center",
    },
    submitButtonBg: {
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    submitButtonText: {
        fontFamily: Fonts.comfortaa600,
        fontSize: 17,
        lineHeight: 22,
        color: "white",
    },
});