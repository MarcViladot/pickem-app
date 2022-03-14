import React, {FC, useState} from 'react';
import {
    Box,
    Collapse,
    IconButton,
    Paper,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
} from "@mui/material";
import { Add, KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import CreateRoundDialog from './CreateRoundDialog';
import {Round, RoundName} from '../../interfaces/League';
import {DateTools} from '../../utils/DateTools';
import league from '../../api/league';
import {useQuery} from 'react-query';
import {useNavigate, useParams} from 'react-router-dom';
import {useSnackbar} from '../../contexts/snackbar.context';

const LeagueDetail: FC = () => {
    const [loading, setLoading] = useState(false);
    const [newRoundDialogVisible, setNewRoundDialogVisible] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();
    const { showResErrorSnackbar, showSuccessSnackbar } = useSnackbar();
    const { isFetching, data } = useQuery([`league`, id], () => league.getLeagueDetail(`${id}`), {
        onSuccess: (res) => {
            if (res.IsError) {
                showResErrorSnackbar(res);
            }
        },
    });

    const updateLeagueVisibility = async (visible: boolean) => {
        if (!!data.Result) {
            setLoading(true);
            const res = await league.updateLeagueVisibility(data.Result.id, visible);
            if (!res.IsError) {
                data.Result.visible = visible;
                showSuccessSnackbar(`League visibility updated`);
            } else {
                showResErrorSnackbar(res);
            }
            setLoading(false);
        }
    };

    const changeRoundVisibility = async (round: Round, visible: boolean) => {
        setLoading(true);
        const res = await league.changeRoundVisibility(round.id, visible);
        if (!res.IsError) {
            showSuccessSnackbar(`Round visibility updated`);
            round.visible = res.Result.visible;
        } else {
            showResErrorSnackbar(res);
        }
        setLoading(false);
    };

    const changeRoundFinish = async (round: Round, finished: boolean) => {
        setLoading(true);
        const res = await league.updateRound({
            id: round.id,
            name: round.name,
            startingDate: new Date(round.startingDate),
            finished,
        });
        if (!res.IsError) {
            showSuccessSnackbar(`Round finished status updated`);
            round.finished = finished;
        } else {
            showResErrorSnackbar(res);
        }
        setLoading(false);
    };

    const Row: FC<{ round: Round; index: number }> = ({ round, index }) => {
        const [open, setOpen] = React.useState(false);

        return (
            <React.Fragment>
                <TableRow
                    key={round.id.toString()}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    className={`cursor-pointer`}
                    onClick={() => {
                        navigate(`round/${round.id}`);
                    }}
                >
                    <TableCell>
                        <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                setOpen(!open);
                            }}
                        >
                            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                        </IconButton>
                    </TableCell>
                    <TableCell component="th" scope="row">
                        {index + 1}
                    </TableCell>
                    <TableCell>{round.name}</TableCell>
                    <TableCell>{round.translationGroup.groupName}</TableCell>
                    <TableCell>{round.translationNameExtra}</TableCell>
                    <TableCell>{DateTools.getCompleteDate(new Date(round.startingDate))}</TableCell>
                    <TableCell>
                        <Switch
                            checked={round.finished}
                            color={`error`}
                            onChange={(e) => {
                                changeRoundFinish(round, !round.finished);
                            }}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </TableCell>
                    <TableCell>
                        <Switch
                            checked={round.visible}
                            color={`warning`}
                            onChange={(e) => {
                                changeRoundVisibility(round, !round.visible);
                            }}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0, border: 0 }} colSpan={6}>
                        <Collapse in={open} timeout="auto" unmountOnExit className={`mb-5`}>
                            <Box margin={1}>
                                <Typography variant="h6" gutterBottom component="div">
                                    Translations
                                </Typography>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>#</TableCell>
                                            <TableCell>Text</TableCell>
                                            <TableCell>Lang</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {round.translationGroup.roundNames.map((roundName: RoundName, i) => (
                                            <TableRow key={roundName.id}>
                                                <TableCell className="MuiTableCell-sizeSmall">{i + 1}</TableCell>
                                                <TableCell className="MuiTableCell-sizeSmall">{roundName.text}</TableCell>
                                                <TableCell className="MuiTableCell-sizeSmall">{roundName.lang}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
            </React.Fragment>
        );
    };

    return (
        <>
            <CreateRoundDialog onClose={() => setNewRoundDialogVisible(false)} open={newRoundDialogVisible} id={`${id}`} />
            <div className={`flex flex-grow flex-col`}>
                {!!data?.Result && (
                    <>
                        <Paper className={`p-5 mb-3 flex justify-between`}>
                            <h1 className={`text-4xl`}>{data?.Result.name}</h1>
                            <div className={`flex items-center`}>
                                <div className={`mr-5`}>
                                    <span className={`mr-1`}>Visible</span>
                                    <Switch
                                        checked={data.Result.visible}
                                        color={`error`}
                                        onChange={(e) => {
                                            console.log(e.target.checked);
                                            updateLeagueVisibility(e.target.checked);
                                        }}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>
                                <Tooltip title={`Add round`} placement={`left`}>
                                    <IconButton onClick={() => setNewRoundDialogVisible(true)}>
                                        <Add />
                                    </IconButton>
                                </Tooltip>
                            </div>
                        </Paper>
                        <TableContainer component={Paper} className={`flex-grow`}>
                            <Table sx={{ minWidth: 650 }} aria-label="a dense table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{ width: 50 }} />
                                        <TableCell>#</TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Translation Group</TableCell>
                                        <TableCell>Translation Name Extra</TableCell>
                                        <TableCell>Starting Date</TableCell>
                                        <TableCell>Finished</TableCell>
                                        <TableCell>Visible</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data?.Result.rounds?.map((round: Round, i: number) => (
                                        <Row round={round} key={i} index={i} />
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </>
                )}
            </div>
        </>
    );
};

export default LeagueDetail;
