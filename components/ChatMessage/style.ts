import { StyleSheet } from "react-native";
import Colors  from "../../constants/Colors";

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    messageBox: {
        marginRight: 50,
        borderRadius: 15,
        padding: 10,
    },
    name: {
        color: Colors.light.tint,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    message: {

    },
    time: {
        alignSelf: 'flex-end',
        color: 'grey',
    }
})

export default styles; 