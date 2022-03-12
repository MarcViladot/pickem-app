import React, {FC} from 'react';
import {View} from 'react-native';
import {createStackNavigator, StackNavigationProp} from '@react-navigation/stack';
import {DrawerStackParamList} from '../DrawerNavigator';
import {RouteProp} from '@react-navigation/native';
import {TitleHeader} from '../user/SettingsScreen';
import AddHomeScreen from './AddHomeScreen';
import JoinGroupScreen from './JoinGroupScreen';
import CreateGroupScreen from './CreateGroupScreen';
import AddLeagueTypeScreen from './AddLeagueTypeScreen';
import {Group, LeagueType, UserGroup} from '../../interfaces/user.interface';
import SelectGroupScreen from './SelectGroupScreen';

type ScreenNavigationProps = StackNavigationProp<DrawerStackParamList, "Add">;
type ScreenRouteProp = RouteProp<DrawerStackParamList, "Add">;

interface Props {
    navigation: ScreenNavigationProps;
    route: ScreenRouteProp;
}

export type AddStackParamList = {
    AddHome: undefined;
    JoinGroup: undefined;
    CreateGroup: undefined;
    AddLeagueType: {
        group: Group;
        leagueTypes: LeagueType[];
    },
    SelectGroup: {
        groups: UserGroup[];
    }
};
const AddStack = createStackNavigator<AddStackParamList>();

const AddScreen: FC<Props> = () => {
    return (
        <View style={{height: '100%'}}>
            <AddStack.Navigator screenOptions={{
                animationTypeForReplace: "pop",
                headerShown: true,
                header: (props) => <TitleHeader {...props} />
            }} initialRouteName={"AddHome"}>
                <AddStack.Screen name={"AddHome"} component={AddHomeScreen}/>
                <AddStack.Screen name={"JoinGroup"} component={JoinGroupScreen}/>
                <AddStack.Screen name={"CreateGroup"} component={CreateGroupScreen}/>
                <AddStack.Screen name={"AddLeagueType"} component={AddLeagueTypeScreen}/>
                <AddStack.Screen name={"SelectGroup"} component={SelectGroupScreen}/>
            </AddStack.Navigator>
        </View>
    );
};

export default AddScreen;
