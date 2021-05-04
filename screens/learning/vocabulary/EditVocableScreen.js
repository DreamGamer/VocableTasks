import React, { useEffect, useState } from "react";
import { StyleSheet, View, ScrollView, Text, Button, ActivityIndicator, Alert, TextInput } from "react-native";
import { Formik } from "formik";
import Input from "../../../components/Input";
import Label from "../../../components/Label";
import { useDispatch } from "react-redux";
import * as vocableActions from "../../../store/actions/vocables";
import Colors from "../../../constants/Colors";
import * as yup from "yup";
import GlobalStyles from "../../../constants/GlobalStyles";

const yupSchema = yup.object({
  wordENG: yup.string().required(),
  wordDE: yup.string().required(),
});

const EditVocableScreen = (props) => {
  // States
  const [hasError, setHasError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (hasError) {
      Alert.alert("An error occured!", hasError.message, [{ text: "Okay" }]);
    }
  }, [hasError]);

  return (
    <ScrollView>
      <View style={styles.form}>
        <Formik
          initialValues={{
            wordENG: props.navigation.getParam("vocable").wordENG ? props.navigation.getParam("vocable").wordENG : "",
            wordDE: props.navigation.getParam("vocable").wordDE ? props.navigation.getParam("vocable").wordDE : "",
          }}
          validationSchema={yupSchema}
          onSubmit={async (values, actions) => {
            // Submit button pressed
            setIsLoading(true);
            try {
              await dispatch(vocableActions.updateVocable(props.navigation.getParam("vocable").id, values.wordENG, values.wordDE));
              actions.resetForm();
              props.navigation.goBack();
            } catch (error) {
              setHasError(error);
            }
            setIsLoading(false);
          }}>
          {(formikProps) => (
            <View>
              <Label title="English:" />
              <Input
                onBlur={formikProps.handleBlur("wordENG")}
                placeholder="Enter the english Word"
                onChangeText={formikProps.handleChange("wordENG")}
                value={formikProps.values.wordENG}
                editable={isLoading ? false : true}
              />
              <Text style={GlobalStyles.errorText}>{formikProps.touched.wordENG && formikProps.errors.wordENG}</Text>

              <Label title="German:" />
              <Input
                onBlur={formikProps.handleBlur("wordDE")}
                placeholder="Enter the german Word"
                onChangeText={formikProps.handleChange("wordDE")}
                value={formikProps.values.wordDE}
                editable={isLoading ? false : true}
              />
              <Text style={GlobalStyles.errorText}>{formikProps.touched.wordDE && formikProps.errors.wordDE}</Text>

              {isLoading ? <ActivityIndicator size="small" color={Colors.grey} /> : <Button title="Change" onPress={formikProps.handleSubmit} />}
            </View>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
};

EditVocableScreen.navigationOptions = (navigationData) => {
  return {
    title: "Edit Vocable",
  };
};

const styles = StyleSheet.create({
  form: {
    margin: 15,
  },
});

export default EditVocableScreen;
