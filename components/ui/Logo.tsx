import { Image } from "react-native";

function Logo() {
    return (
        <Image
            source={require('../../assets/logo.png')}
            style={{
                width: 129,
                height: 30,
                resizeMode: 'center'
            }}
        />
    )
}

export default Logo;