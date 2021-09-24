import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, ScrollView, Text, Button, ActivityIndicator, Alert, TextInput, KeyboardAvoidingView, FlatList } from "react-native";
import { Formik } from "formik";
import Input from "../../../components/Input";
import Label from "../../../components/Label";
import { useDispatch } from "react-redux";
import * as vocableActions from "../../../store/actions/vocables";
import Colors from "../../../constants/Colors";
import * as yup from "yup";
import DefaultValues from "../../../constants/DefaultValues";
import GlobalStyles from "../../../constants/GlobalStyles";
import * as environments from "../../../environments/env";
import algoliasearch from "algoliasearch/lite";
import SearchHits from "../../../components/SearchHits";
import { Translation } from "../../../i18n/translation";

import { useTranslation } from "react-i18next";

const TAG = "[AddVocable Screen]: "; // Console Log Tag

const AddVocableScreen = props => {
    const { t } = useTranslation();
    // States
    const [hasError, setHasError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [searchedEnglishWords, setSearchedEnglishWords] = useState({});
    const [searchedGermanWords, setSearchedGermanWords] = useState({});

    const yupSchema = yup.object({
        wordENG: yup.string(t("wordENGMustBeAString")).required(t("wordENGIsRequired")),
        wordDE: yup.string(t("wordDEMustBeAString")).required(t("wordDEIsRequired")),
    });

    const secondInput = useRef();

    // Redux dispatch
    const dispatch = useDispatch();

    // Basic Variables for AlgoliaSearch
    const searchClient = algoliasearch(environments.algoliaSearchAppID, environments.algoliaSearchApiKey);
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
                        hitsPerPage: 3,
                        restrictSearchableAttributes: ["english"],
                    })
                    .then(hits => {
                        setSearchedEnglishWords(hits);
                    });
                break;

            case "de":
                await searchIndex
                    .search(letters, {
                        hitsPerPage: 3,
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
            Alert.alert(t("anErrorOccurred"), hasError, [{ text: t("okay") }]);
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
                        <Input
                            title={t("english")}
                            onBlur={formikProps.handleBlur("wordENG")}
                            placeholder={t("enterTheEnglishWord")}
                            onChangeText={value => {
                                formikProps.setFieldValue("wordENG", value);
                                searchVocable(value, "en");
                            }}
                            value={formikProps.values.wordENG}
                            editable={!isLoading}
                            onSubmitEditing={() => {
                                secondInput.current.focus();
                            }}
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
                                            if (!formikProps.values.wordDE) {
                                                formikProps.setFieldValue("wordDE", complementaryWord);
                                            }

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
                        <View style={styles.placeholder} />
                        <Input
                            title={t("german")}
                            onBlur={formikProps.handleBlur("wordDE")}
                            placeholder={t("enterTheGermanWord")}
                            onChangeText={value => {
                                formikProps.setFieldValue("wordDE", value);
                                searchVocable(value, "de");
                            }}
                            value={formikProps.values.wordDE}
                            editable={!isLoading}
                            ref={secondInput}
                            onSubmitEditing={formikProps.handleSubmit}
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
                                            if (!formikProps.values.wordENG) {
                                                formikProps.setFieldValue("wordENG", complementaryWord);
                                            }
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

                        {isLoading ? <ActivityIndicator size="small" color={Colors.grey} /> : <Button title={t("addButton")} onPress={formikProps.handleSubmit} />}
                    </View>
                )}
            </Formik>
        </KeyboardAvoidingView>
    );
};

export const AddVocableScreenOptions = navigationData => {
    return {
        title: <Translation name="addVocable" />,
    };
};

const styles = StyleSheet.create({
    form: {
        margin: 15,
    },
    placeholder: {
        marginVertical: 15
    }
});

export default AddVocableScreen;
