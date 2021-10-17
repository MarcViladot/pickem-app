import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    viewContainer: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    pageContainer: {
        padding: 5,
        flex: 1
    },
    pageContent: {
        width: '100%',
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#FFF',
        padding: 5,
        paddingTop: 0,
    },
    boldText: {
        fontWeight: 'bold'
    },
    row: {
        display: 'flex',
        flexDirection: 'row'
    },
    pageHeader: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        paddingBottom: 1,
        borderBottomColor: '#808080',
    },
    headerTitle: {
        fontSize: 22,
        fontFamily: 'Inter-Light'
    },
    dangerText: {
        color: '#BC1C61',
        textAlign: 'center',
        fontSize: 20,
    },
});
