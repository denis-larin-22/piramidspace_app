import { StyleSheet } from "react-native";
import { Colors } from "../../../../theme/colors";
import { Fonts } from "../../../../theme/fonts";

export const formStyles = StyleSheet.create({
    stepSubtitle: {
        fontFamily: Fonts.comfortaa400,
        fontSize: 16,
        textTransform: "uppercase",
        textAlign: "center",
        color: Colors.gray,
        top: -10
    },
    stepCategory: {
        fontFamily: Fonts.comfortaa700,
        fontSize: 30,
        textTransform: "uppercase",
        marginBottom: 10,
        textAlign: "left",
        color: Colors.blue,
        top: -10
    },
    stepSubCategory: {
        fontFamily: Fonts.comfortaa700,
        fontSize: 16,
        textAlign: 'right',
        color: '#3372F965',
        borderBottomWidth: 2,
        paddingBottom: 5,
        borderColor: Colors.blueLight,
        top: -25,
        marginBottom: -25
    },
    detailsText: {
        marginTop: 5,
        fontFamily: Fonts.comfortaa600,
        fontSize: 16,
        color: Colors.gray,
    },
    selectField: {
        marginTop: 4,
        fontFamily: Fonts.openSans400,
        fontSize: 16,
        color: "black",
        backgroundColor: "white",
        paddingVertical: 9,
        paddingHorizontal: 13,
        borderRadius: 31,
        borderWidth: 2,
    },
    selectFieldInactive: {
        opacity: 0.5,
    },
    arrowIcon: {
        position: "absolute",
        zIndex: 10,
        right: 10,
        bottom: 13,
    },
    dropdownMenu: {
        maxHeight: 321,
        width: "100%",
        backgroundColor: "white",
        borderRadius: 17,
        position: "absolute",
        top: "105%",
        zIndex: 50,
        padding: 8,
        paddingBottom: 4,

        // iOS shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,

        // Android shadow
        elevation: 5,
    },
    loaderContainer: {
        height: '100%',
        alignItems: "center",
        justifyContent: "center",
    },
    scrollModal: {
        maxHeight: 321,
    },
    productItem: {
        paddingTop: 3,
        paddingBottom: 5,
        marginBottom: 5,
        borderRadius: 70,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderColor: Colors.pale,
    },
    productItemText: {
        fontFamily: Fonts.openSans400,
        fontSize: 15,
        color: "black",
    },
    productItemTextWhite: {
        color: "white",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 12,
    },
    inputContainer: {
        width: "47%",
        position: "relative",
    },
    rowLabel: {
        flexDirection: "row",
        alignItems: "center",
    },
    labelNote: {
        fontFamily: Fonts.comfortaa700,
        fontSize: 12,
        color: Colors.blue,
    },
    labelNoteSmall: {
        fontFamily: Fonts.comfortaa700,
        fontSize: 10,
        color: Colors.blue,
    },
    input: {
        marginTop: 4,
        fontFamily: Fonts.openSans400,
        fontSize: 16,
        color: "black",
        backgroundColor: "white",
        paddingVertical: 9,
        paddingHorizontal: 13,
        borderRadius: 31,
        borderWidth: 2,
        position: 'relative',
        zIndex: 10
    },
    borderRed: {
        borderColor: Colors.red,
    },
    unitLabel: {
        fontFamily: Fonts.openSans400,
        fontSize: 16,
        color: Colors.gray,
        position: "absolute",
        bottom: 12,
        right: 10,
        zIndex: 10
    },
    colorContainer: {
        position: "relative",
        marginTop: 12,
    },
    marginTop12: {
        marginTop: 10,
    },
    submitButton: {
        height: 59,
        maxWidth: 180,
        width: "100%",
        borderRadius: 31,
        overflow: "hidden",
        position: "absolute",
        zIndex: -1,
        bottom: -70,
        alignSelf: "center",
    },
    submitButtonBg: {
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    submitButtonText: {
        fontFamily: Fonts.comfortaa600,
        fontSize: 17,
        lineHeight: 22,
        color: "white",
    },
    absentValueText: {
        fontFamily: Fonts.openSans400,
        fontSize: 12,
        lineHeight: 14,
        color: Colors.gray,
        marginLeft: 5
    }
});