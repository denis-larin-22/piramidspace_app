import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Colors } from "../theme/colors";
import { useEffect, useState } from "react";
import { ICategory, IProductItem } from "../lib/types";
import { fetchCategories, fetchProductsList } from "../lib/api";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppStack";
import CateforiesList from "../components/catalog-menu-screen/CategoriesList";
import CatalogMenuHeader from "../components/catalog-menu-screen/CatalogMenuHeader";

type CatalogMenuScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CatalogMenuScreen'>;

function CatalogMenuScreen({ navigation }: { navigation: CatalogMenuScreenNavigationProp }) {
    const [categoriesList, setCategoriesList] = useState<ICategory[] | null>(null);
    const [catalogList, setCatalogList] = useState<IProductItem[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        async function getCategories() {
            setIsLoading(true);
            const categoriesRes = await fetchCategories();
            const catalogList = await fetchProductsList();


            setCatalogList(catalogList);
            setCategoriesList(categoriesRes);
            setIsLoading(false);
        }

        getCategories();
    }, []);

    return (
        <View style={styles.wrap}>
            <CatalogMenuHeader backButtonPressHandler={() => navigation.navigate("LoginScreen")} />

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
        </View >
    )
};

export default CatalogMenuScreen;

const styles = StyleSheet.create({
    wrap: {
        marginTop: 50,
        paddingHorizontal: 10
    },
    loaderWrap: {
        width: "100%",
        height: "80%",
        alignItems: "center",
        justifyContent: "center"
    }
});

