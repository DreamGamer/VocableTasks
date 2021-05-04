import React, { useEffect, useState } from "react";
import { StyleSheet, View, ScrollView, Text, Button, ActivityIndicator, Alert, TextInput, KeyboardAvoidingView } from "react-native";
import { Formik } from "formik";
import Input from "../../../components/Input";
import Label from "../../../components/Label";
import { useDispatch } from "react-redux";
import * as vocableActions from "../../../store/actions/vocables";
import Colors from "../../../constants/Colors";
import * as yup from "yup";
import DefaultValues from "../../../constants/DefaultValues";
import GlobalStyles from "../../../constants/GlobalStyles";

import firestore from "@react-native-firebase/firestore";
import Bugsnag from "@bugsnag/react-native";
import algoliasearch from "algoliasearch/lite";
import { FlatList } from "react-native-gesture-handler";
import SearchHits from "../../../components/SearchHits";

// Import Translation function
import I18n from "../../../i18n/translation";

const TAG = "[AddVocable Screen]: "; // Console Log Tag

const yupSchema = yup.object({
    wordENG: yup.string(I18n.t("wordENGMustBeAString")).required(I18n.t("wordENGIsRequired")),
    wordDE: yup.string(I18n.t("wordDEMustBeAString")).required(I18n.t("wordDEIsRequired")),
});

const AddVocableScreen = props => {
    // States
    const [hasError, setHasError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [searchedEnglishWords, setSearchedEnglishWords] = useState({});
    const [searchedGermanWords, setSearchedGermanWords] = useState({});

    // Redux dispatch
    const dispatch = useDispatch();

    // Basic Variables for AlgoliaSearch
    const searchClient = algoliasearch("4U9EIYQLBO", "c51b0fe694b15d3608b34d07ad4fd8ab");
    const searchIndex = searchClient.initIndex("VocableTasks");

    const searchVocable = async (letters, lang) => {
        if (!letters) {
            setSearchedEnglishWords({});
            setSearchedGermanWords({});
            return;
        }

        switch (lang) {
            case "en":
                await searchIndex
                    .search(letters, {
                        hitsPerPage: 5,
                        restrictSearchableAttributes: ["english"],
                    })
                    .then(hits => {
                        setSearchedEnglishWords(hits);
                    });
                break;

            case "de":
                await searchIndex
                    .search(letters, {
                        hitsPerPage: 5,
                        restrictSearchableAttributes: ["german"],
                    })
                    .then(hits => {
                        setSearchedGermanWords(hits);
                    });
                break;
        }
    };

    useEffect(() => {
        if (hasError) {
            Alert.alert("An error occured!", hasError.message, [{ text: "Okay" }]);
        }
    }, [hasError]);

    return (
        <KeyboardAvoidingView ehavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.form}>
            <Formik
                initialValues={{ wordENG: "", wordDE: "" }}
                validationSchema={yupSchema}
                onSubmit={async (values, actions) => {
                    // Submit button pressed
                    setIsLoading(true);
                    try {
                        await dispatch(vocableActions.addVocable(values.wordENG, values.wordDE, false));
                        actions.resetForm();
                        props.navigation.goBack();
                    } catch (error) {
                        setHasError(error);
                    }
                    setIsLoading(false);
                }}>
                {formikProps => (
                    <View>
                        <Label title={I18n.t("english") + ":"} />
                        <Input
                            onBlur={formikProps.handleBlur("wordENG")}
                            placeholder={I18n.t("enterTheEnglishWord")}
                            onChangeText={value => {
                                formikProps.setFieldValue("wordENG", value);
                                searchVocable(value, "en");
                            }}
                            value={formikProps.values.wordENG}
                            editable={isLoading ? false : true}
                        />
                        <FlatList
                            data={searchedEnglishWords.hits}
                            renderItem={item => (
                                <View>
                                    <SearchHits
                                        word={item.item.english}
                                        secondWord={item.item.german}
                                        onPress={(choosedWord, complementaryWord) => {
                                            formikProps.setFieldValue("wordENG", choosedWord);
                                            formikProps.setFieldValue("wordDE", complementaryWord);
                                            setSearchedEnglishWords({});
                                            setSearchedGermanWords({});
                                        }}
                                    />
                                </View>
                            )}
                            keyExtractor={(item, index) => item.objectID}
                            keyboardShouldPersistTaps="handled"
                        />

                        {formikProps.errors.wordENG && formikProps.touched.wordENG ? <Text style={GlobalStyles.errorText}>{formikProps.errors.wordENG}</Text> : null}

                        <Label title={I18n.t("german") + ":"} />
                        <Input
                            onBlur={formikProps.handleBlur("wordDE")}
                            placeholder={I18n.t("enterTheGermanWord")}
                            onChangeText={value => {
                                formikProps.setFieldValue("wordDE", value);
                                searchVocable(value, "de");
                            }}
                            value={formikProps.values.wordDE}
                            editable={isLoading ? false : true}
                        />

                        <FlatList
                            data={searchedGermanWords.hits}
                            renderItem={item => (
                                <View>
                                    <SearchHits
                                        word={item.item.german}
                                        secondWord={item.item.english}
                                        onPress={(choosedWord, complementaryWord) => {
                                            formikProps.setFieldValue("wordDE", choosedWord);
                                            formikProps.setFieldValue("wordENG", complementaryWord);
                                            setSearchedGermanWords({});
                                            setSearchedEnglishWords({});
                                        }}
                                    />
                                </View>
                            )}
                            keyExtractor={(item, index) => item.objectID}
                            keyboardShouldPersistTaps="handled"
                        />

                        <Text style={GlobalStyles.errorText}>{formikProps.touched.wordDE && formikProps.errors.wordDE}</Text>

                        {isLoading ? <ActivityIndicator size="small" color={Colors.grey} /> : <Button title="Submit" onPress={formikProps.handleSubmit} />}
                    </View>
                )}
            </Formik>
        </KeyboardAvoidingView>
    );
};

AddVocableScreen.navigationOptions = navigationData => {
    return {
        title: "Add Vocable",
    };
};

const styles = StyleSheet.create({
    form: {
        margin: 15,
    },
});

export default AddVocableScreen;
