import React, {FC, PropsWithChildren, useState} from "react";
import {AppBar, Drawer, IconButton, LinearProgress, List, ListItem, Toolbar, Tooltip,} from "@mui/material";
import Icon from "@mui/material/Icon";
import {makeStyles} from "@material-ui/styles";
import {User} from "../../interfaces/User";
import {useDispatch, useSelector} from "react-redux";
import {logout} from "../../actions/auth/logout";
import {RootState} from "../../reducers";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import logo from "../../logo.svg";
import clsx from "clsx";
import {GroupTools} from "../../utils/GroupTools";
import {Route, Switch, useHistory} from "react-router-dom";
import "../../App.css";
import Dashboard from "../dashboard/Dashboard";
import Users from "../users/Users";
import Leagues from "../leagues/Leagues";
import TeamsList from "../teams/TeamsList";
import LeagueDetail from "../leagues/LeagueDetail";
import RoundDetail from '../leagues/Round/RoundDetail';
import Translations from '../translations/Translations';
import MenuIcon from '@mui/icons-material/Menu';
import useMobileView from '../../utils/UseMobileView';

const useStyles = makeStyles({
    root: {
        display: "flex",
    },
    appBar: {
        zIndex: 1400,
        boxShadow: "none",
        backgroundColor: "#212121",
        position: "absolute",
        width: "100%",
    },
    menuButton: {
        marginRight: 36,
    },
    hide: {
        display: "none",
    },
    drawer: {
        width: 240,
        flexShrink: 0,
        whiteSpace: "nowrap",
        overflow: "hidden",
    },
    drawerClose: {
        overflowX: "hidden",
        width: "64px",
        paddingTop: 64,
    },
    toolbar: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: 10,
    },
});

const Home: FC = () => {
    const user = useSelector((state: RootState) => state.user.currentUser);
    const classes = useStyles();
    const history = useHistory();
    const showProgressBar = useSelector((state: RootState) => state.utils.showProgressBar);

    const [mobileView] = useMobileView();
    const [drawerOpen, setDrawerOpen] = useState(false);

    return (
        <div>
            <AppBar
                position="fixed"
                sx={{zIndex: (theme) => theme.zIndex.drawer + 1}}
            >
                <CustomToolbar user={user} toggleDrawer={() => setDrawerOpen(prevState => !prevState)}/>
            </AppBar>
            <Drawer
                variant={mobileView ? "temporary" : "permanent"}
                className={clsx(classes.drawer, classes.drawerClose)}
                open={drawerOpen}
                classes={{
                    paper: clsx(classes.drawerClose),
                }}
            >
                <List>
                    {GroupTools.getNavList().map((navItem, i) => (
                        <Tooltip
                            title={navItem.text}
                            aria-label="add"
                            placement="right"
                            key={i}
                        >
                            <ListItem
                                button
                                key={navItem.text}
                                onClick={() => {
                                    setDrawerOpen(false);
                                    history.push(`/${navItem.link}`)
                                }}
                                style={{height: 50}}
                            >
                                <Icon>{navItem.icon}</Icon>
                            </ListItem>
                        </Tooltip>
                    ))}
                </List>
            </Drawer>
            <div>
                {showProgressBar && (
                    <LinearProgress color="secondary" className="progress-bar"/>
                )}
            </div>
            <div className="router-content" style={{paddingLeft: mobileView ? 10 : 74, paddingTop: mobileView ? 74 : 10}}>
                <Switch>
                    <Route exact path="/">
                        <Dashboard/>
                    </Route>
                    <Route exact path="/leagues">
                        <Leagues/>
                    </Route>
                    <Route exact path="/leagues/:id">
                        <LeagueDetail/>
                    </Route>
                    <Route exact path="/leagues/:id/round/:roundId">
                        <RoundDetail/>
                    </Route>
                    <Route exact path="/teams">
                        <TeamsList/>
                    </Route>
                    <Route exact path="/users">
                        <Users/>
                    </Route>
                    <Route exact path="/translations">
                        <Translations/>
                    </Route>
                </Switch>
            </div>
        </div>
    );
};

const CustomToolbar: FC<{ user: User, toggleDrawer: () => void }> = ({user, toggleDrawer}) => {
    const dispatch = useDispatch();

    return (
        <Toolbar className="flex justify-between">
            <div className="flex items-center">
                <div className={"md:hidden mr-3"}>
                <IconButton type={"submit"} size={"large"} onClick={() => toggleDrawer()}>
                    <MenuIcon fontSize={"large"} />
                </IconButton>
                </div>
                <img src={logo} className="mr-2" style={{height: "44px"}}/>
                <div className="text-3xl">MY APP</div>
            </div>
            <div className="flex items-center">
                <div className="mr-3 text-xl hidden sm:inline">{user.name}</div>
                <IconButton onClick={() => dispatch(logout())}>
                    <ExitToAppIcon/>
                </IconButton>
            </div>
        </Toolbar>
    );
};

export default Home;
