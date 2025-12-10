import { ImageBackground, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Colors } from "../../../theme/colors";
import { Fonts } from "../../../theme/fonts";
import { useEffect, useState } from "react";
import AnimatedWrapper from "../../animation/AnimatedWrapper";
import { ISubgroup, MainGroupsCode, Tkan } from "../../../lib/api/orders-screen/groups-and-products";
import { formStyles } from "../new-order-steps/third-step-components/form-styles";
import ArrowDown from "../../ui/ArrowDown";
import { IOrderItemToAdd } from "../../../lib/api/orders-screen/edit-order";
import WidthAndHeight from "./WidthAndHeight";
import ControlType from "./ControlType";
import Count from "./Count";
import Color from "./Colors";
import FixationType from "./FixationType";
import { CloseButton } from "../../ui/CloseButton";

function AddItemForm({
    groupCode,
    subgroupData,
    addItemHandler
}: {
    groupCode: MainGroupsCode,
    subgroupData: ISubgroup,
    addItemHandler: (newItem: IOrderItemToAdd) => void
}) {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <>
            <View style={styles.wrap}>
                <Pressable onPress={() => setIsOpen(true)} style={styles.addBtn}>
                    <View style={styles.btnTextWrap}>
                        <Text style={styles.btnText}>+</Text>
                    </View>
                </Pressable>
                <Text style={styles.btnTextSmall}>Додати тканину</Text>
            </View>

            <AddForm
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                groupCode={groupCode}
                subgroupData={subgroupData}

                addItemHandler={addItemHandler}
            />
        </>
    )
}

export default AddItemForm;

function AddForm({
    isOpen,
    setIsOpen,
    groupCode,
    subgroupData,
    addItemHandler
}: {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    groupCode: MainGroupsCode;
    subgroupData: ISubgroup;
    addItemHandler: (newItem: IOrderItemToAdd) => void
}) {
    const initNewItem: IOrderItemToAdd = {
        action: "add",
        product_code: "",
        group_code: groupCode,
        subgroup_code: subgroupData.code,
        width: 0,
        height: 0,
        quantity: 0,
        side: "",
        system_color: "",
        units: "см",
        options: "",
        fixation_type: ""
    };

    const [newItem, setNewItem] = useState<IOrderItemToAdd>(initNewItem);
    const [activeTkan, setActiveTkan] = useState<Tkan | null>(null);
    const [isItemFull, setIsItemFull] = useState<boolean>(false);

    useEffect(() => {
        const isFull =
            newItem.product_code.trim() !== "" &&
            newItem.side.trim() !== "" &&
            newItem.system_color.trim() !== "" &&
            newItem.fixation_type.trim() !== "" &&
            newItem.width > 0 &&
            newItem.height > 0 &&
            newItem.quantity > 0;

        setIsItemFull(isFull);
    }, [newItem]);

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
                <AnimatedWrapper style={styles.modalOverlay} useOpacity duration={200}>
                    <AnimatedWrapper
                        useOpacity
                        useScale
                        delay={100}
                        duration={200}
                        style={styles.modalContent}
                    >
                        <View style={styles.headerContainer}>
                            <Text style={styles.headerTitle}>Додавання тканини</Text>
                            <Text style={styles.headerSubtitle}>{subgroupData.name}</Text>
                        </View>

                        <TkanList
                            activeTkan={newItem.product_code}
                            tkanList={subgroupData.tkani}
                            tkanHandler={(tkan: Tkan) => {
                                setNewItem(prev => ({ ...prev, product_code: tkan.short_name }));
                                setActiveTkan(tkan);
                            }}
                            closeHandler={() => setIsOpen(false)}
                        />

                        <View style={[styles.fieldsContainer, { opacity: newItem.product_code ? 1 : 0.4, pointerEvents: newItem.product_code ? 'auto' : 'none' }]}>
                            <WidthAndHeight
                                height={newItem.height}
                                maxHeight={activeTkan?.max_height ?? 0}
                                heightHandler={(value) => setNewItem(prev => ({ ...prev, height: value }))}

                                width={newItem.width}
                                maxWidth={activeTkan?.max_width ?? 0}
                                widthHandler={(value) => setNewItem(prev => ({ ...prev, width: value }))}
                            />

                            <View style={styles.rowWithGap}>
                                <ControlType
                                    control={newItem.side}
                                    controlTypesList={subgroupData.control}
                                    controlHandler={(side) => setNewItem(prev => ({ ...prev, side }))}
                                />

                                <Count
                                    count={newItem.quantity}
                                    countHandler={(value) => setNewItem(prev => ({ ...prev, quantity: value }))}
                                />
                            </View>

                            <Color
                                сolor={newItem.system_color}
                                colorList={Object.keys(subgroupData.colors)}
                                colorHandler={(color) => setNewItem(prev => ({ ...prev, system_color: color }))}
                            />

                            <FixationType
                                fixation={newItem.fixation_type}
                                fixationList={subgroupData.fixations.map((type) => type.name)}
                                fixationHandler={(fixation) => setNewItem(prev => ({ ...prev, fixation_type: fixation }))}
                            />
                        </View>

                        <CloseButton
                            style={styles.closeButton}
                            closeHandler={() => {
                                setIsOpen(false);
                                setActiveTkan(null);
                                setNewItem(initNewItem);
                            }}
                        />

                        {isItemFull && (
                            <AnimatedWrapper offsetY={20} style={styles.submitButton}>
                                <Pressable onPress={() => {
                                    addItemHandler(newItem);
                                    setNewItem(initNewItem);
                                    setIsOpen(false);
                                }}>
                                    <ImageBackground
                                        source={require("../../../assets/gradient-small.png")}
                                        style={styles.submitButtonBg}
                                        resizeMode="cover"
                                    >
                                        <Text style={styles.submitButtonText}>Додати</Text>
                                    </ImageBackground>
                                </Pressable>
                            </AnimatedWrapper>
                        )}
                    </AnimatedWrapper>
                </AnimatedWrapper>
            </KeyboardAvoidingView>
        </Modal>
    );
}

function TkanList({
    activeTkan,
    tkanHandler,
    tkanList,
    closeHandler
}: {
    activeTkan: string,
    tkanHandler: (tkan: Tkan) => void,
    tkanList: Tkan[],
    closeHandler: () => void
}) {
    const [isTkanListOpen, setIsTkanListOpen] = useState<boolean>(false);

    return (
        <View>
            <Text style={formStyles.detailsText}>Оберіть тканину</Text>

            <Pressable onPress={() => setIsTkanListOpen(!isTkanListOpen)}>
                <Text style={[formStyles.selectField, styles.tkanSelectField]}>{activeTkan.length !== 0 ? activeTkan : "Оберіть тканину"}</Text>
            </Pressable>
            <ArrowDown isRotate={isTkanListOpen} style={formStyles.arrowIcon} />

            {isTkanListOpen && (
                <AnimatedWrapper
                    useOpacity
                    useScale
                    offsetY={-20}
                    style={formStyles.dropdownMenu}
                >
                    <ScrollView style={formStyles.scrollModal}>
                        {tkanList.length ?
                            tkanList.map((tkan, index) => (
                                <AnimatedWrapper
                                    key={index}
                                    useOpacity
                                    offsetY={10}
                                    delay={150 + (30 * index)}
                                >
                                    <Pressable
                                        style={[
                                            formStyles.productItem,
                                            (activeTkan === tkan.short_name) && styles.activeProductItem,
                                        ]}
                                        onPress={() => {
                                            tkanHandler(tkan);
                                            setIsTkanListOpen(false);
                                        }}
                                    >
                                        <Text style={formStyles.productItemText}>{tkan.short_name}</Text>
                                    </Pressable>
                                </AnimatedWrapper>
                            ))
                            :
                            <Text style={[formStyles.absentValueText, styles.absentValueMargin]}>значення відсутні</Text>
                        }
                    </ScrollView>
                </AnimatedWrapper>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    // Кнопка «Додати тканину» на головному екрані
    wrap: {
        height: 200,
        width: 60,
        justifyContent: 'center',
        alignItems: 'center'
    },
    addBtn: {
        width: 50,
        height: 50,
        backgroundColor: "white",
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center'
    },
    btnTextWrap: {
        width: 40,
        height: 40,
        backgroundColor: Colors.pale,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    btnText: {
        fontFamily: Fonts.comfortaa700,
        color: Colors.blue,
        fontSize: 20,
        lineHeight: 22
    },
    btnTextSmall: {
        fontFamily: Fonts.comfortaa400,
        fontSize: 12,
        lineHeight: 14,
        color: Colors.gray,
        position: 'absolute',
        bottom: 40
    },

    // Модальне вікно
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

    // Заголовок модалки
    headerContainer: {
        paddingBottom: 5,
        marginBottom: 5,
        borderBottomWidth: 2,
        borderColor: Colors.blueLight
    },
    headerTitle: {
        fontFamily: Fonts.comfortaa700,
        fontSize: 20,
        textTransform: 'uppercase',
        color: Colors.gray
    },
    headerSubtitle: {
        fontFamily: Fonts.comfortaa700,
        fontSize: 16,
        color: Colors.blueLight,
        textTransform: 'uppercase',
        alignSelf: 'flex-end'
    },

    // Контейнер полів (відключається, якщо тканина не вибрана)
    fieldsContainer: {},

    // Рядок з керуванням та кількістю
    rowWithGap: {
        flexDirection: 'row',
        gap: 20,
        marginVertical: 10
    },

    // Селект тканини
    tkanSelectField: {
        borderColor: Colors.blueLight
    },

    // Активний елемент у списку тканин
    activeProductItem: {
        backgroundColor: Colors.pale,
    },

    absentValueMargin: {
        marginBottom: 5
    },

    // Кнопка закриття
    closeButton: {
        position: 'absolute',
        bottom: -90,
        right: 0,
    },

    // Кнопка «Додати»
    submitButton: {
        height: 59,
        maxWidth: 180,
        width: "100%",
        borderRadius: 31,
        overflow: "hidden",
        position: "absolute",
        zIndex: 0,
        bottom: -70,
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