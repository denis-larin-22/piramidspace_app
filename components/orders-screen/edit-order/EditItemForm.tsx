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
import { ISubgroup, MainGroupsCode } from "../../../lib/api/orders-screen/groups-and-products";
import { IOrderItemToAdd, IOrderItemToUpdate } from "../../../lib/api/orders-screen/edit-order";
import { Fonts } from "../../../theme/fonts";
import { ErrorMessage } from "../../ui/ErrorMessage";
import { shadow } from "../../../theme/shadow";

function EditItemForm({
    itemToEdit,
    editHandler,
    subgroupData
}: {
    itemToEdit: IOrderItemToUpdate,
    editHandler: (updatedItem: IOrderItemToUpdate) => void,
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
                editHandler={editHandler as React.Dispatch<React.SetStateAction<IOrderItemToUpdate | IOrderItemToAdd>>}
                groupCode={itemToEdit.group_code}
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
    groupCode,
    subgroupData,
}: {
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    itemToEdit: IOrderItemToUpdate | IOrderItemToAdd,
    editHandler: React.Dispatch<React.SetStateAction<IOrderItemToUpdate | IOrderItemToAdd>>,
    groupCode: MainGroupsCode,
    subgroupData: ISubgroup,
}) {
    const [isSubmitHidden, setIsSubmitHidden] = useState<boolean>(true);

    // Fields error state
    const initError = {
        isError: false,
        message: ""
    }
    const [error, setError] = useState(initError);

    // colors
    const colorList = Object.keys(subgroupData.colors);

    // width\height limits
    const targetTkan = subgroupData.products.find((product) => product.name === itemToEdit.product_code || product.name === itemToEdit.product_code);

    const maxWidth = targetTkan === undefined ? 999999 : targetTkan.w_max ? targetTkan.w_max : 999999;
    const maxHeight = targetTkan === undefined ? 999999 : targetTkan.h_max ? targetTkan.h_max : 999999;

    // Save button handler
    function saveHandler() {
        const { width, height, quantity } = itemToEdit;

        if (width === 0) {
            setError({ isError: true, message: "Введіть значення ширини" });
        } else if (height === 0) {
            setError({ isError: true, message: "Введіть значення висоти" });
        } else if (quantity === 0) {
            setError({ isError: true, message: "Введіть кількість" });
        } else {
            setIsOpen(false);
        }

        setTimeout(() => setError(initError), 2500);
    };


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
                        style={[styles.modalContent]}
                    >
                        <View style={styles.titleWrap}>
                            <View style={[styles.editDetailLogoWrap, shadow]}>
                                <Image
                                    source={require('../../../assets/orders-screen/textile.webp')}
                                    style={styles.editDetailLogo}
                                />
                            </View>
                            <Text
                                style={styles.title}
                                numberOfLines={2}
                                ellipsizeMode="tail"
                            >
                                {itemToEdit.product_code}
                            </Text>
                        </View>

                        {/* Errors fields messages */}
                        {error.isError && <ErrorMessage
                            errorTitle="Перевірте дані"
                            errorText={error.message}
                        />}

                        <WidthAndHeight
                            groupCode={groupCode}
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

                        <View style={styles.controlCountWrap}>
                            <ControlType
                                control={itemToEdit.side}
                                controlTypesList={subgroupData.control}
                                controlHandler={(side) => {
                                    setIsSubmitHidden(false);
                                    editHandler({ ...itemToEdit, side: side });
                                }}
                            />

                            {/* UI Separator */}
                            <View style={styles.separator}></View>

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
                            <Pressable onPress={saveHandler}>
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
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0,
        margin: 0,
    },
    modalContent: {
        backgroundColor: Colors.pale,
        paddingVertical: 15,
        paddingHorizontal: 7,
        borderWidth: 5,
        borderColor: Colors.grayLight,
        borderRadius: 20,
        width: '92%',
        maxHeight: '90%',
        minHeight: 300,
        top: -30
    },
    titleWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        borderBottomWidth: 4,
        borderRadius: 20,
        borderColor: Colors.grayLight,
        paddingBottom: 10,
        marginBottom: 10,
        overflow: 'hidden'
    },
    title: {
        fontFamily: Fonts.comfortaa700,
        color: Colors.blue,
        fontSize: 18,
        lineHeight: 26,
        width: '70%',
        paddingHorizontal: 5
    },
    editDetailLogoWrap: {
        width: 60,
        height: 60,
        backgroundColor: 'white',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: Colors.grayLight

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
    controlCountWrap: {
        flexDirection: 'row',
        justifyContent: "space-between",
        gap: 12,
        alignItems: 'center'
    },
    separator: {
        height: '90%',
        width: 2,
        backgroundColor: Colors.grayLight,
        alignSelf: 'center'
    }
});