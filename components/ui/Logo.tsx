import { Image, ImageProps } from "react-native";

function Logo(props: ImageProps) {
    return (
        <Image
            source={require('../../assets/logo.png')}
            style={[{
                width: 129,
                height: 30,
                resizeMode: 'center',
            }, props.style]}
        />
    )
}

export default Logo;