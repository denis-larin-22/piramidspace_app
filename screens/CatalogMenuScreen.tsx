import { ActivityIndicator, StatusBar, StyleSheet, Text, View } from "react-native";
import { Colors } from "../theme/colors";
import { useEffect, useState } from "react";
import { ICategory, IProductItem } from "../lib/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppStack";
import CateforiesList from "../components/catalog-menu-screen/CategoriesList";
import CatalogMenuHeader from "../components/catalog-menu-screen/CatalogMenuHeader";
import { getDataCatalogCategories, getDataCatalogList } from "../lib/appDataHandler";

type CatalogMenuScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CatalogMenuScreen'>;

function CatalogMenuScreen({ navigation }: { navigation: CatalogMenuScreenNavigationProp }) {
    const [catalogList, setCatalogList] = useState<IProductItem[] | null>(null);
    const [categoriesList, setCategoriesList] = useState<ICategory[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        getCategoriesAndCatalogList();
    }, []);

    async function getCategoriesAndCatalogList() {
        setIsLoading(true);
        const catalogListData = await getDataCatalogList();
        const categoriesListData = await getDataCatalogCategories();

        setCatalogList(catalogListData);
        setCategoriesList(categoriesListData);

        setIsLoading(false);
    };

    return (
        <View style={styles.wrap}>
            <StatusBar hidden={false} />

            <CatalogMenuHeader backButtonPressHandler={() => navigation.navigate("MainScreen")} />

            {isLoading ?
                <View style={styles.loaderWrap}>
                    <ActivityIndicator
                        color={Colors.blue}
                        size={"large"}
                    />
                </View>
                :
                categoriesList === null ?
                    <Text>Щось пішло не так...</Text>
                    :
                    <CateforiesList
                        categoriesList={categoriesList}
                        catalogList={catalogList}
                        cardPressHandler={(categoryId: string) => {
                            navigation.navigate('CatalogScreen', { activeCategoryId: categoryId });
                        }}
                    />
            }
        </View>
    )
};

export default CatalogMenuScreen;

const styles = StyleSheet.create({
    wrap: {
        marginTop: 20,
        paddingHorizontal: 10
    },
    loaderWrap: {
        width: "100%",
        height: "80%",
        alignItems: "center",
        justifyContent: "center"
    }
});

