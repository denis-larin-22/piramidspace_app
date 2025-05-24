import LottieView from "lottie-react-native";

function Loader({ radius = 50 }: { radius?: number }) {
    return (
        <LottieView
            source={require('../../assets/lottie/loader-circle.json')}
            autoPlay
            loop
            style={{ width: radius, height: radius }}
        />
    )
};

export default Loader;

