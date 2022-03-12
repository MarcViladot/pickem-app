import React, {FC} from 'react';
import {Image, StyleSheet, Text, TouchableOpacityProps, View} from 'react-native';
import {ThemeText} from '../common/ThemeText';
import {useTranslation} from 'react-i18next';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faArrowRight} from '@fortawesome/free-solid-svg-icons';
import {RouteProp, useTheme} from '@react-navigation/native';
import styled from 'styled-components/native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../reducers';
import {Group, User, UserGroup, UserGroupRole} from '../../interfaces/user.interface';
import {StackNavigationProp} from '@react-navigation/stack';
import {AddStackParamList} from './AddScreen';
import GroupApi from '../../api/group';
import league from '../../api/league';
import {showApiErrorToast} from '../../actions/utils/showApiErrorToast';

type ScreenNavigationProps = StackNavigationProp<AddStackParamList, "AddHome">;
type ScreenRouteProp = RouteProp<AddStackParamList, "AddHome">;

interface Props {
    navigation: ScreenNavigationProps;
    route: ScreenRouteProp;
}

const AddHomeScreen: FC<Props> = ({navigation}) => {

    const {colors} = useTheme();
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const currentUser: User = useSelector((state: RootState) => state.user.currentUser);

    const addLeague = () => {
        const adminGroups: UserGroup[] = currentUser.groups.filter((group: UserGroup) => group.userRole === UserGroupRole.ADMIN || group.userRole === UserGroupRole.OWNER);
        if (adminGroups.length > 1) {
            navigation.navigate('SelectGroup', {groups: adminGroups})
        } else if (adminGroups.length === 1) {
            getVisibleLeagueTypes(adminGroups[0].group);
        }
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
    }


    const Title: FC<{ image?: any, title: string }> = ({image, title}) => (
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{flexDirection: 'row'}}>
                {image && <Image source={image} style={styles.headerImage}/>}
                <ThemeText style={styles.containerTitle}>{t(title)}</ThemeText>
            </View>
            <FontAwesomeIcon icon={faArrowRight} color={colors.text} size={12}/>
        </View>
    );

    const Container = styled.TouchableOpacity<TouchableOpacityProps>`
      background-color: ${colors.card};
      margin-bottom: 15px;
      border-radius: 10px;
      padding: 15px 20px 15px 15px;
    `;

    return (
        <View style={{padding: 10, flexGrow: 1, paddingTop: 30}}>
            <View>
                <ThemeText style={styles.headerText}>{t('ADD.ADD_GROUP')}</ThemeText>
                <Container activeOpacity={.5} onPress={() => navigation.navigate('CreateGroup')}>
                    <Title image={require('../../../assets/images/group.png')}
                           title={'ADD.CREATE_GROUP_TITLE'}/>
                    <Text style={styles.containerSubtitle}>{t('ADD.CREATE_GROUP_SUBTITLE')}</Text>
                </Container>
                <Container activeOpacity={.5} onPress={() => navigation.navigate('JoinGroup')}>
                    <Title title={'ADD.JOIN_GROUP_TITLE'}/>
                    <Text style={styles.containerSubtitle}>{t('ADD.JOIN_GROUP_SUBTITLE')}</Text>
                </Container>
                <Container activeOpacity={.5}>
                    <Title image={require('../../../assets/images/world.png')}
                        title={'ADD.RANDOM_GROUP_TITLE'}/>
                    <Text style={styles.containerSubtitle}>{t('ADD.RANDOM_GROUP_SUBTITLE')}</Text>
                </Container>
            </View>
            <View style={{marginTop: 30}}>
                <ThemeText style={styles.headerText}>{t('ADD.ADD_LEAGUE')}</ThemeText>
                <Container activeOpacity={.5} onPress={() => addLeague()} disabled={!currentUser.groups.some((group) => group.userRole === UserGroupRole.ADMIN || group.userRole === UserGroupRole.OWNER)}>
                    <Title title={'ADD.ADD_LEAGUE_TITLE'}/>
                    <Text style={styles.containerSubtitle}>{t('ADD.ADD_LEAGUE_SUBTITLE')}</Text>
                </Container>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerText: {
        fontSize: 15,
        marginBottom: 15
    },
    headerImage: {
        width: 20,
        height: 20,
        marginRight: 10,
        marginTop: -4
    },
    container: {},
    containerTitle: {
        marginBottom: 10,
        fontSize: 16,
    },
    containerSubtitle: {
        color: '#8E8E93',
        fontSize: 14,
    }
})

export default AddHomeScreen;
