import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Dimensions, StatusBar, StyleSheet, View } from "react-native";
import { RootStackParamList } from "../navigation/AppStack";
import { Colors } from "../theme/colors";
import { useEffect, useState } from "react";
import { getDataCatalogCategories, getDataCatalogList } from "../lib/appDataHandler";
import Header from "../components/ui/Header";
import Greetings from "../components/main-screen/Greetings";
import RateAndBalance from "../components/main-screen/RateAndBalance";
import ConnectingBar from "../components/main-screen/ConnectingBar";
import NetInfo from '@react-native-community/netinfo';
import NavBar from "../components/main-screen/NavBar";
import { getDataFromAcyncStorage, saveDataToAcyncStorage } from "../lib/async-storage/acyncStorage";
import { ASYNC_STORAGE_USER_INFO_OBJECT, ASYNC_STORAGE_USER_LOGIN, ASYNC_STORAGE_USER_PHONE_NUMBER } from "../lib/async-storage/asyncStorageKeys";
import { getAuth, IUserInfo } from "../lib/api/auth";

export type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "MainScreen">;

function MainScreen({ navigation }: { navigation: HomeScreenNavigationProp }) {
    const { width } = Dimensions.get('window');
    const [userInfo, setUserInfo] = useState<IUserInfo | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [isConnectionBarVissible, setIsConnectionBarVissible] = useState(false);

    // getting main data
    useEffect(() => {
        async function updateUserObjectInfo() {
            const login = await getDataFromAcyncStorage(ASYNC_STORAGE_USER_LOGIN);
            const telNumber = await getDataFromAcyncStorage(ASYNC_STORAGE_USER_PHONE_NUMBER);
            const actualUserInfo = await getAuth(login, telNumber); // get actual user info object

            if (actualUserInfo !== undefined) {
                saveDataToAcyncStorage(ASYNC_STORAGE_USER_INFO_OBJECT, JSON.stringify(actualUserInfo));
                setUserInfo(actualUserInfo);
            } else {
                setUserInfo(null);
            }
        }

        updateUserObjectInfo();

        // getDataFromAcyncStorage(ASYNC_STORAGE_USER_INFO_OBJECT)
        //     .then(result => {
        //         if (result === undefined) {
        //             setUserInfo(null);
        //         } else {
        //             setUserInfo(JSON.parse(result));
        //         }
        //     })
        //     .catch(() => setUserInfo(null));

        getDataCatalogList();
        getDataCatalogCategories();
    }, []);

    // chech internet conection
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(Boolean(state.isConnected));
            setTimeout(() => setIsConnectionBarVissible(true), 2000);
        });

        NetInfo.fetch().then(state => {
            setIsConnected(Boolean(state.isConnected));
        });

        return () => {
            unsubscribe();
        };
    }, []);

    if (userInfo === null) return null;

    return (
        <View style={styles.container}>
            <StatusBar
                hidden={false}
                translucent={true}
                barStyle="dark-content"
                backgroundColor="transparent"
            />

            <View style={styles.content}>
                <ConnectingBar
                    width={width}
                    isConnected={isConnected}
                    isVissible={isConnectionBarVissible}
                />

                <Header style={styles.header} />

                <Greetings
                    userName={userInfo["Имя Фамилия"]}
                    isOnline={isConnected}
                />

                <RateAndBalance />
            </View>

            <NavBar
                navigation={navigation}
                width={width}
            />
        </View>
    );
}

export default MainScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.pale,
        position: 'relative',
    },
    content: {
        padding: 20,
    },
    header: {
        marginTop: 40,
    },
});
