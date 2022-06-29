import { Typography, Button, Grid } from "@material-ui/core";
import React, { useState, useEffect } from "react";

const Stopwatch = () => {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    let interval;
    if (running) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    } else if (!running) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [running]);
  return (
    <div className="stopwatch">
      <Grid container justifyContent="center" alignItems="center" spacing={1}>
        <div>
          <Typography variant="h3">
            <span>{("0" + Math.floor((time / 60000) % 60)).slice(-2)}:</span>
            <span>{("0" + Math.floor((time / 1000) % 60)).slice(-2)}:</span>
            <span>{("0" + ((time / 10) % 100)).slice(-2)}</span>
          </Typography>
          <Grid container justifyContent="center" alignItems="center">
            <Button
              variant="outlined"
              onClick={() => setRunning(!running)}
              style={{ marginLeft: "11px", marginRight: "11px", width: "30px" }}
            >
              {running ? "Stop" : "Start"}
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                setRunning(false);
                setTime(0);
              }}
              style={{ marginLeft: "11px", marginRight: "11px", width: "30px" }}
            >
              Reset
            </Button>
          </Grid>
        </div>
      </Grid>
    </div>
  );
};

export default Stopwatch;
