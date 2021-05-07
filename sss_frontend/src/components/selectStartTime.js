import React, { useState } from "react";
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  TimePicker,
} from "@material-ui/pickers";
import TextField from "@material-ui/core/TextField";
import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";

const materialTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#4E9BFF'
    },
    typography: {
      color: 'white',
      useNextVariants: true,
      suppressDeprecationWarnings: true
    },
  },

});
export default function SelectStartTime() {
    const [value, setValue] = useState(new Date("2018-01-01T00:00:00.000Z"));


    return (
      <ThemeProvider theme={materialTheme}>

      <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <p>Start Time</p>
        <TimePicker
        ampm
        ampmInClock
        views={["hours"]}
        variant="dialog"
        label="Earlist Start Time"
        value={value}
        minutesStep={5}
        onChange={setValue}
        renderInput={(props) => <TextField {...props} />}
      />
      </MuiPickersUtilsProvider>
      </ThemeProvider>
    );

}