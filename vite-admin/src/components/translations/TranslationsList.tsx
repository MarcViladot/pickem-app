import React, {FC} from 'react';
import {
    Box,
    Collapse,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
} from "@mui/material";
import { Add, KeyboardArrowDown, KeyboardArrowUp, Loop } from "@mui/icons-material";
import {RoundName, TranslationGroup} from '../../interfaces/League';
import NewTranslationDialog from './NewTranslationDialog';
import {useQuery, useQueryClient} from 'react-query';
import {useSnackbar} from '../../contexts/snackbar.context';
import translations from '../../api/translations';

const TranslationsList: FC = () => {
    const queryClient = useQueryClient();
    const [newFormVisible, setNewFormVisible] = React.useState(false);
    const { showResErrorSnackbar, showSuccessSnackbar } = useSnackbar();
    const { isFetching, data } = useQuery(`translations`, translations.getAll, {
        onSuccess: (res) => {
            if (res.IsError) {
                showResErrorSnackbar(res);
            }
        },
    });

    const Row: FC<{ group: TranslationGroup; index: number }> = ({ group, index }) => {
        const [open, setOpen] = React.useState(false);

        return (
            <React.Fragment>
                <TableRow>
                    <TableCell>
                        <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                        </IconButton>
                    </TableCell>
                    <TableCell component="th" scope="row">
                        {group.id}
                    </TableCell>
                    <TableCell component="th" scope="row">
                        {group.groupName}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
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
                                        {group.roundNames.map((roundName: RoundName, i) => (
                                            <TableRow key={roundName.id} className={`justify-start`}>
                                                <TableCell style={{ width: 50 }}>{i + 1}</TableCell>
                                                <TableCell style={{ width: 200 }}>{roundName.text}</TableCell>
                                                <TableCell style={{ width: 50 }}>{roundName.lang}</TableCell>
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
            <NewTranslationDialog open={newFormVisible} onClose={() => setNewFormVisible(false)} />
            <Paper className={`p-5 mb-3 flex justify-between`}>
                <h1 className={`text-4xl`}>Round Translations List</h1>
                <div>
                    <Tooltip title={`Load translations`} placement={`left`}>
                        <IconButton onClick={() => queryClient.invalidateQueries(`translations`)}>
                            <Loop />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={`New Group`} placement={`top`}>
                        <IconButton onClick={() => setNewFormVisible(true)}>
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
                            <TableCell style={{ width: 50 }}>#</TableCell>
                            <TableCell>Name</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data?.Result?.map((group: TranslationGroup, i: number) => (
                            <Row group={group} index={i} key={i} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

export default TranslationsList;
