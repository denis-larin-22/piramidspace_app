import {
    Image,
    StyleSheet,
    FlatList,
    View,
    Dimensions,
    ViewToken,
    Pressable,
    Modal,
} from 'react-native';
import { useEffect, useRef, useState } from 'react';
import AnimatedWrapper from '../animation/AnimatedWrapper';
import { getBanners, IBanner } from '../../lib/api/banners';
import { Colors } from '../../theme/colors';

const { width: screenWidth } = Dimensions.get('window');

export function Banner() {
    const [bannersImages, setBannersImages] = useState<IBanner[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const flatListRef = useRef<FlatList<IBanner>>(null);

    useEffect(() => {
        getBanners().then(setBannersImages);
    }, []);

    useEffect(() => {
        if (bannersImages.length === 0) return;

        const interval = setInterval(() => {
            const nextIndex = (currentIndex + 1) % bannersImages.length;
            flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
            setCurrentIndex(nextIndex);
        }, 5000);

        return () => clearInterval(interval);
    }, [currentIndex, bannersImages]);

    const onViewRef = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index ?? 0);
        }
    });

    const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

    if (bannersImages.length === 0) {
        return <View style={[styles.adsContainer, styles.transparent]} />;
    }

    return (
        <AnimatedWrapper style={styles.adsContainer} useScale useOpacity delay={300}>
            <View>
                <FlatList
                    ref={flatListRef}
                    data={bannersImages}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <Pressable style={styles.imageWrapper} onPress={() => setIsModalOpen(true)}>
                            <Image
                                source={{ uri: item.banner_url }}
                                style={styles.bannerImage}
                                resizeMode="contain"
                            />
                        </Pressable>
                    )}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onViewableItemsChanged={onViewRef.current}
                    viewabilityConfig={viewConfigRef.current}
                />
                <View style={styles.pagination}>
                    {bannersImages.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.paginationDot,
                                index === currentIndex && styles.paginationActiveDot,
                            ]}
                        />
                    ))}
                </View>
            </View>

            <FullScreenBanner
                imagesList={bannersImages}
                isOpen={isModalOpen}
                setIsOpen={setIsModalOpen}
            />
        </AnimatedWrapper>
    );
}

function FullScreenBanner({
    imagesList,
    isOpen,
    setIsOpen,
}: {
    imagesList: IBanner[];
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
}) {
    const [currentIndexValue, setCurrentIndexValue] = useState(0);
    const flatListRef = useRef<FlatList<IBanner>>(null);

    const onViewRef = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
        if (viewableItems.length > 0) {
            setCurrentIndexValue(viewableItems[0].index ?? 0);
        }
    });

    const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

    return (
        <Modal visible={isOpen} transparent animationType="slide">
            <View style={styles.modalContainer}>
                <Pressable style={styles.closeButton} onPress={() => setIsOpen(false)}>
                    <Image
                        source={require('../../assets/main-screen/close-icon.png')}
                        style={styles.closeIcon}
                    />
                </Pressable>

                <FlatList
                    ref={flatListRef}
                    data={imagesList}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.fullImageWrapper}>
                            <Image
                                source={{ uri: item.banner_url }}
                                style={styles.fullBannerImage}
                                resizeMode="contain"
                            />
                        </View>
                    )}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onViewableItemsChanged={onViewRef.current}
                    viewabilityConfig={viewConfigRef.current}
                    style={styles.flatList}
                />

                <View style={styles.fullscreenPagination}>
                    {imagesList.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.fullscreenDot,
                                index === currentIndexValue && styles.fullscreenActiveDot,
                            ]}
                        />
                    ))}
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    adsContainer: {
        backgroundColor: Colors.gray,
        width: screenWidth - 40,
        height: 198,
        borderRadius: 8,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    transparent: {
        opacity: 0,
    },
    imageWrapper: {
        width: screenWidth - 40,
        height: 198,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.pale,
    },
    bannerImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    pagination: {
        position: 'absolute',
        bottom: 3,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    paginationDot: {
        width: 5,
        height: 5,
        borderRadius: 10,
        backgroundColor: '#888',
        marginHorizontal: 2,
    },
    paginationActiveDot: {
        backgroundColor: Colors.blue,
        width: 7,
        height: 7,
    },
    modalContainer: {
        position: 'relative',
        height: '100%',
        width: '100%',
        backgroundColor: '#00000090',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    closeButton: {
        width: 30,
        height: 30,
        position: 'absolute',
        top: 40,
        right: 40,
        zIndex: 52,
    },
    closeIcon: {
        width: 30,
        height: 30,
    },
    fullImageWrapper: {
        width: screenWidth - 40,
        height: '100%',
    },
    fullBannerImage: {
        width: '100%',
        height: '100%',
    },
    flatList: {
        backgroundColor: Colors.pale,
        borderRadius: 20,
    },
    fullscreenPagination: {
        position: 'absolute',
        bottom: 30,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.pale,
    },
    fullscreenDot: {
        width: 8,
        height: 8,
        borderRadius: 50,
        marginHorizontal: 4,
        backgroundColor: Colors.gray,
    },
    fullscreenActiveDot: {
        backgroundColor: Colors.blue,
        width: 10,
        height: 10,
    },
});
