import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Text, Button, ActivityIndicator } from "react-native";
import { Formik } from "formik";
import Input from "../../components/Input";
import Label from "../../components/Label";
import { useDispatch } from "react-redux";
import * as vocableActions from "../../store/actions/vocables";
import Colors from '../../constants/Colors';

const AddVocableScreen = props => {
    // States
    const [hasError, setHasError] = useState("");
    const [isLoading, setIsLoading] = useState(false);


    // Redux dispatch
    const dispatch = useDispatch();

    return (
        <ScrollView>
            <View style={styles.form}>
                <Formik initialValues={{ wordENG: "", wordDE: "" }} onSubmit={ async (values) => {
                    // Submit button pressed
                    setIsLoading(true);
                    try {
                        await dispatch(vocableActions.addVocable(values.wordENG, values.wordDE, false));
                        props.navigation.goBack();
                    } catch (error) {
                        setHasError(error.message ? error : error.message);
                    }
                    setIsLoading(false);
                }}>
                    {(formikProps) => (
                        <View>
                            <Label title="English:" />
                            <Input placeholder="Enter the english Word" onChangeText={formikProps.handleChange("wordENG")} value={formikProps.values.wordENG} disabled={isLoading ? false : true} />
                            
                            <Label title="German:" />
                            <Input placeholder="Enter the german Word" onChangeText={formikProps.handleChange("wordDE")} value={formikProps.values.wordDE} disabled={isLoading ? false : true} />
                            
                            {isLoading ? <ActivityIndicator size="small" color={Colors.grey} /> : <Button title="Submit" onPress={formikProps.handleSubmit} /> }
                        </View>
                    )}
                </Formik>
            </View>
        </ScrollView>
    )
};

AddVocableScreen.navigationOptions = navigationData => {
    return {
        title: "Add Vocable",
    }
};

const styles = StyleSheet.create({
    form: {
        margin: 15
    }
});

export default AddVocableScreen;