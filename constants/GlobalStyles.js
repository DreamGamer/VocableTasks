import { StyleSheet } from "react-native";
import Colors from "./Colors";
import DefaultValues from "./DefaultValues";

export default StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        fontSize: 18,
        //borderRadius: 6,
        backgroundColor: Colors.lightWhite,
        marginVertical: 5,
    },
    inputDisabled: {
        backgroundColor: "#ccc",
    },
    errorText: {
        color: "#ee0000",
        marginTop: 5,
        marginBottom: 10,
        fontFamily: DefaultValues.fontBold,
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    }
});