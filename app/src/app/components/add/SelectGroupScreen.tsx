import React, {FC, useState} from 'react';
import {ActivityIndicator, FlatList, Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {AddStackParamList} from './AddScreen';
import {RouteProp, useTheme} from '@react-navigation/native';
import {ThemeText} from '../common/ThemeText';
import {StyledButton} from '../common/StyledButton';
import {useTranslation} from 'react-i18next';
import CheckBox from '@react-native-community/checkbox';
import {Group, LeagueType} from '../../interfaces/user.interface';
import league from '../../api/league';
import {showApiErrorToast} from '../../actions/utils/showApiErrorToast';
import {useDispatch} from 'react-redux';

type ScreenNavigationProps = StackNavigationProp<AddStackParamList, "SelectGroup">;
type ScreenRouteProp = RouteProp<AddStackParamList, "SelectGroup">;

interface Props {
    navigation: ScreenNavigationProps;
    route: ScreenRouteProp;
}


interface GroupProps {
    group: Group;
    onPress: (group: Group) => void;
    loading: boolean;
}

const SelectGroupScreen: FC<Props> = ({route, navigation}) => {

    const dispatch = useDispatch();
    const {t} = useTranslation();
    const {groups} = route.params;
    const [loading, setLoading] = useState(false);

    const onSelectGroup = (group: Group) => {
        setLoading(true);
        getVisibleLeagueTypes(group);
    }

    const getVisibleLeagueTypes = async (group: Group) => {
        const res = await league.getLeagueTypes();
        if (!res.IsError) {
            const groupLeagues = group.leagues.map((league) => league.id);
            const availableLeagues = res.Result.filter((league) => !groupLeagues.includes(league.id));
            navigation.navigate('AddLeagueType', {group, leagueTypes: availableLeagues});
        } else {
            dispatch(showApiErrorToast(res));
        }
        setLoading(false);
    }

    return (
        <View style={styles.listContainer}>
            <ThemeText style={styles.title}>{t('ADD.SELECT_GROUP')}</ThemeText>
            <View style={{flex: 1}}>
                <FlatList data={groups} renderItem={item => <GroupRow group={item.item.group} loading={loading} onPress={onSelectGroup}/>}
                          keyExtractor={item => item.id.toString()}/>
            </View>
        </View>
    );
};

const GroupRow: FC<GroupProps> = ({group, onPress, loading}) => {

    const {colors} = useTheme();

    return (
        <TouchableOpacity onPress={() => onPress(group)} activeOpacity={.5} disabled={loading}
                          style={[styles.leagueRowContainer, {backgroundColor: colors.card}]}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <ThemeText>{group.name}</ThemeText>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    listContainer: {
        padding: 10,
        height: '100%'
    },
    title: {
        marginTop: 10,
        marginBottom: 15,
        fontSize: 15
    },
    leagueRowContainer: {
        borderRadius: 5,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        marginBottom: 10
    }
});

export default SelectGroupScreen;
