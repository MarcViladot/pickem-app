import React, {FC} from 'react';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {AddStackParamList} from './AddScreen';
import {ActivityIndicator, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {StyledTextField} from '../common/StylesTextField';
import {StyledButton} from '../common/StyledButton';
import {Formik} from 'formik';
import {useTranslation} from 'react-i18next';
import * as Yup from 'yup';
import {ThemeText} from '../common/ThemeText';
import group from '../../api/group';
import {useDispatch} from 'react-redux';
import {showSuccessToast} from '../../actions/utils/showSuccessToast';
import {showApiErrorToast} from '../../actions/utils/showApiErrorToast';

type ScreenNavigationProps = StackNavigationProp<AddStackParamList, "JoinGroup">;
type ScreenRouteProp = RouteProp<AddStackParamList, "JoinGroup">;

interface Props {
    navigation: ScreenNavigationProps;
    route: ScreenRouteProp;
}

const JoinGroupScreen: FC<Props> = ({navigation}) => {

    const {t} = useTranslation();
    const dispatch = useDispatch();
    const [loading, setLoading] = React.useState(false);

    const joinGroup = async (code: string) => {
        setLoading(true);
        const res = await group.joinGroup(code);
        if (!res.IsError) {
            dispatch(showSuccessToast(t('ADD.REQUEST_SENT')));
            navigation.goBack();
        } else {
            dispatch(showApiErrorToast(res));
        }
        setLoading(false);
    }

    const joinSchema = Yup.object({
        code: Yup
            .string()
            .required()
    });

    return (
        <View style={styles.container}>
            <ThemeText style={styles.mainText}>{t('ADD.ENTER_INVITATION_CODE')}</ThemeText>
            <Formik
                initialValues={{
                    code: '',
                }}
                validateOnMount={true}
                validationSchema={joinSchema}
                onSubmit={values => {
                    joinGroup(values.code);
                }}
            >
                {({handleChange, handleBlur, handleSubmit, values, isValid}) => (
                    <View style={styles.form}>
                        <StyledTextField
                            onChangeText={handleChange('code')}
                            onBlur={handleBlur('code')}
                            placeholder={t('ADD.INVITATION_CODE')}
                            value={values.code}
                            placeholderTextColor={'#B5B9CA'}
                        />
                        <StyledButton activeOpacity={.8} onPress={handleSubmit} disabled={loading || !isValid}
                                      color="primary">
                            {!loading ? <Text style={styles.buttonText}>{t('ADD.JOIN_GROUP')}</Text>
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
    form: {
        minWidth: 320,
        width: '70%',
    },
    buttonText: {
        fontSize: 17,
        color: 'white',
    }
});

export default JoinGroupScreen;
