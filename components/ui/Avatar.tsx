import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../../theme/colors";
import { useEffect, useState } from "react";
import AnimatedWrapper from "../animation/AnimatedWrapper";
import { Fonts } from "../../theme/fonts";
import { getDataFromAcyncStorage, saveDataToAcyncStorage } from "../../lib/async-storage/acyncStorage";
import { ASYNC_STORAGE_USER_SETTINGS_AVATAR } from "../../lib/async-storage/asyncStorageKeys";

export function Avatar() {
    const avatarList = [
        require('../../assets/avatars/avatar1.png'),
        require('../../assets/avatars/avatar2.png'),
        require('../../assets/avatars/avatar3.png'),
        require('../../assets/avatars/avatar4.png'),
        require('../../assets/avatars/avatar5.png'),
        require('../../assets/avatars/avatar6.png'),
        require('../../assets/avatars/avatar8.png'),
        require('../../assets/avatars/avatar9.png'),
        require('../../assets/avatars/avatar7.png'),
        require('../../assets/avatars/avatar11.png'),
        require('../../assets/avatars/avatar10.png'),
        require('../../assets/avatars/avatar12.png'),
        require('../../assets/avatars/avatar13.png'),
        require('../../assets/avatars/avatar14.png'),
        require('../../assets/avatars/avatar15.png'),
        require('../../assets/avatars/avatar16.png'),
        require('../../assets/avatars/avatar18.png'),
        require('../../assets/avatars/avatar17.png'),
    ];

    const [activeAvatar, setActiveAvatar] = useState(avatarList[0]);
    const [isVissible, setIsVissible] = useState(false);

    useEffect(() => {
        getDataFromAcyncStorage(ASYNC_STORAGE_USER_SETTINGS_AVATAR)
            .then((avatar) => {
                if (avatar) {
                    setActiveAvatar(JSON.parse(avatar));
                } else {
                    setActiveAvatar(avatarList[0]);
                }
            }).catch(() => setActiveAvatar(avatarList[0]))
    }, []);

    return (
        <>
            <TouchableOpacity
                style={styles.avatarWrapper}
                onPress={() => setIsVissible(true)}
            >
                <Image
                    source={activeAvatar}
                    style={styles.avatarImage}
                    resizeMode="contain"
                />
            </TouchableOpacity>

            <Modal visible={isVissible} transparent>
                <AnimatedWrapper offsetY={50} style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Оберіть аватар:</Text>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setIsVissible(false)}
                            >
                                <Image
                                    source={require('../../assets/main-screen/close-icon.png')}
                                    style={styles.closeIcon}
                                />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.avatarsContainer}>
                            {avatarList.map((avatar, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.avatarOption,
                                        {
                                            borderColor: avatar === activeAvatar ? Colors.blue : Colors.gray,
                                            borderWidth: avatar === activeAvatar ? 3 : 2,
                                        },
                                    ]}
                                    onPress={() => {
                                        setActiveAvatar(avatar);
                                        saveDataToAcyncStorage(ASYNC_STORAGE_USER_SETTINGS_AVATAR, JSON.stringify(avatar));
                                    }}
                                >
                                    <Image
                                        source={avatar}
                                        style={styles.avatarOptionImage}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </AnimatedWrapper>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    avatarWrapper: {
        width: 45,
        height: 45,
        borderRadius: 100,
        borderWidth: 3,
        borderColor: Colors.blue,
        overflow: 'hidden',
        position: 'relative'
    },
    avatarImage: {
        width: '120%',
        height: '120%',
        position: 'absolute',
        top: -3,
        left: -4
    },
    modalOverlay: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: '#00000070',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    modalContainer: {
        position: 'relative',
        width: 300,
        minHeight: 100,
        backgroundColor: 'white',
        zIndex: 50,
        borderRadius: 16,
    },
    modalHeader: {
        borderBottomWidth: 1,
        borderColor: '#3372F980',
        paddingBottom: 22,
    },
    modalTitle: {
        fontFamily: Fonts.comfortaa700,
        fontSize: 17,
        position: 'relative',
        top: 10,
        left: 10,
        color: Colors.blue,
    },
    closeButton: {
        width: 30,
        height: 30,
        position: 'absolute',
        top: 7,
        right: 7,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeIcon: {
        width: '70%',
        height: '70%',
        resizeMode: 'contain',
    },
    avatarsContainer: {
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        flexWrap: 'wrap',
        gap: 5
    },
    avatarOption: {
        width: 50,
        height: 50,
        borderRadius: 50,
        overflow: 'hidden',
        position: 'relative'
    },
    avatarOptionImage: {
        width: '120%',
        height: '120%',
        // resizeMode: 'center',
        position: 'absolute',
        top: -2,
        left: -5
    },
});
