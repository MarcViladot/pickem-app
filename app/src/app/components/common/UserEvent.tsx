import React, {FC, useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {UserLeagueEvent} from '../../interfaces/event.interface';
import {format} from 'date-fns';
import {ThemeText} from './ThemeText';
import {useTranslation} from 'react-i18next';

interface Props {
    event: UserLeagueEvent
}

const UserEvent: FC<Props> = ({event}) => {

    const {t} = useTranslation();
    const formattedDate = useMemo(() => format(new Date(event.date), 'dd/MM HH:mm'), [event.date]);

    return (
        <View style={{marginBottom: 15}}>
            <Text style={styles.eventDate}>{formattedDate}</Text>
            <ThemeText style={styles.eventText}>
                <Text style={{fontWeight: 'bold'}}>{event.event.user.name}</Text>
                <Text> {t(`EVENTS.${event.event.type}`)}</Text>
            </ThemeText>
        </View>
    );
};

const styles = StyleSheet.create({
    eventDate: {
        textAlign: 'center',
        fontSize: 12,
        color: 'gray',
        marginBottom: 0
    },
    eventText: {
        textAlign: 'center',
        fontSize: 16,
    }
});

export default UserEvent;
