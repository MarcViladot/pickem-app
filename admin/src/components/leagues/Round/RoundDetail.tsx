import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import league from "../../../api/league";
import {useParams} from "react-router-dom";
import {Match, Round} from "../../../interfaces/League";
import {IconButton, Tooltip} from "@mui/material";
import {RootState} from "../../../reducers";
import Paper from '@mui/material/Paper';
import {AddCircleOutline} from '@mui/icons-material';
import '../../../App.css';
import MatchList from '../Match/MatchList';
import EditRoundForm from './EditRoundForm';
import CreateMatchForm from './CreateMatchForm';
import {CircleEditOutline} from 'mdi-material-ui';
import {showResErrorSnackbar} from '../../../actions/utils/showSnackbar';

interface ParamProps {
    roundId: string;
}

const RoundDetail = () => {

    const dispatch = useDispatch();
    const loading = useSelector((state: RootState) => state.utils.showProgressBar);
    const {roundId} = useParams<ParamProps>();
    const [roundDetail, setRoundDetail] = useState<Round>();
    const [newMatchDialogVisible, setNewMatchDialogVisible] = useState(false);
    const [editRoundDialogVisible, setEditRoundDialogVisible] = useState(false);

    useEffect(() => {
        if (!roundDetail) {
            loadRoundDetail();
        }
    }, []);

    const loadRoundDetail = async () => {
        const res = await league.getRoundWithMatches(roundId);
        if (!res.IsError) {
            setRoundDetail(res.Result);
        } else {
            dispatch(showResErrorSnackbar(res));
        }
    };

    const updateMatchList = (matchId: number) => {
        setRoundDetail((prevState: any) => {
            return {
                ...prevState,
                matches: prevState?.matches?.filter((m: Match) => m.id !== matchId)
            }
        })
    }

    return (
        <>
            {!!roundDetail && (
                <>
                    <CreateMatchForm setRoundDetail={setRoundDetail} roundDetail={roundDetail}
                                     setNewMatchDialogVisible={setNewMatchDialogVisible}
                                     newMatchDialogVisible={newMatchDialogVisible}/>
                    <EditRoundForm setRoundDetail={setRoundDetail} roundDetail={roundDetail}
                                   setEditRoundDialogVisible={setEditRoundDialogVisible}
                                   editRoundDialogVisible={editRoundDialogVisible}/>
                    <Paper className={"p-5 mb-3 flex justify-between"}>
                        <h1 className={"text-4xl"}>{roundDetail.name}</h1>
                        <div className={"flex"}>
                            <Tooltip title={"Edit Round"} placement={"left"}>
                                <IconButton onClick={() => setEditRoundDialogVisible(true)} color={"warning"}>
                                    <CircleEditOutline/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title={"Add match"} placement={"top"}>
                                <IconButton onClick={() => setNewMatchDialogVisible(true)} className={"ml-2"}>
                                    <AddCircleOutline/>
                                </IconButton>
                            </Tooltip>
                        </div>
                    </Paper>
                    <Paper className={"p-5 flex-grow flex items-center"}>
                        <MatchList disableDeleteMatch={false} matchList={roundDetail.matches || []}
                                   setRoundDetail={setRoundDetail} onMatchDeleted={(matchId) => updateMatchList(matchId)}/>
                    </Paper>
                </>
            )}
        </>
    );
};

export default RoundDetail;
