import {fireEvent, waitFor} from '@testing-library/react-native';
import {render} from '../src/app/utils/TestUtils';
import React from 'react';
import {Round} from '../src/app/interfaces/league.interface';
import RoundList from '../src/app/components/league/tabs/More/RoundList';

describe('Round List component', () => {

    const rounds: Round[] = [
        {
            id: 1,
            name: 'Round 1',
            startingDate: '2021-12-22T12:19:16.506Z',
            finished: false,
            matches: [],
            visible: true,
            translationGroup: {
                id: 1,
                groupName: "Round",
                roundNames: [
                    {
                        id: 1,
                        text: "Round",
                        lang: "en",
                    },
                    {
                        id: 2,
                        text: "Jornada",
                        lang: "es",
                    }
                ]
            },
            translationNameExtra: '1'
        },
        {
            id: 2,
            name: 'Round 2',
            startingDate: '2021-12-22T12:19:16.506Z',
            finished: false,
            matches: [],
            visible: true,
            translationGroup: {
                id: 1,
                groupName: "Round",
                roundNames: [
                    {
                        id: 1,
                        text: "Round",
                        lang: "en",
                    },
                    {
                        id: 2,
                        text: "Jornada",
                        lang: "es",
                    }
                ]
            },
            translationNameExtra: '2'
        },

    ]

    it('renders correctly', async () => {
        const {toJSON} = await waitFor(() =>
            render(<RoundList rounds={rounds} defaultRoundIndex={0}/>)
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it('match should display startDate if not finished', async () => {
        const newMockRound = JSON.parse(JSON.stringify(rounds[0]));
        newMockRound.matches = [
            {
                id: 1,
                startDate: "2021-08-13T19:00:36.000Z",
                finished: false,
                doublePoints: false,
                cancelled: false,
                roundId: 1,
                updatedAt: "2021-12-03T10:56:37.000Z",
                predictions: [
                    {
                        id: 2,
                        localTeamResult: 2,
                        awayTeamResult: 3,
                        correct: false,
                        points: 0,
                        userId: 6,
                        matchId: 1
                    }
                ],
                teams: [
                    {
                        id: 1,
                        finalResult: 1,
                        teamPosition: 0,
                        teamId: 10,
                        team: {
                            id: 10,
                            name: "Valencia",
                            crest: "https://www.flashscore.es/res/image/data/K6UJTt7k-fguToQZ6.png"
                        }
                    },
                    {
                        id: 2,
                        finalResult: 0,
                        teamPosition: 1,
                        teamId: 20,
                        team: {
                            id: 20,
                            name: "Getafe",
                            crest: "https://www.flashscore.es/res/image/data/hGMWMdT0-fguToQZ6.png"
                        }
                    }
                ]
            }
        ];
        const {queryByTestId} = await waitFor(() =>
            render(<RoundList rounds={[newMockRound]} defaultRoundIndex={0}/>)
        );
        const startDate = await queryByTestId('startDate');
        expect(startDate).toBeTruthy();
    });

    it('match should display final result if finished', async () => {
        const newMockRound = JSON.parse(JSON.stringify(rounds[0]));
        newMockRound.matches = [
            {
                id: 1,
                startDate: "2021-08-13T19:00:36.000Z",
                finished: true,
                doublePoints: false,
                cancelled: false,
                roundId: 1,
                updatedAt: "2021-12-03T10:56:37.000Z",
                predictions: [
                    {
                        id: 2,
                        localTeamResult: 2,
                        awayTeamResult: 3,
                        correct: false,
                        points: 0,
                        userId: 6,
                        matchId: 1
                    }
                ],
                teams: [
                    {
                        id: 1,
                        finalResult: 1,
                        teamPosition: 0,
                        teamId: 10,
                        team: {
                            id: 10,
                            name: "Valencia",
                            crest: "https://www.flashscore.es/res/image/data/K6UJTt7k-fguToQZ6.png"
                        }
                    },
                    {
                        id: 2,
                        finalResult: 0,
                        teamPosition: 1,
                        teamId: 20,
                        team: {
                            id: 20,
                            name: "Getafe",
                            crest: "https://www.flashscore.es/res/image/data/hGMWMdT0-fguToQZ6.png"
                        }
                    }
                ]
            }
        ];
        const {queryByTestId} = await waitFor(() =>
            render(<RoundList rounds={[newMockRound]} defaultRoundIndex={0}/>)
        );
        const result = await queryByTestId('finalResult');
        expect(result).toBeTruthy();
    });

    it('should render the default round', async () => {
        const {queryByText} = await waitFor(() =>
            render(<RoundList rounds={rounds} defaultRoundIndex={1}/>)
        );
        const result = await queryByText('Round 2');
        expect(result).toBeTruthy();
    });

    it('should render the second round on next click', async () => {
        const {queryByText, queryByTestId} = await waitFor(() =>
            render(<RoundList rounds={rounds} defaultRoundIndex={0}/>)
        );
        const round2 = await queryByText('Round 2');
        expect(round2).toBeFalsy();
        const next = await queryByTestId('nextButton');
        fireEvent.press(next);
        const round2After = await queryByText('Round 2');
        expect(round2After).toBeTruthy();
    });

    it('should render the first round on previous click', async () => {
        const {queryByText, queryByTestId} = await waitFor(() =>
            render(<RoundList rounds={rounds} defaultRoundIndex={1}/>)
        );
        const round1 = await queryByText('Round 1');
        expect(round1).toBeFalsy();
        const previous = await queryByTestId('previousButton');
        fireEvent.press(previous);
        const round1After = await queryByText('Round 1');
        expect(round1After).toBeTruthy();
    });

    it('should not change round on next button click in the last round', async () => {
        const {queryByText, queryByTestId} = await waitFor(() =>
            render(<RoundList rounds={rounds} defaultRoundIndex={1}/>)
        );
        const round2 = await queryByText('Round 2');
        expect(round2).toBeTruthy();
        const next = await queryByTestId('nextButton');
        fireEvent.press(next);
        const round2After = await queryByText('Round 2');
        expect(round2After).toBeTruthy();
    });

    it('should not change round on previous button click in the first round', async () => {
        const {queryByText, queryByTestId} = await waitFor(() =>
            render(<RoundList rounds={rounds} defaultRoundIndex={0}/>)
        );
        const round1 = await queryByText('Round 1');
        expect(round1).toBeTruthy();
        const previous = await queryByTestId('previousButton');
        fireEvent.press(previous);
        const round1After = await queryByText('Round 1');
        expect(round1After).toBeTruthy();
    });
});
