import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View, Text, Button, RefreshControl, Pressable, Alert, TouchableOpacity, ActivityIndicator } from "react-native";
import { FlatList } from "react-native-gesture-handler";
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

const VocabularysScreen = props => {
    // States
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState("");
    const [isRefreshing, setIsRefreshing] = useState(false);

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
        setHasError("");
        setIsRefreshing(true);

        try {
            await dispatch(vocableActions.fetchVocables());
        } catch (error) {
            setHasError(error.message ? error.message : error);
        }

        setIsRefreshing(false);
    }, [setHasError, setIsRefreshing, setIsLoading, dispatch]);

    useEffect(() => {
        setIsLoading(true);
        loadVocables().then(() => {
            setIsLoading(false);
        });
    }, [dispatch, loadVocables]);

    useEffect(() => {
        const willFocusListener = props.navigation.addListener("willFocus", loadVocables);
        return () => {
            willFocusListener.remove();
        };
    }, [loadVocables]);

    const handleLongPress = id => {
        Alert.alert("Are you sure?", "Do you really want to delete this Vocable?", [
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
                <Text style={GlobalStyles.centerText}>No Vocables found, maybe start add some!</Text>
            </View>
        );
    }

    if (hasError) {
        return (
            <View style={GlobalStyles.screen}>
                <Text style={styles.text}>An error occured!</Text>
                <Text style={styles.text}>Error: {hasError.message ? hasError.message : hasError}</Text>
                <Button title="Refresh" onPress={loadVocables} />
            </View>
        );
    }

    return (
        <View>
            <FlatList
                refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={loadVocables} />}
                data={vocables}
                keyExtractor={vocable => vocable.wordENG}
                renderItem={vocable => (
                    <TouchableOpacity
                        onPress={() => {
                            props.navigation.navigate({ routeName: "editVocable", params: { vocable: vocable.item } });
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

VocabularysScreen.navigationOptions = navigationData => {
    return {
        title: "Vocabulary",
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
                        navigationData.navigation.navigate({ routeName: "addVocable" });
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
