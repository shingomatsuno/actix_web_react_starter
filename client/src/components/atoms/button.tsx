import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { green } from "@material-ui/core/colors";
import MUButton from "@material-ui/core/Button";
import { PropTypes } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrapper: {
      margin: theme.spacing(1),
      position: "relative",
    },
    buttonSuccess: {
      backgroundColor: green[500],
      "&:hover": {
        backgroundColor: green[700],
      },
    },
    buttonProgress: {
      color: green[500],
      position: "absolute",
      top: "50%",
      left: "50%",
      marginTop: -12,
      marginLeft: -12,
    },
  })
);

type Props = {
  title: string;
  loading: boolean;
  onClick: Function;
  variant?: "text" | "outlined" | "contained";
  color?: PropTypes.Color;
};

// ローディング付きのボタン
export default function Button({
  title,
  onClick,
  loading,
  variant = "contained",
  color = "primary",
}: Props) {
  const classes = useStyles();
  const timer = React.useRef<number>();

  React.useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  const handleButtonClick = () => {
    onClick();
  };

  return (
    <div className={classes.wrapper}>
      <MUButton
        fullWidth
        variant={variant}
        color={color}
        disabled={loading}
        onClick={handleButtonClick}
      >
        {title}
      </MUButton>
      {loading && (
        <CircularProgress size={24} className={classes.buttonProgress} />
      )}
    </div>
  );
}
