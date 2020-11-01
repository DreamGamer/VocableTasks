import React from "react";
import { StyleSheet, View } from "react-native";


const Card = props => {
    return (
        <View {...props} style={{...styles.container, ...props.style}}>
            {props.children}
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        margin: 10,
        padding: 5,
    }
});

export default Card;