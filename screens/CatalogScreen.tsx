import { FlatList, View } from "react-native";
import { Colors } from "../theme/colors";
import CatalogItem from "../components/catalog-screen/CatalogItem";
import { catalogList } from "../lib/catalog-list";
import Logo from "../components/ui/Logo";

function CatalogScreen() {
    return (
        <View
            style={{
                marginTop: 50,
                paddingBottom: 50,
                backgroundColor: Colors.pale,
                height: '100%'
            }}
        >
            <View
                style={{
                    marginTop: 15,
                    marginBottom: 30,
                }}
            >
                <Logo />
            </View>
            <FlatList
                data={catalogList}
                horizontal={false}
                numColumns={2}
                keyExtractor={(product) => product.id.toString()}
                columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 10 }}
                contentContainerStyle={{ paddingHorizontal: 15 }}
                renderItem={({ item }) => (
                    <CatalogItem
                        product={item}
                    />
                )}

            />
        </View>
    )
};

export default CatalogScreen;