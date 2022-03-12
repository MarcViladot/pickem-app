import React, { Dispatch, FC, SetStateAction, useMemo, useState } from "react";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { IconButton, TextField, Tooltip } from '@mui/material';
import { AccessPoint, CircleEditOutline } from 'mdi-material-ui';
import { Remove } from '@mui/icons-material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import {Match} from '../../interfaces/League';
import {useSnackbar} from '../../contexts/snackbar.context';
import league from '../../api/league';
import {DateTools} from '../../utils/DateTools';
import EditMatchDialog from '../match/EditMatchDialog';

interface MatchListProps {
  matchList: Match[];
  updateRoundDetail: () => void;
  disableDeleteMatch: boolean;
  onMatchDeleted: (matchId: number) => void;
}

interface MatchProps {
  match: Match;
  updateRoundDetail: () => void;
  disableDeleteMatch: boolean;
  onMatchDeleted: (matchId: number) => void;
  onMatchUpdate: () => void;
}

const MatchComponent: FC<MatchProps> = ({
  match,
  updateRoundDetail,
  disableDeleteMatch,
  onMatchDeleted,
  onMatchUpdate,
}) => {

  const { showResErrorSnackbar, showSuccessSnackbar } = useSnackbar();
  const [editMatchDialogVisible, setEditMatchDialogVisible] = useState(false);
  const loading = false;
  const hasStarted = useMemo(() => new Date() > new Date(match.startDate) && !match.finished, [match])

  const formik = useFormik({
    initialValues: {
      localResult:
        match.teams[0].finalResult >= 0 ? match.teams[0].finalResult : ``,
      awayResult:
        match.teams[1].finalResult >= 0 ? match.teams[1].finalResult : ``,
    },
    validationSchema: Yup.object({
      localResult: Yup.number(),
      awayResult: Yup.number(),
    }),
    onSubmit: ({ localResult, awayResult }) => {
      updateMatchResult(+localResult, +awayResult);
    },
  });

  const updateMatchResult = async (localResult: number, awayResult: number) => {
    const res = await league.updateMatchResult({
      matchId: match.id,
      localResult,
      awayResult,
    });
    if (!res.IsError) {
      updateRoundDetail();
      showSuccessSnackbar(`Match result updated`);
    } else {
      showResErrorSnackbar(res);
    }
  };

  const RenderDate: FC<{ startDate: string }> = ({ startDate }) => (
    <div className={`text-xs hidden md:block`}>{`${DateTools.getMatchParsedDate(
      new Date(startDate),
    )}`}</div>
  );

  return (
    <>
      <EditMatchDialog match={match} open={editMatchDialogVisible}
                     onClose={() => setEditMatchDialogVisible(false)}
                     disableDeleteMatch={disableDeleteMatch} onMatchDeleted={onMatchDeleted} onMatchUpdate={onMatchUpdate}/>
      <div className={`flex justify-start items-center md:justify-end`}>
        <img
          src={match.teams[0].team.crest}
          alt={match.teams[0].team.name}
          style={{ height: 50 }}
        />
        <span className={`text-xl ml-3 hidden md:inline team-name`}>
          {match.teams[0].team.name}
        </span>
      </div>
      <form
        onSubmit={formik.handleSubmit}
        className={`flex items-center justify-center`}
      >
        <Tooltip title={`Edit Match`} placement={`right`} className={`mr-3`}>
          <span className={`mr-2 md:mr-3`}>
            <IconButton
              onClick={() => setEditMatchDialogVisible(true)}
              color={`warning`}
              size={`large`}
            >
              <CircleEditOutline fontSize={`large`} />
            </IconButton>
          </span>
        </Tooltip>
        <TextField
          className={`result-field border-yellow-500`}
          variant={`outlined`}
          id="localResult"
          label=""
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.localResult}
          margin="normal"
          name="localResult"
          required
        />
        <div className={`mr-3 ml-3 flex flex-col items-center`}>
          <RenderDate startDate={match.startDate} />
          <div>
            {hasStarted ? (
              <AccessPoint color={`error`} className={`animate-blink`} />
            ) : (
              <Remove />
            )}
          </div>
          {match.doublePoints && (
            <div className={`text-xs text-blue-400`}>x2</div>
          )}
        </div>
        <TextField
          className={`result-field`}
          variant={`outlined`}
          id="name"
          label=""
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.awayResult}
          margin="normal"
          name="awayResult"
          required
        />
        <Tooltip title={`Update match result`} placement={`top`}>
          <span className={`ml-2 md:ml-3`}>
            <IconButton
              type={`submit`}
              disabled={loading}
              color={`error`}
              size={`large`}
            >
              <CheckCircleOutlineIcon fontSize={`large`} />
            </IconButton>
          </span>
        </Tooltip>
      </form>
      <div className={`flex items-center justify-start`}>
        <img
          src={match.teams[1].team.crest}
          alt={match.teams[1].team.name}
          className={`h-10 w-10`}
        />
        <span className={`text-xl ml-3 hidden md:inline team-name`}>
          {match.teams[1].team.name}
        </span>
      </div>
    </>
  );
};

const MatchList: FC<MatchListProps> = ({
  matchList,
  updateRoundDetail,
  disableDeleteMatch,
  onMatchDeleted,
}) => {
  const updateMatch = (match: Match) => {
    // TODO PENDING TO DO
    updateRoundDetail();
  };

  return (
    <div className={`w-full match-grid pb-0`}>
      {matchList.map((match: Match) => (
        <MatchComponent
          match={match}
          key={match.id}
          updateRoundDetail={updateRoundDetail}
          disableDeleteMatch={disableDeleteMatch}
          onMatchDeleted={onMatchDeleted}
          onMatchUpdate={() => updateMatch(match)}
        />
      ))}
    </div>
  );
};

export default MatchList;
