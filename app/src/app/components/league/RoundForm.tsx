import React, {FC, useState} from 'react';
import {View, Text, Image, TextInput, StyleSheet, TouchableOpacity} from 'react-native';
import {Match, Round} from '../../interfaces/league.interface';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCheck, faMinus, faPlus} from '@fortawesome/free-solid-svg-icons';
import {Formik} from 'formik';
import {useDispatch, useSelector} from 'react-redux';
import {showApiErrorToast} from '../../actions/utils/showApiErrorToast';
import styled from 'styled-components/native';
import {format} from 'date-fns';
import {StyledButton} from '../common/StyledButton';
import {CreateRoundPredictionDto} from '../../interfaces/round.interface';
import prediction from '../../api/prediction';
import {faCheckSquare, faEdit} from '@fortawesome/free-regular-svg-icons';
import {RootState} from '../../reducers';
import {showSuccessToast} from '../../actions/utils/showSuccessToast';
import {ResponseApiError} from '../../utils/IResponse';

interface Props {
    round: Round;
    canEdit: boolean;
    canSubmit: boolean;
    hasStarted: boolean;
    onSubmit: () => void;
}

interface MatchForm {
    match: Match;
    localTeamPrediction: number;
    awayTeamPrediction: number;
    editing: boolean;
}

interface TextField {
    correct?: boolean;
    finished?: boolean;
    editing?: boolean;
}

interface TouchableOpacityProps {
    disabled: boolean;
}

const RoundForm: FC<Props> = ({round, canEdit, canSubmit, hasStarted, onSubmit}) => {

    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const matchForms: MatchForm[] = round.matches.map((match: Match) => {
        const local = match.predictions[0]?.localTeamResult;
        const away = match.predictions[0]?.awayTeamResult;
        return {
            match,
            localTeamPrediction: local >= 0 ? local : -1,
            awayTeamPrediction: away >= 0 ? away : -1,
            editing: canSubmit
        }
    });
    const totalPoints = round.matches.reduce((acc, match) => acc + (match.predictions[0]?.points || 0), 0)

    const createRoundPrediction = async (data: CreateRoundPredictionDto[]) => {
        setLoading(true);
        const res = await prediction.createRoundPrediction(data);
        setLoading(false);
        if (!res.IsError) {
            dispatch(showSuccessToast('Predictions saved'));
            onSubmit();
        } else {
            dispatch(showApiErrorToast(res));
        }
    }

    const editPrediction = async (matchForm: MatchForm, index: number, setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void) => {
        const ogMatch = round.matches.find(match => match.id === matchForm.match.id);
        const pred = ogMatch.predictions[0];
        if (pred.localTeamResult !== matchForm.localTeamPrediction || pred.awayTeamResult !== matchForm.awayTeamPrediction) {
            setLoading(true);
            const res = await prediction.updatePrediction({
                id: ogMatch.id,
                localTeamResult: matchForm.localTeamPrediction,
                awayTeamResult: matchForm.awayTeamPrediction
            });
            setLoading(false);
            if (!res.IsError) {
                dispatch(showSuccessToast('Prediction saved'));
                setFieldValue(`matches[${index}].editing`, false);
            } else {
                dispatch(showApiErrorToast(res));
            }
        } else {
            setFieldValue(`matches[${index}].editing`, false);
        }
    }

    const PredictionTextField = styled.TextInput<TextField>`
      background-color: #FFF;
      text-align: center;
      color: ${props => props.finished ? props.correct ? '#38b174' : '#FF1E44' : 'black'};
      font-weight: bold;
      font-size: 18px;
      border: 1px solid #A6A6A6;
      margin: ${props => props.finished || !props.editing ? '0' : '0 10px'};
      width: 30px;
      height: 40px;
    `;

    const IconButton = styled.TouchableOpacity<TouchableOpacityProps>`
      opacity: ${props => props.disabled ? '0.5' : '1'};
    `;

    return (
        <View style={{padding: 10, marginBottom: 40}}>
            <Formik initialValues={{matches: matchForms}}
                    validateOnChange={true}
                    validateOnMount={true}
                    validate={(values => {
                        const errors: any = {};
                        const allFilled = values.matches.every((matchForm: MatchForm) => matchForm.localTeamPrediction !== -1 && matchForm.awayTeamPrediction !== -1)
                        if (!allFilled) {
                            errors.matches = 'Please fill all the predictions';
                        }
                        return errors;
                    })}
                    onSubmit={(values) => {
                        const parsedValues: CreateRoundPredictionDto[] = values.matches.map((match: MatchForm) => {
                            return {
                                matchId: match.match.id,
                                localTeamResult: match.localTeamPrediction,
                                awayTeamResult: match.awayTeamPrediction
                            };
                        });
                        createRoundPrediction(parsedValues)
                    }}>
                {({handleChange, values, setFieldValue, handleSubmit, isValid, validateForm}) => (
                    <>
                        <View style={styles.header}>
                            <View>
                                <Text style={styles.roundName}>{round.name}</Text>
                                <Text style={styles.roundDate}>{hasStarted ? 'STARTED ' : 'STARTING '}
                                    AT {format(new Date(round.startingDate), 'dd/MM hh:mm')}</Text>
                            </View>
                            {!canEdit && canSubmit &&
                                <StyledButton style={{width: 100}} activeOpacity={.8} onPress={handleSubmit}
                                              disabled={!isValid || loading} color="accent">
                                    <Text style={styles.buttonText}>Submit</Text>
                                </StyledButton>
                            }
                            {hasStarted && <Text style={styles.totalPointsText}>{totalPoints} pts</Text>}
                        </View>
                        <View style={styles.roundContainer}>
                            {values.matches.map((matchForm: MatchForm, index) => (
                                <View key={index} style={styles.match}>
                                    <View style={styles.matchHeader}>
                                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                            <Text style={styles.matchDate}>
                                                AT {format(new Date(matchForm.match.startDate), 'dd/MM hh:mm')}
                                            </Text>
                                            {matchForm.match.doublePoints &&
                                                <Text style={styles.doublePoints}>x2</Text>}
                                        </View>
                                        {canEdit && !canSubmit && (!matchForm.editing ?
                                                <TouchableOpacity
                                                    onPress={() => setFieldValue(`matches[${index}].editing`, true)}>
                                                    <FontAwesomeIcon icon={faEdit}/>
                                                </TouchableOpacity>
                                                :
                                                <TouchableOpacity
                                                    disabled={loading}
                                                    onPress={() => editPrediction(matchForm, index, setFieldValue)}>
                                                    <FontAwesomeIcon icon={faCheckSquare} color={'#38b174'}/>
                                                </TouchableOpacity>
                                        )}
                                        {matchForm.match.finished &&
                                            <View
                                                style={[styles.predictionPointsContainer, {backgroundColor: matchForm.match.predictions[0]?.correct ? '#38b174' : '#FF1E44'}]}>
                                                <Text
                                                    style={styles.predictionText}>{matchForm.match.predictions[0]?.points || 0} Pts</Text>
                                            </View>
                                        }
                                    </View>
                                    <View style={[styles.teamRow, {marginBottom: 2}]}>
                                        <View style={styles.row}>
                                            <Image source={{uri: matchForm.match.teams[0].team.crest}}
                                                   style={styles.teamCrest}/>
                                            <Text>{matchForm.match.teams[0].team.name}</Text>
                                        </View>
                                        <View style={styles.row}>
                                            {hasStarted ?
                                                (
                                                    <>
                                                        {matchForm.match.finished &&
                                                            <PredictionTextField editable={false}
                                                                                 editing={true}
                                                                                 value={`${matchForm.match.teams[0].finalResult >= 0 ? matchForm.match.teams[0].finalResult : ''}`}/>
                                                        }
                                                        <PredictionTextField editable={false}
                                                                             editing={false}
                                                                             finished={matchForm.match.finished}
                                                                             correct={matchForm.match.teams[0].finalResult === matchForm.localTeamPrediction}
                                                                             value={`${matchForm.localTeamPrediction !== -1 ? matchForm.localTeamPrediction : '-'}`}/>
                                                    </>
                                                )
                                                :
                                                (
                                                    <>
                                                        {matchForm.editing &&
                                                            <IconButton activeOpacity={.6}
                                                                        disabled={matchForm.localTeamPrediction <= 0 || !matchForm.editing}
                                                                        onPress={() => {
                                                                            setFieldValue(`matches[${index}].localTeamPrediction`, matchForm.localTeamPrediction === -1 ? 0 : matchForm.localTeamPrediction - 1);
                                                                        }}>
                                                                <FontAwesomeIcon icon={faMinus} color={'#464646'}
                                                                                 size={12}/>
                                                            </IconButton>
                                                        }
                                                        <PredictionTextField editable={false}
                                                                             editing={matchForm.editing}
                                                                             value={`${matchForm.localTeamPrediction !== -1 ? matchForm.localTeamPrediction : '-'}`}/>
                                                        {matchForm.editing &&
                                                            <IconButton disabled={!matchForm.editing}
                                                                        activeOpacity={.6} onPress={() => {
                                                                setFieldValue(`matches[${index}].localTeamPrediction`, matchForm.localTeamPrediction === -1 ? 0 : matchForm.localTeamPrediction + 1);
                                                            }}>
                                                                <FontAwesomeIcon icon={faPlus} color={'#464646'}
                                                                                 size={12}/>
                                                            </IconButton>
                                                        }
                                                    </>
                                                )
                                            }
                                        </View>
                                    </View>
                                    <View style={styles.teamRow}>
                                        <View style={styles.row}>
                                            <Image source={{uri: matchForm.match.teams[1].team.crest}}
                                                   style={styles.teamCrest}/>
                                            <Text>{matchForm.match.teams[1].team.name}</Text>
                                        </View>
                                        <View style={styles.row}>
                                            {hasStarted ?
                                                (
                                                    <>
                                                        {matchForm.match.finished &&
                                                            <PredictionTextField editable={false}
                                                                                 editing={true}
                                                                                 value={`${matchForm.match.teams[1].finalResult >= 0 ? matchForm.match.teams[1].finalResult : ''}`}/>
                                                        }
                                                        <PredictionTextField editable={false}
                                                                             editing={false}
                                                                             finished={matchForm.match.finished}
                                                                             correct={matchForm.match.teams[1].finalResult === matchForm.awayTeamPrediction}
                                                                             value={`${matchForm.awayTeamPrediction !== -1 ? matchForm.awayTeamPrediction : '-'}`}/>
                                                    </>
                                                )
                                                :
                                                (
                                                    <>
                                                        {matchForm.editing &&
                                                            <IconButton activeOpacity={.6}
                                                                        disabled={matchForm.awayTeamPrediction <= 0 || !matchForm.editing}
                                                                        onPress={() => {
                                                                            setFieldValue(`matches[${index}].awayTeamPrediction`, matchForm.awayTeamPrediction === -1 ? 0 : matchForm.awayTeamPrediction - 1);
                                                                        }}>
                                                                <FontAwesomeIcon icon={faMinus} color={'#464646'}
                                                                                 size={12}/>
                                                            </IconButton>
                                                        }
                                                        <PredictionTextField editable={false}
                                                                             editing={matchForm.editing}
                                                                             value={`${matchForm.awayTeamPrediction !== -1 ? matchForm.awayTeamPrediction : '-'}`}/>
                                                        {matchForm.editing &&
                                                            <IconButton disabled={!matchForm.editing} activeOpacity={.6}
                                                                        onPress={() => {
                                                                            setFieldValue(`matches[${index}].awayTeamPrediction`, matchForm.awayTeamPrediction === -1 ? 0 : matchForm.awayTeamPrediction + 1);
                                                                        }}>
                                                                <FontAwesomeIcon icon={faPlus} color={'#464646'}
                                                                                 size={12}/>
                                                            </IconButton>
                                                        }
                                                    </>
                                                )
                                            }
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </>
                )}
            </Formik>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        padding: 7,
        backgroundColor: '#fff',
        marginBottom: 10,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },
    roundName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5
    },
    roundDate: {
        fontSize: 13,
        color: '#A6A6A6'
    },
    roundContainer: {
        padding: 7,
        paddingBottom: -5,
        backgroundColor: '#fff',
    },
    matchHeader: {
        padding: 7,
        marginBottom: 2,
        backgroundColor: '#F4F4F4',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    predictionPointsContainer: {
        padding: 2,
        marginRight: 7,
        width: 50,
        alignItems: 'center'
    },
    predictionText: {
        color: '#FFF',
        fontSize: 10
    },
    matchDate: {
        fontSize: 12,
        color: '#000'
    },
    match: {
        marginBottom: 12,
    },
    teamRow: {
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        backgroundColor: '#F4F4F4'
    },
    teamCrest: {
        width: 30,
        height: 30,
        marginRight: 10
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    buttonText: {
        fontSize: 17,
        color: '#FFF',
    },
    totalPointsText: {
        fontSize: 20,
        color: '#000',
        marginRight: 5,
    },
    doublePoints: {
        color: '#144fff',
        marginLeft: 10
    }
})

export default RoundForm;
