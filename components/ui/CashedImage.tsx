import { Image, ImageStyle, View } from "react-native";
import { useCachedImage } from "../../lib/hooks/useCachedImage";
import { Colors } from "../../theme/colors";
import Loader from "./Loader";

interface CachedImageProps {
    source: string;
    style?: ImageStyle;
}

export const CachedImage = ({ source, style }: CachedImageProps) => {
    const { localUri, isLoading } = useCachedImage(source);

    if (isLoading) {
        return (
            <View style={[{ justifyContent: 'flex-start', alignItems: 'center', paddingTop: 35, backgroundColor: Colors.pale }, style]}>
                <Loader />
            </View>
        )
    };

    if (!localUri) return null;

    return <Image source={{ uri: localUri }} style={style} />;
};