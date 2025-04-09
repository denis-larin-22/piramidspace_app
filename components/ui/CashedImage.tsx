import { ActivityIndicator, Image, ImageStyle, View } from "react-native";
import { useCachedImage } from "../../lib/hooks/useCachedImage";
import { Colors } from "../../theme/colors";

interface CachedImageProps {
    source: string;
    style?: ImageStyle;
    loadingIndicatorSize?: number | 'small' | 'large';
}

export const CachedImage = ({ source, style, loadingIndicatorSize = 'small' }: CachedImageProps) => {
    const { localUri, isLoading } = useCachedImage(source);

    if (isLoading) {
        return (
            <View style={[{ justifyContent: 'center', alignItems: 'center' }, style]}>
                <ActivityIndicator size={loadingIndicatorSize} color={Colors.blue} />
            </View>
        );
    }

    if (!localUri) return null;

    return <Image source={{ uri: localUri }} style={style} />;
};