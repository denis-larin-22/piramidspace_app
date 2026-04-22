import {
    Image,
    StyleSheet,
    FlatList,
    View,
    Dimensions,
    ViewToken,
    Pressable,
    Modal,
    Animated,
    PanResponder,
    Easing
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
                activeBanner={bannersImages[currentIndex]}
                isOpen={isModalOpen}
                setIsOpen={setIsModalOpen}
            />
        </AnimatedWrapper>
    );
}

const SCREEN_HEIGHT = Dimensions.get('window').height;

function FullScreenBanner({
    activeBanner,
    isOpen,
    setIsOpen,
}: {
    activeBanner: IBanner;
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
}) {
    const fixedImageRef = useRef<IBanner | null>(null);

    useEffect(() => {
        if (!fixedImageRef.current) {
            fixedImageRef.current = activeBanner;
            return;
        }
        if (activeBanner.id !== fixedImageRef.current.id) {
            fixedImageRef.current = activeBanner;
        }
    }, [activeBanner]);

    // Берём либо зафиксированное значение, либо текущее (на случай первого рендера)
    const displayImage = fixedImageRef.current ?? activeBanner;

    const translateY = useRef(new Animated.Value(0)).current;

    // PanResponder на Overlay (не на FlatList) для свайпа вверх
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (_, gesture) => {
                const { dx, dy } = gesture;
                // свайп вверх (почти вертикальный)
                return dy < -10 && Math.abs(dy) > Math.abs(dx);
            },
            onPanResponderMove: (_, gesture) => {
                if (gesture.dy < 0) {
                    translateY.setValue(gesture.dy * 0.7);
                }
            },
            onPanResponderRelease: (_, gesture) => {
                const { dy, vy } = gesture;
                const shouldClose = dy < -120 || vy < -0.8;

                if (shouldClose) {
                    Animated.timing(translateY, {
                        toValue: -SCREEN_HEIGHT,
                        duration: 200,
                        easing: Easing.out(Easing.cubic),
                        useNativeDriver: true,
                    }).start(() => {
                        translateY.setValue(0);
                        setIsOpen(false);
                    });
                } else {
                    Animated.timing(translateY, {
                        toValue: 0,
                        duration: 260,
                        easing: Easing.out(Easing.cubic),
                        useNativeDriver: true,
                    }).start();
                }
            },
        })
    ).current;

    if (!isOpen) return null;

    return (
        <Modal
            visible={true}
            transparent
            animationType="none"
        >
            {/* Overlay с PanResponder */}
            <Animated.View
                style={{ flex: 1, transform: [{ translateY }] }}
                {...panResponder.panHandlers}
            >
                <AnimatedWrapper
                    duration={500}
                    useOpacity
                    useScale
                >
                    {/* Кнопка закрытия сверху */}
                    <Pressable
                        style={styles.closeButton}
                        onPress={() => setIsOpen(false)}
                    >
                        <Image
                            source={require('../../assets/main-screen/close-icon.png')}
                            style={styles.closeIcon}
                        />
                    </Pressable>

                    {/* Контент FlatList */}
                    <View style={styles.modalContainer} pointerEvents="box-none">
                        <Image
                            source={{ uri: displayImage.banner_url }}
                            style={styles.fullBannerImage}
                            resizeMode="contain"
                        />
                    </View>


                    <AnimatedWrapper
                        useOpacity
                        offsetY={30}
                        delay={350}
                    >
                        <Image
                            source={require('../../assets/arrow-back.png')}
                            resizeMode='contain'
                            style={{
                                width: 50,
                                height: 50,
                                position: 'absolute',
                                bottom: 15,
                                alignSelf: 'center',
                                transform: [{ rotate: '90deg' }],
                                opacity: 0.1
                            }}
                        />
                    </AnimatedWrapper>
                </AnimatedWrapper>
            </Animated.View>
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
        marginTop: 10,
        backgroundColor: '#00000099',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    closeButton: {
        width: 50,
        height: 50,
        position: 'absolute',
        top: 30,
        right: 20,
        zIndex: 100,
        backgroundColor: '#ffffff90',
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center'
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
