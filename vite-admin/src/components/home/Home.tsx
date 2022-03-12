import React, {FC, useState} from 'react';
import {User} from '../../interfaces/User';
import {AppBar, Drawer, Icon, IconButton, LinearProgress, List, ListItem, Toolbar, Tooltip} from '@mui/material';
import {firebaseAuth} from '../../firebase';
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import MenuIcon from "@mui/icons-material/Menu";
import useMobileView from '../../hooks/useMobileView';
import {useAuth} from '../../contexts/auth-user.context';
import {useSnackbar} from '../../contexts/snackbar.context';
import {useNavigate} from 'react-router-dom';
import {GroupTools} from '../../utils/GroupTools';
import clsx from 'clsx';
import { makeStyles } from "@material-ui/styles";
import { Outlet } from 'react-router-dom';


interface Props {
    children: React.ReactNode;
    loading?: boolean;
}

const useStyles = makeStyles({
    root: {
        display: `flex`,
    },
    appBar: {
        zIndex: 1400,
        boxShadow: `none`,
        backgroundColor: `#212121`,
        position: `absolute`,
        width: `100%`,
    },
    menuButton: {
        marginRight: 36,
    },
    hide: {
        display: `none`,
    },
    drawer: {
        width: 240,
        flexShrink: 0,
        whiteSpace: `nowrap`,
        overflow: `hidden`,
    },
    drawerClose: {
        overflowX: `hidden`,
        width: `64px`,
    },
    toolbar: {
        display: `flex`,
        alignItems: `center`,
        justifyContent: `flex-end`,
        padding: 10,
    },
});

const Home = () => {

    const classes = useStyles();
    const [mobileView] = useMobileView();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const { authUser } = useAuth();
    const { snackBar, closeSnackbar } = useSnackbar();
    let navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    return (
        <div>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <CustomToolbar user={authUser} toggleDrawer={() => setDrawerOpen((prevState) => !prevState)} />
            </AppBar>
            <Drawer
                style={{ paddingTop: `64px` }}
                variant={mobileView ? `temporary` : `permanent`}
                className={clsx(classes.drawer, classes.drawerClose)}
                open={drawerOpen}
                classes={{
                    paper: clsx(classes.drawerClose),
                }}
            >
                <List style={{ paddingTop: `64px` }}>
                    {GroupTools.getNavList().map((navItem, i) => (
                        <Tooltip title={navItem.text} aria-label="add" placement="right" key={i}>
                            <ListItem
                                button
                                key={navItem.text}
                                onClick={() => {
                                    navigate(`/${navItem.link}`);
                                }}
                                style={{ height: 50 }}
                            >
                                <Icon>{navItem.icon}</Icon>
                            </ListItem>
                        </Tooltip>
                    ))}
                </List>
            </Drawer>
            <div>{loading && <LinearProgress color="secondary" className="progress-bar" />}</div>
            <main
                className="router-content"
                style={{
                    paddingLeft: mobileView ? 10 : 74,
                    paddingTop: 10,
                }}
            >
               <Outlet />
            </main>
        </div>
    );
};

const CustomToolbar: FC<{ user: User | null; toggleDrawer: () => void }> = ({ user, toggleDrawer }) => (
    <Toolbar className="flex justify-between">
        <div className="flex items-center">
            <div className={`md:hidden mr-3`}>
                <IconButton type={`submit`} size={`large`} onClick={() => toggleDrawer()}>
                    <MenuIcon fontSize={`large`} />
                </IconButton>
            </div>
            <img
                src={`https://static.wikia.nocookie.net/evangelion/images/5/55/NERV_Logo_Theatrical_Edition.png`}
                className="mr-2"
                style={{ height: `44px` }}
            />
            <div className="text-3xl">Pick'em</div>
        </div>
        <div className="flex items-center">
            <div className="mr-3 text-xl hidden sm:inline">{user?.name}</div>
            <IconButton onClick={() => firebaseAuth.signOut()}>
                <ExitToAppIcon />
            </IconButton>
        </div>
    </Toolbar>
);

export default Home;
