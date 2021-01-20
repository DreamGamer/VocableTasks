import { StyleSheet } from "react-native";
import Colors from "./Colors";
import DefaultValues from "./DefaultValues";

export default StyleSheet.create({
    flex1: {
        flex: 1,
    },
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
        justifyContent: "center",
        alignItems: "center",
    },
    screen: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    h1: {
        color: Colors.lightWhite,
        fontSize: 32,
        fontFamily: DefaultValues.fontRegular,
    },
    h2: {
        color: Colors.lightWhite,
        fontSize: 28,
        fontFamily: DefaultValues.fontRegular,
    },
    h3: {
        color: Colors.lightWhite,
        fontSize: 24,
        fontFamily: DefaultValues.fontRegular,
    },
    h4: {
        color: Colors.lightWhite,
        fontSize: 20,
        fontFamily: DefaultValues.fontRegular,
    },
    h5: {
        color: Colors.lightWhite,
        fontSize: 16,
        fontFamily: DefaultValues.fontRegular,
    },
    centerText: {
        textAlign: "center",
    },
});
