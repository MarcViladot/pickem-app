import React, {Dispatch, FC, SetStateAction, useState} from 'react';
import {Match, Round} from '../../../interfaces/League';
import '../../../App.css';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {showBar} from '../../../actions/utils/showBar';
import league from '../../../api/league';
import {hideBar} from '../../../actions/utils/hideBar';
import {IconButton, TextField, Tooltip} from '@mui/material';
import {AccessPoint, CircleEditOutline} from 'mdi-material-ui';
import {Remove} from '@mui/icons-material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../reducers';
import {DateTools} from '../../../utils/DateTools';
import EditMatchForm from './EditMatchForm';

interface MatchListProps {
    matchList: Match[];
    setRoundDetail: Dispatch<SetStateAction<Round | undefined>>;
    disableDeleteMatch: boolean;
    onMatchDeleted: (matchId: number) => void;
}

interface MatchProps {
    match: Match;
    setRoundDetail: Dispatch<SetStateAction<Round | undefined>>;
    disableDeleteMatch: boolean;
    onMatchDeleted: (matchId: number) => void;
    onMatchUpdate: (match: Match) => void;
}

const MatchComponent: FC<MatchProps> = ({match, setRoundDetail, disableDeleteMatch, onMatchDeleted, onMatchUpdate}) => {

    const dispatch = useDispatch();
    const loading = useSelector((state: RootState) => state.utils.showProgressBar);
    const [editMatchDialogVisible, setEditMatchDialogVisible] = useState(false);

    const formik = useFormik({
        initialValues: {
            localResult: match.teams[0].finalResult >= 0 ? match.teams[0].finalResult : "",
            awayResult: match.teams[1].finalResult >= 0 ? match.teams[1].finalResult : "",
        },
        validationSchema: Yup.object({
            localResult: Yup.number(),
            awayResult: Yup.number()
        }),
        onSubmit: ({localResult, awayResult}) => {
            updateMatchResult(+localResult, +awayResult);
        },
    });

    const updateMatchResult = async (localResult: number, awayResult: number) => {
        dispatch(showBar());
        const res = await league.updateMatchResult({
            matchId: match.id,
            localResult,
            awayResult
        });
        if (!res.IsError) {
        } else {
            formik.resetForm();
            // TODO SHOW ERROR
        }
        dispatch(hideBar())
    }

    const hasStarted = () => new Date() > new Date(match.startDate) && !match.finished;

    const RenderDate: FC<{ startDate: string }> = ({startDate}) => (
        <div className={"text-xs"}>{`${DateTools.getMatchParsedDate(new Date(startDate))}`}</div>
    )

    return (
        <>
            <EditMatchForm match={match} editMatchDialogVisible={editMatchDialogVisible}
                           setEditMatchDialogVisible={setEditMatchDialogVisible}
                            disableDeleteMatch={disableDeleteMatch} onMatchDeleted={onMatchDeleted} onMatchUpdate={onMatchUpdate}/>
            <div className={"flex items-center justify-end"}>
                <img src={match.teams[0].team.crest} alt={match.teams[0].team.name} style={{height: 50}}/>
                <span className={"text-xl ml-3"}>{match.teams[0].team.name}</span>
            </div>
            <form onSubmit={formik.handleSubmit} className={"flex items-center justify-center"}>
                <Tooltip title={"Edit Match"} placement={"right"} className={"mr-3"}>
                        <span className={"mr-3"}>
                            <IconButton onClick={() => setEditMatchDialogVisible(true)}
                                        color={"warning"}
                                        size={"large"}>
                                <CircleEditOutline fontSize={"large"}/>
                            </IconButton>
                        </span>
                </Tooltip>
                <TextField className={"result-field border-yellow-500"} variant={"outlined"}
                           id="localResult"
                           label=""
                           onChange={formik.handleChange}
                           onBlur={formik.handleBlur}
                           value={formik.values.localResult}
                           margin="normal"
                           name="localResult"
                           required
                />
                <div className={"mr-3 ml-3 flex flex-col items-center"}>
                    <RenderDate startDate={match.startDate}/>
                    <div>
                        {hasStarted() ? <AccessPoint color={"error"} className={"animate-blink"}/> : <Remove/>}
                    </div>
                    {match.doublePoints && <div className={"text-xs text-blue-400"}>x2</div>}
                </div>
                <TextField className={"result-field"} variant={"outlined"}
                           id="name"
                           label=""
                           onChange={formik.handleChange}
                           onBlur={formik.handleBlur}
                           value={formik.values.awayResult}
                           margin="normal"
                           name="awayResult"
                           required/>
                <Tooltip title={"Update match result"} placement={"top"}>
                        <span className={"ml-3"}>
                            <IconButton type={"submit"} disabled={loading} color={"warning"} size={"large"}>
                                <CheckCircleOutlineIcon fontSize={"large"}/>
                            </IconButton>
                        </span>
                </Tooltip>
            </form>
            <div className={"flex items-center flex-row-reverse justify-end"}>
                <img src={match.teams[1].team.crest} alt={match.teams[1].team.name} style={{height: 50}}/>
                <span className={"text-xl mr-3"}>{match.teams[1].team.name}</span>
            </div>
        </>
    )
}

const MatchList: FC<MatchListProps> = ({matchList, setRoundDetail, disableDeleteMatch, onMatchDeleted}) => {

    const updateMatch = (match: Match) => {
        // PENDING TO DO
    }

    return (
        <div className={"w-full match-grid pb-0"}>
            {
                matchList.map((match: Match) => (
                    <MatchComponent match={match} key={match.id} setRoundDetail={setRoundDetail}
                                    disableDeleteMatch={disableDeleteMatch} onMatchDeleted={onMatchDeleted} onMatchUpdate={(match) => updateMatch(match)}/>
                ))
            }
        </div>
    );
};

export default MatchList;
