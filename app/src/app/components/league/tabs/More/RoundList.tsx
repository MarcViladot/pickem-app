import React, {FC} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faChevronLeft, faChevronRight} from '@fortawesome/free-solid-svg-icons';
import {ThemeText} from '../../../common/ThemeText';
import {CommonUtils} from '../../../../utils/CommonUtils';
import {Match, Round} from '../../../../interfaces/league.interface';
import {ThemeView} from '../../../common/ThemeView';
import {format} from 'date-fns';
import styled from 'styled-components/native';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';

interface Props {
    rounds: Round[];
    defaultRoundIndex: number;
}

const RoundList: FC<Props> = ({rounds, defaultRoundIndex}) => {

    const {colors} = useTheme();
    const {i18n} = useTranslation();
    const [showRoundIndex, setShowRoundIndex] = React.useState(defaultRoundIndex === -1 ? 0 : defaultRoundIndex);

    const MatchComponent: FC<{ match: Match }> = ({match}) => (
        <ThemeView style={styles.match}>
            <Image source={{uri: match.teams[0].team.crest}} style={styles.teamCrest}/>
            {match.finished ? (
                <ThemeText style={styles.matchResult}
                           testID={"finalResult"}>{match.teams[0].finalResult} · {match.teams[1].finalResult}</ThemeText>
            ) : (
                <ThemeText style={styles.matchDate}
                           testID={"startDate"}>{format(new Date(match.startDate), 'dd/MM HH:mm')}</ThemeText>
            )}
            <Image source={{uri: match.teams[1].team.crest}} style={styles.teamCrest}/>
        </ThemeView>
    );

    const IconButton = styled.TouchableOpacity<{ disabled: boolean }>`
      opacity: ${props => props.disabled ? '0.5' : '1'};
      border: 1px solid #C7C8CA;
      width: 30px;
      height: 30px;
      justify-content: center;
      align-items: center;
      border-radius: 50px;
    `;

    const incrementRoundIndex = () => {
        setShowRoundIndex(prevState => {
            if (prevState < rounds.length - 1) {
                return prevState + 1;
            }
            return prevState;
        });
    };

    const decrementRoundIndex = () => {
        setShowRoundIndex(prevState => {
            if (prevState > 0) {
                return prevState - 1;
            }
            return prevState;
        });
    };


    return (
        <>
            {rounds.map((round, i) => (
                showRoundIndex === i && (
                    <View key={i}>
                        <View style={styles.roundHeader}>
                            <IconButton activeOpacity={.5} disabled={i === 0} onPress={() => decrementRoundIndex()} testID={'previousButton'}>
                                <FontAwesomeIcon icon={faChevronLeft} color={colors.text} size={16}/>
                            </IconButton>
                            <ThemeText
                                style={{fontSize: 17}}>{CommonUtils.getRoundName(round, i18n.options.lng)}</ThemeText>
                            <IconButton activeOpacity={.5} disabled={i === rounds.length - 1}
                                        onPress={() => incrementRoundIndex()} testID={'nextButton'}>
                                <FontAwesomeIcon icon={faChevronRight} color={colors.text} size={16}/>
                            </IconButton>
                        </View>
                        <View style={styles.matchesContainer}>
                            {round.matches.map((match, j) => <MatchComponent match={match} key={j}/>)}
                        </View>
                    </View>
                )
            ))}
        </>
    );
};

const styles = StyleSheet.create({
    roundHeader: {
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center"
    },
    matchesContainer: {
        paddingTop: 20,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between"
    },
    match: {
        width: "49%",
        marginBottom: 10,
        height: 45,
        borderRadius: 50,
        paddingVertical: 5,
        paddingHorizontal: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    teamCrest: {
        height: 20,
        width: 20,
        resizeMode: "stretch"
    },
    matchResult: {
        fontSize: 12
    },
    matchDate: {
        fontSize: 10
    },
});

export default RoundList;
