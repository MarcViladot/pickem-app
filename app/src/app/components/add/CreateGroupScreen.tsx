import React, {FC} from 'react';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {AddStackParamList} from './AddScreen';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useDispatch} from 'react-redux';
import group from '../../api/group';
import {showSuccessToast} from '../../actions/utils/showSuccessToast';
import {showApiErrorToast} from '../../actions/utils/showApiErrorToast';
import * as Yup from 'yup';
import {ThemeText} from '../common/ThemeText';
import {Formik} from 'formik';
import {StyledTextField} from '../common/StylesTextField';
import {StyledButton} from '../common/StyledButton';
import {CreateGroupDto} from '../../interfaces/group.interface';
import ButtonGroup, {IGroupButton} from '../common/ButtonGroup';
import league from '../../api/league';
import GroupApi from '../../api/group';
import {Group, LeagueType} from '../../interfaces/user.interface';

type ScreenNavigationProps = StackNavigationProp<AddStackParamList, "CreateGroup">;
type ScreenRouteProp = RouteProp<AddStackParamList, "CreateGroup">;

interface Props {
    navigation: ScreenNavigationProps;
    route: ScreenRouteProp;
}

const CreateGroupScreen: FC<Props> = ({navigation}) => {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const [loading, setLoading] = React.useState(false);

    const createGroup = async (data: CreateGroupDto) => {
        setLoading(true);
        const res = await GroupApi.create(data);
        if (!res.IsError) {
            getLeagueTypes(res.Result)
        } else {
            setLoading(false);
            dispatch(showApiErrorToast(res));
        }
    }

    const getLeagueTypes = async (group: Group) => {
        const res = await league.getLeagueTypes();
        if (!res.IsError) {
            navigation.navigate('AddLeagueType', {group, leagueTypes: res.Result});
        } else {
            setLoading(false);
            dispatch(showApiErrorToast(res));
            navigation.goBack();
        }
        setLoading(false);
    }

    const createSchema = Yup.object({
        name: Yup
            .string()
            .required(),
        private: Yup
            .boolean()
            .required()
    });

    const privacyValues: IGroupButton[] = [
        {value: true, viewValue: t('ADD.PRIVATE')},
        {value: false, viewValue: t('ADD.PUBLIC')}
    ]

    return (
        <View style={styles.container}>
            <ThemeText style={styles.mainText}>{t('ADD.CREATE_GROUP')}</ThemeText>
            <Formik
                initialValues={{
                    name: '',
                    private: true
                }}
                validateOnMount={true}
                validationSchema={createSchema}
                onSubmit={values => {
                    createGroup(values);
                }}
            >
                {({handleChange, handleBlur, handleSubmit, setFieldValue, values, isValid}) => (
                    <View style={styles.form}>
                        <StyledTextField
                            onChangeText={handleChange('name')}
                            onBlur={handleBlur('name')}
                            placeholder={t('ADD.GROUP_NAME')}
                            value={values.name}
                            placeholderTextColor={'#B5B9CA'}
                        />
                        <View style={styles.buttonGroupContainer}>
                            <ButtonGroup fullWidth={true} initialValue={true} arrayOptions={privacyValues}
                                         onSelect={value => setFieldValue('private', value)}/>
                        </View>
                        <StyledButton activeOpacity={.8} onPress={handleSubmit} disabled={loading || !isValid}
                                      color="primary">
                            {!loading ? <Text style={styles.buttonText}>{t('ADD.CREATE')}</Text>
                                :
                                <ActivityIndicator size="small" color="#000"/>
                            }
                        </StyledButton>
                    </View>
                )}
            </Formik>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    mainText: {
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 30,
        // marginTop: 60,
    },
    buttonGroupContainer: {
        marginBottom: 20
    },
    form: {
        minWidth: 320,
        width: '70%',
    },
    buttonText: {
        fontSize: 17,
        color: 'white',
    }
});

export default CreateGroupScreen;
