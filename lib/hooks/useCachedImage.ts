import { useEffect, useState } from 'react';
import * as FileSystem from 'expo-file-system/legacy';

export const useCachedImage = (url: string) => {
    const [localUri, setLocalUri] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadImage = async () => {
            try {
                const filename = url.split('/').pop() ?? 'image.png';
                const path = FileSystem.cacheDirectory + filename;

                const fileInfo = await FileSystem.getInfoAsync(path);
                if (!fileInfo.exists) {
                    await FileSystem.downloadAsync(url, path);
                }

                setLocalUri(path);
            } catch (error) {
                console.warn('Image caching failed:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadImage();
    }, [url]);

    return { localUri, isLoading };
};