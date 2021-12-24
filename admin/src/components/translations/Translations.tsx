import React, {FC} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../reducers';
import Paper from '@mui/material/Paper';
import {Box, Collapse, IconButton, Tooltip, Typography} from '@mui/material';
import {loadUsers} from '../../actions/user/loadUsers';
import {Add, KeyboardArrowDown, KeyboardArrowUp, Loop} from '@mui/icons-material';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import {User, UserGroup, UserGroupRole, UserRole} from '../../interfaces/User';
import {RoundName, TranslationGroup} from '../../interfaces/League';
import {loadTranslations} from '../../actions/translations/loadTranslations';
import NewTranslationGroupFrom from './NewTranslationGroupFrom';

const Translations = () => {

    const dispatch = useDispatch();
    const translations = useSelector((state: RootState) => state.translations.translations);
    const [newFormVisible, setNewFormVisible] = React.useState(false);

    const Row: FC<{ group: TranslationGroup, index: number }> = ({group, index}) => {

        const [open, setOpen] = React.useState(false);

        return (
            <React.Fragment>
                <TableRow>
                    <TableCell>
                        <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                            {open ? <KeyboardArrowUp/> : <KeyboardArrowDown/>}
                        </IconButton>
                    </TableCell>
                    <TableCell component="th" scope="row">{group.id}</TableCell>
                    <TableCell component="th" scope="row">{group.groupName}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={6}>
                        <Collapse in={open} timeout="auto" unmountOnExit className={"mb-5"}>
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
                                            <TableRow key={roundName.id} className={"justify-start"}>
                                                <TableCell style={{width: 50}}>{i + 1}</TableCell>
                                                <TableCell style={{width: 200}}>{roundName.text}</TableCell>
                                                <TableCell style={{width: 50}}>{roundName.lang}</TableCell>
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
    }

    return (
        <>
            <NewTranslationGroupFrom  newDialogVisible={newFormVisible} setNewDialogVisible={setNewFormVisible} />
            <div className={"h-full flex flex-col"}>
                <Paper className={"p-5 mb-3 flex justify-between"}>
                    <h1 className={"text-4xl"}>Round Translations List</h1>
                    <div>
                        <Tooltip title={"Load translations"} placement={"left"}>
                            <IconButton onClick={() => dispatch(loadTranslations())}>
                                <Loop/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={"New Group"} placement={"top"}>
                            <IconButton onClick={() => setNewFormVisible(true)}>
                                <Add/>
                            </IconButton>
                        </Tooltip>
                    </div>
                </Paper>
                <TableContainer component={Paper} className={"flex-grow"}>
                    <Table sx={{minWidth: 650}} aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell style={{width: 50}}/>
                                <TableCell style={{width: 50}}>#</TableCell>
                                <TableCell>Name</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {translations.map((group: TranslationGroup, i: number) => (
                                <Row group={group} index={i}/>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </>
    );
};

export default Translations;
