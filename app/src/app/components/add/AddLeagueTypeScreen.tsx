import React, {FC, useState} from 'react';
import {ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {AddStackParamList} from './AddScreen';
import {RouteProp, useTheme} from '@react-navigation/native';
import {LeagueType} from '../../interfaces/user.interface';
import CheckBox from '@react-native-community/checkbox';
import { ThemeText } from '../common/ThemeText';
import {useTranslation} from 'react-i18next';
import {StyledButton} from '../common/StyledButton';
import groupApi from '../../api/group';
import {AddLeagueDto} from '../../interfaces/group.interface';
import {useDispatch} from 'react-redux';
import {showApiErrorToast} from '../../actions/utils/showApiErrorToast';
import {addGroupToUser} from '../../actions/user/addGroupToUser';

type ScreenNavigationProps = StackNavigationProp<AddStackParamList, "AddLeagueType">;
type ScreenRouteProp = RouteProp<AddStackParamList, "AddLeagueType">;

interface Props {
    navigation: ScreenNavigationProps;
    route: ScreenRouteProp;
}

interface SelectedLeagueType extends LeagueType {
    selected: boolean;
}

const AddLeagueTypeScreen: FC<Props> = ({navigation, route}) => {

    const {colors} = useTheme();
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const {group, leagueTypes} = route.params;
    const selectedLeagueTypes: SelectedLeagueType[] = leagueTypes.map((leagueType: LeagueType) => ({
        ...leagueType,
        selected: false
    }));
    const [loading, setLoading] = useState(false);

    const addLeagues = async () => {
        setLoading(true);
        const data: AddLeagueDto = {
            groupId: group.id,
            leagueTypeIds: selectedLeagueTypes.filter(leagueType => leagueType.selected).map(leagueType => leagueType.id)
        }
        const res = await groupApi.addLeagues(data);
        if (!res.IsError) {
            dispatch(addGroupToUser(res.Result));
            navigation.popToTop()
        } else {
            dispatch(showApiErrorToast(res));
        }
        setLoading(false);
    }

    const LeagueRow: FC<{league: SelectedLeagueType}> = ({league}) => {

        const [selected, setSelected] = useState(league.selected);

        const onPress = () => {
            const newValue = !league.selected
            league.selected = newValue;
            setSelected(newValue);
        }

        return (
            <TouchableOpacity onPress={() => onPress()} activeOpacity={.5} style={[styles.leagueRowContainer, {backgroundColor: colors.card}]}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image source={{uri: league.logo}} style={styles.leagueLogo}/>
                <ThemeText>{league.name}</ThemeText>
                </View>
                <CheckBox
                    disabled={false}
                    value={selected}
                    tintColors={{false: 'gray' }}
                    onValueChange={(newValue) => {
                        onPress();
                    }}
                />
            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.listContainer}>
            <ThemeText style={styles.title}>{t('ADD.SELECT_LEAGUES')}</ThemeText>
            <View style={{flex: 1}}>
            <FlatList data={selectedLeagueTypes} renderItem={item => <LeagueRow league={item.item}/>} keyExtractor={item => item.id.toString()} />
            </View>
            <View>
                <StyledButton activeOpacity={.8} onPress={() => addLeagues()} disabled={loading} color="accent">
                    {!loading ? <ThemeText>{t('ADD.ADD_LEAGUES')}</ThemeText>
                        :
                        <ActivityIndicator size="small" color="#000" />
                    }
                </StyledButton>
            </View>
        </View>
    );
};

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
        padding: 10,
        marginBottom: 10
    },
    leagueLogo: {
        width: 25,
        height: 25,
        marginRight: 15,
    }
});

export default AddLeagueTypeScreen;
