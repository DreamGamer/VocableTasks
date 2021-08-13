import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View, Text, Button, RefreshControl, Alert, TouchableOpacity, ActivityIndicator, FlatList } from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useDispatch, useSelector } from "react-redux";
import HeaderButton from "../../../components/HeaderButton";
import Card from "../../../components/Card";
import * as vocableActions from "../../../store/actions/vocables";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../../constants/Colors";
import DefaultValues from "../../../constants/DefaultValues";
import GlobalStyles from "../../../constants/GlobalStyles";
import * as authActions from "../../../store/actions/auth";
import I18n from "../../../i18n/translation";

const VocabularysScreen = props => {
    // States
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState("");
    const [isRefreshing, setIsRefreshing] = useState(false);
    const endReached = useSelector(state => state.vocables.endReached);
    const idToken = useSelector(state => state.auth.idToken);

    // Get Vocables
    const vocables = useSelector(state => state.vocables.vocables).sort(function (a, b) {
        if (a.wordENG < b.wordENG) {
            return -1;
        }
        if (a.wordENG > b.wordENG) {
            return 1;
        }
        return 0;
    });

    // Redux Dispatch
    const dispatch = useDispatch();

    const loadVocables = useCallback(async () => {
        if (isRefreshing) return;
        setIsRefreshing(true);
        setHasError("");

        try {
            await dispatch(vocableActions.fetchVocables());
            setIsLoading(false);
        } catch (error) {
            setHasError(error);
        }

        setIsRefreshing(false);
    }, [setHasError, setIsRefreshing, setIsLoading, dispatch]);

    useEffect(() => {
        let isMounted = true;
        if (isMounted && !isLoading) {
            setIsLoading(true);
            loadVocables();
        }

        return () => {
            isMounted = false;
        };
    }, [loadVocables]);

    /*
    useEffect(() => {
        const willFocusListener = props.navigation.addListener("willFocus", loadVocables);
        return () => {
            willFocusListener.remove();
        };
    }, [loadVocables]);
    */

    const handleLongPress = id => {
        Alert.alert(I18n.t("areYouSure"), I18n.t("doYouReallyWantToDeleteThisVocable"), [
            { text: "No", style: "default" },
            {
                text: "Yes",
                style: "destructive",
                onPress: async () => {
                    setHasError("");
                    try {
                        await dispatch(vocableActions.deleteVocable(id));
                    } catch (error) {
                        setHasError(error);
                    }
                },
            },
        ]);
    };

    if (isLoading) {
        return (
            <View>
                <ActivityIndicator size="large" color={Colors.ActivityIndicatorDark} />
            </View>
        );
    }

    if (vocables.length === 0) {
        return (
            <View style={GlobalStyles.screen}>
                <Text style={GlobalStyles.centerText}>{I18n.t("noVocablesFoundMaybeStartAddSome")}</Text>
            </View>
        );
    }

    if (hasError) {
        return (
            <View style={GlobalStyles.screen}>
                <Text style={styles.text}>{I18n.t("anErrorOccurred")}</Text>
                <Text style={styles.text}>
                    {I18n.t("error")}: {hasError.message ? hasError.message : hasError}
                </Text>
                <Button title="Refresh" onPress={loadVocables} />
            </View>
        );
    }

    return (
        <View style={GlobalStyles.flex1}>
            <FlatList
                showsVerticalScrollIndicator={false}
                contentContainerStyle={GlobalStyles.flexGrow1}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={() => {
                            console.log("onRefresh loadVocable");
                            loadVocables();
                        }}
                    />
                }
                data={vocables}
                keyExtractor={vocable => vocable.id}
                onEndReached={() => {
                    if (!isRefreshing && !endReached) {
                        loadVocables();
                    }
                }}
                renderItem={vocable => (
                    <TouchableOpacity
                        onPress={() => {
                            props.navigation.navigate("editVocable", { vocable: vocable.item });
                        }}
                        onLongPress={() => {
                            handleLongPress(vocable.item.id);
                        }}>
                        <Card style={styles.cardStyle}>
                            <View style={styles.part1}>
                                <Text style={styles.vocableText}>{vocable.item.wordENG}</Text>
                                <Text style={styles.vocableText}>{vocable.item.wordDE}</Text>
                            </View>
                            <View style={styles.part2}>
                                <Ionicons name={vocable.item.known ? "md-checkmark-circle" : "md-close-circle"} size={23} color={vocable.item.known ? Colors.success : Colors.danger} />
                            </View>
                        </Card>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

export const VocabularysScreenOptions = navigationData => {
    return {
        title: I18n.t("vocabulary"),
        headerLeft: () => (
            // HeaderButton to toggle the Drawer
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item
                    title="Menu"
                    iconName="ios-menu"
                    onPress={() => {
                        navigationData.navigation.toggleDrawer();
                    }}
                />
            </HeaderButtons>
        ),
        headerRight: () => (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item
                    title="Add"
                    iconName="md-add"
                    onPress={() => {
                        navigationData.navigation.navigate("addVocable");
                    }}
                />
            </HeaderButtons>
        ),
    };
};

const styles = StyleSheet.create({
    cardStyle: {
        flexDirection: "row",
    },
    part1: {
        width: "90%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    part2: {
        width: "10%",
        justifyContent: "center",
        alignItems: "center",
    },
    vocableText: {
        fontFamily: DefaultValues.fontRegular,
        fontSize: 16,
    },
    text: {
        fontFamily: DefaultValues.fontRegular,
    },
});

export default VocabularysScreen;
