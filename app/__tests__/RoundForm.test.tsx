import React from 'react';
import {render} from '../src/app/utils/TestUtils';
import {fireEvent, waitFor} from '@testing-library/react-native';
import RoundForm from '../src/app/components/common/RoundForm';
import {Round, TeamPosition} from '../src/app/interfaces/league.interface';
import prediction from '../src/app/api/prediction';

const mockRound: Round = {
    finished: false,
    id: 0,
    matches: [
        {
            id: 1,
            startDate: '2021-12-22T12:19:16.000Z',
            finished: false,
            doublePoints: false,
            teams: [
                {
                    id: 1,
                    finalResult: null,
                    teamPosition: TeamPosition.LOCAL,
                    team: {
                        id: 1,
                        name: 'Local team',
                        crest: '',
                    }
                },
                {
                    id: 2,
                    finalResult: null,
                    teamPosition: TeamPosition.AWAY,
                    team: {
                        id: 2,
                        name: 'Away team',
                        crest: '',
                    }
                }
            ],
            predictions: []
        }
    ],
    name: '',
    startingDate: '2021-12-22T12:19:16.000Z',
    translationGroup: {
        id: 1,
        groupName: 'round',
        roundNames: [
            {
                id: 1,
                text: 'Jornada',
                lang: 'es',
            },
            {
                id: 2,
                text: 'Round',
                lang: 'en',
            }
        ]
    },
    translationNameExtra: '1',
    visible: true
}

describe('Round form component', () => {

    it('renders correctly', async () => {
        const {toJSON} = await waitFor(() =>
            render(<RoundForm round={mockRound} onlyView={false} canEdit={false} canSubmit={true}
                              onSubmit={() => console.log('123')}
                              hasStarted={false}/>)
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it('should render correctly the round pts if the round has started', async () => {
        const roundWithPredictions = JSON.parse(JSON.stringify(mockRound));
        roundWithPredictions.matches[0].predictions[0] = {
            id: 1,
            localTeamResult: 2,
            awayTeamResult: 2,
            correct: true,
            points: 11,
            userId: 1
        }
        const {findByText} = await waitFor(() =>
            render(<RoundForm round={roundWithPredictions} onlyView={false} canEdit={false} canSubmit={true}
                              onSubmit={() => console.log('123')}
                              hasStarted={true}/>)
        );
        expect(await findByText('11 pts')).toBeTruthy();
    });

    it('should render the submit button if the round has not started', async () => {
        const {findByText} = await waitFor(() =>
            render(<RoundForm round={mockRound} onlyView={false} canEdit={false} canSubmit={true}
                              onSubmit={() => console.log('123')}
                              hasStarted={false}/>)
        );
        expect(await findByText('Submit')).toBeTruthy();
    });

    it('should render the match points if match has finished', async () => {
        const roundWithPredictions = JSON.parse(JSON.stringify(mockRound));
        roundWithPredictions.matches[0].predictions = [{
            id: 1,
            localTeamResult: 2,
            awayTeamResult: 2,
            correct: true,
            points: 11,
            userId: 1
        }]
        roundWithPredictions.matches[0].finished = true;
        const {findByText} = await waitFor(() =>
            render(<RoundForm round={roundWithPredictions} onlyView={false} canEdit={false} canSubmit={true}
                              onSubmit={() => console.log('123')}
                              hasStarted={true}/>)
        );
        expect(await findByText('11 Pts')).toBeTruthy();
    });

    it('should increment prediction on increment button click', async () => {
        const {findByTestId} = await waitFor(() =>
            render(<RoundForm round={mockRound} onlyView={false} canEdit={false} canSubmit={true}
                              onSubmit={() => console.log('123')}
                              hasStarted={false}/>)
        );
        const incrementButton = await findByTestId('IncrementAwayButton');
        const field = await findByTestId('AwayField');
        fireEvent.press(incrementButton);
        expect(field.props.value).toBe('0');
    });

    it('should increment prediction on increment button click', async () => {
        const roundWithPredictions = JSON.parse(JSON.stringify(mockRound));
        roundWithPredictions.matches[0].predictions = [{
            id: 1,
            localTeamResult: 0,
            awayTeamResult: 5,
            correct: true,
            points: 11,
            userId: 1
        }]
        const {findByTestId} = await waitFor(() =>
            render(<RoundForm round={roundWithPredictions} onlyView={false} canEdit={false} canSubmit={true}
                              onSubmit={() => console.log('123')}
                              hasStarted={false}/>)
        );
        const incrementButton = await findByTestId('DecrementAwayButton');
        const field = await findByTestId('AwayField');
        expect(field.props.value).toBe('5');
        fireEvent.press(incrementButton);
        expect(field.props.value).toBe('4');
    });

    it('should render "-" if prediction is not set', async () => {
        const {findByTestId} = await waitFor(() =>
            render(<RoundForm round={mockRound} onlyView={false} canEdit={false} canSubmit={true}
                              onSubmit={() => console.log('123')}
                              hasStarted={false}/>)
        );
        const field = await findByTestId('AwayField');
        expect(field.props.value).toBe('-');
    });

    it('should render prediction if it is set', async () => {
        const roundWithPredictions = JSON.parse(JSON.stringify(mockRound));
        roundWithPredictions.matches[0].predictions = [{
            id: 1,
            localTeamResult: 1,
            awayTeamResult: 123,
            correct: true,
            points: 11,
            userId: 1
        }]
        const {findByTestId} = await waitFor(() =>
            render(<RoundForm round={roundWithPredictions} onlyView={false} canEdit={false} canSubmit={true}
                              onSubmit={() => console.log('123')}
                              hasStarted={false}/>)
        );
        const field = await findByTestId('AwayField');
        expect(field.props.value).toBe('123');
    });

    it('should not call createRoundPredictions if predictions have not been set', async () => {
        const {findByTestId} = await waitFor(() =>
            render(<RoundForm round={mockRound} onlyView={false} canEdit={false} canSubmit={true}
                              onSubmit={() => console.log('123')}
                              hasStarted={false}/>)
        );
        const spyOn = jest.spyOn(prediction, 'createRoundPrediction');
        const submitButton = await findByTestId('SubmitButton');
        fireEvent.press(submitButton);
        expect(spyOn).not.toHaveBeenCalled();
    });

    it('should call createRoundPredictions if predictions have been set', async () => {
        const {findByTestId} = await waitFor(() =>
            render(<RoundForm round={mockRound} onlyView={false} canEdit={false} canSubmit={true}
                              onSubmit={() => console.log('123')}
                              hasStarted={false}/>)
        );
        const spyOn = jest.spyOn(prediction, 'createRoundPrediction');
        const incrementAwayButton = await findByTestId('IncrementAwayButton');
        const incrementLocalButton = await findByTestId('IncrementLocalButton');
        fireEvent.press(incrementAwayButton);
        fireEvent.press(incrementLocalButton);
        const submitButton = await findByTestId('SubmitButton');
        fireEvent.press(submitButton);
        await waitFor(() => expect(spyOn).toHaveBeenCalled());
    });

    it('should render edit button if round is editable and prediction is set', async () => {
        const roundWithPredictions = JSON.parse(JSON.stringify(mockRound));
        roundWithPredictions.matches[0].predictions = [{
            id: 1,
            localTeamResult: 1,
            awayTeamResult: 123,
            correct: true,
            points: 11,
            userId: 1
        }]
        const {findByTestId} = await waitFor(() =>
            render(<RoundForm round={roundWithPredictions} onlyView={false} canEdit={true} canSubmit={false}
                              onSubmit={() => console.log('123')}
                              hasStarted={false}/>)
        );
        const button = await findByTestId('EditButton');
        expect(button).toBeTruthy();
    });

    it('should not render buttons if round is only viewable even if user can edit or submit', async () => {
        const {queryByTestId} = await waitFor(() =>
            render(<RoundForm round={mockRound} onlyView={true} canEdit={true} canSubmit={true}
                              onSubmit={() => console.log('123')}
                              hasStarted={false}/>)
        );
        const submitButton = await queryByTestId('SubmitButton');
        const incrementAwayButton = await queryByTestId('IncrementAwayButton');
        const incrementLocalButton = await queryByTestId('IncrementLocalButton');
        expect(submitButton).toBeFalsy();
        expect(incrementAwayButton).toBeFalsy();
        expect(incrementLocalButton).toBeFalsy();
    });

});
