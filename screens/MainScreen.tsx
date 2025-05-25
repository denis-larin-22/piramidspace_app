import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Dimensions, StatusBar, StyleSheet, View } from "react-native";
import { RootStackParamList } from "../navigation/AppStack";
import { Colors } from "../theme/colors";
import { useEffect, useState } from "react";
import { getDataCatalogCategories, getDataCatalogList } from "../lib/appDataHandler";
import MainHeader from "../components/main-screen/MainHeader";
import BurgerMenu from "../components/main-screen/BurgerMenu";
import Greetings from "../components/main-screen/Greetings";
import RateAndBalance from "../components/main-screen/RateAndBalance";
import ConnectingBar from "../components/main-screen/ConnectingBar";
import NetInfo from '@react-native-community/netinfo';
import NavBar from "../components/main-screen/NavBar";
import { getAuth, IUserInfo } from "../lib/api";
import { getDataFromAcyncStorage } from "../lib/async-storage/acyncStorage";
import { ASYNC_STORAGE_USER_INFO_OBJECT } from "../lib/async-storage/asyncStorageKeys";

export type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "MainScreen">;

function MainScreen({ navigation }: { navigation: HomeScreenNavigationProp }) {
    // Get curren screen width
    const { width } = Dimensions.get('window');

    // User info object
    const [userInfo, setUserInfo] = useState<IUserInfo | null>(null);

    // Get data CASH/API
    useEffect(() => {
        // get user data from async storage
        getDataFromAcyncStorage(ASYNC_STORAGE_USER_INFO_OBJECT)
            .then((result) => {
                if (result === undefined) {
                    setUserInfo(null);
                } else {
                    setUserInfo(JSON.parse(result));
                }
            })
            .catch(() => setUserInfo(null))
        // IMPORTANT! Loading data for further work of the catalog!
        getDataCatalogList(); // loading Catalog list
        getDataCatalogCategories(); // loading Catalog categories list
    }, []);

    // Burger menu
    const [isBurgerOpen, setIsBurgerOpen] = useState<boolean>(false);

    // Connection
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [isConnectionBarVissible, setIsConnectionBarVissible] = useState(false);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            const currentState = Boolean(state.isConnected);
            setIsConnected(currentState);
            setTimeout(() => {
                setIsConnectionBarVissible(true);
            }, 2000);
        });

        // Проверка при первом рендере
        NetInfo.fetch().then(state => {
            const currentState = Boolean(state.isConnected);
            setIsConnected(currentState);
            setTimeout(() => {
                setIsConnectionBarVissible(true);
            }, 1500);
        });

        setTimeout(() => {
            setIsConnectionBarVissible(false);
        }, 5000)

        return () => {
            unsubscribe();
        };
    }, []);

    if (userInfo === null) {
        return null;
    } else {
        return (
            <View
                style={{
                    height: "100%",
                    backgroundColor: Colors.pale,
                    padding: 20,
                    position: 'relative',
                }}
            >
                <StatusBar
                    hidden={false}
                    translucent={true}
                    barStyle="dark-content"
                    backgroundColor="transparent"
                />

                <ConnectingBar
                    width={width}
                    isConnected={isConnected}
                    isVissible={isConnectionBarVissible}
                />

                {/* Top components */}
                <MainHeader
                    setIsBurgerOpen={setIsBurgerOpen}
                />
                <BurgerMenu
                    isOpen={isBurgerOpen}
                    setIsOpen={() => setIsBurgerOpen(!isBurgerOpen)}
                />
                <Greetings
                    userName={userInfo["Имя Фамилия"]}
                    isOnline={isConnected}
                />

                {/* //// */}
                <RateAndBalance />

                <NavBar
                    navigation={navigation}
                    width={width}
                />
            </View>
        );
    }
}

export default MainScreen;












