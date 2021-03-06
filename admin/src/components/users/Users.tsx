import React, {FC} from 'react';
import {Box, Collapse, IconButton, Tooltip, Typography} from '@mui/material';
import Paper from '@mui/material/Paper';
import {KeyboardArrowDown, KeyboardArrowUp, Loop} from '@mui/icons-material';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import {useDispatch, useSelector} from 'react-redux';
import {loadUsers} from '../../actions/user/loadUsers';
import {RootState} from '../../reducers';
import {User, UserGroup, UserGroupRole, UserRole} from '../../interfaces/User';

const Users = () => {

    const dispatch = useDispatch();
    const userList = useSelector((state: RootState) => state.user.all);

    const Row: FC<{ user: User }> = ({user}) => {

        const [open, setOpen] = React.useState(false);

        return (
            <React.Fragment>
                <TableRow>
                    <TableCell>
                        <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                            {open ? <KeyboardArrowUp/> : <KeyboardArrowDown/>}
                        </IconButton>
                    </TableCell>
                    <TableCell component="th" scope="row">{user.id}</TableCell>
                    <TableCell component="th" scope="row">{user.uid}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>
                        <span style={{height: 50, width: 50}} className={"flex justify-center"}>
                            {/*@ts-ignore*/}
                            <img src={user.photo} alt={user.name} style={{height: 50}} onError={(event) => event.target.style.display = 'none'}/>
                        </span>
                    </TableCell>
                    <TableCell>{user.firebaseUser?.email}</TableCell>
                    <TableCell>{UserRole[user.userRole]}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={6}>
                        <Collapse in={open} timeout="auto" unmountOnExit className={"mb-5"}>
                            <Box margin={1}>
                                <Typography variant="h6" gutterBottom component="div">
                                    Groups
                                </Typography>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>#</TableCell>
                                            <TableCell>Name</TableCell>
                                            <TableCell>Role</TableCell>
                                            <TableCell>Invitation Code</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {user.userGroups?.map((userGroup: UserGroup) => (
                                            <TableRow key={userGroup.id}>
                                                <TableCell
                                                    className="MuiTableCell-sizeSmall">{userGroup.group.id}</TableCell>
                                                <TableCell className="MuiTableCell-sizeSmall">
                                                    {userGroup.group.name}
                                                </TableCell>
                                                <TableCell className="MuiTableCell-sizeSmall">
                                                    {UserGroupRole[userGroup.userRole]}
                                                </TableCell>
                                                <TableCell className="MuiTableCell-sizeSmall">
                                                    {userGroup.group.invitationCode}
                                                </TableCell>
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
        <div>
            <Paper className={"p-5 mb-3 flex justify-between"}>
                <h1 className={"text-4xl"}>User List</h1>
                <Tooltip title={"Add team"} placement={"left"}>
                    <IconButton onClick={() => dispatch(loadUsers())}>
                        <Loop/>
                    </IconButton>
                </Tooltip>
            </Paper>
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell style={{width: 50}} />
                            <TableCell style={{width: 50}}>#</TableCell>
                            <TableCell>Uid</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell style={{width: 60}}>Photo</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Role</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {userList.map((user: User) => (
                            <Row user={user}/>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default Users;
