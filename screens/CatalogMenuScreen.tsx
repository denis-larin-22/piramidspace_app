import { ActivityIndicator, StatusBar, StyleSheet, Text, View } from "react-native";
import { Colors } from "../theme/colors";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppStack";
import CategoriesList from "../components/catalog-menu-screen/CategoriesList";
import CatalogMenuHeader from "../components/catalog-menu-screen/CatalogMenuHeader";
import { useCatalogList } from "../lib/hooks/useCatalogList";
import { useCatalogCategories } from "../lib/hooks/useCatalogCategories";
import BackButton from "../components/ui/BackButton";

type CatalogMenuScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CatalogMenuScreen'>;

function CatalogMenuScreen({ navigation }: { navigation: CatalogMenuScreenNavigationProp }) {
    const { catalogList, isLoading: isCatalogLoading } = useCatalogList();
    const { categoriesList, isLoading: isCategoriesLoading } = useCatalogCategories();

    return (
        <View style={styles.wrap}>
            <StatusBar hidden={true} />

            <CatalogMenuHeader />

            {(isCatalogLoading && isCategoriesLoading) ?
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
                    <CategoriesList
                        categoriesList={categoriesList}
                        catalogList={catalogList}
                        cardPressHandler={(categoryId: string) => {
                            navigation.navigate('CatalogScreen', { activeCategoryId: categoryId });
                        }}
                    />
            }

            <BackButton
                styles={styles.backButton}
                useOpacity
                offsetX={-50}
                delay={400}
                onPressAction={() => navigation.navigate("MainScreen")}
            />
        </View>
    )
};

export default CatalogMenuScreen;

const styles = StyleSheet.create({
    wrap: {
        position: 'relative',
        marginTop: 20,
        paddingHorizontal: 10
    },
    loaderWrap: {
        width: "100%",
        height: "80%",
        alignItems: "center",
        justifyContent: "center"
    },
    backButton: {
        position: 'absolute',
        bottom: 170,
        left: 10,
    }
});

