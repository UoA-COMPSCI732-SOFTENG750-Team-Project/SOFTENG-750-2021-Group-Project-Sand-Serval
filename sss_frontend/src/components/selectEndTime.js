import React from "react";
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  TimePicker,
} from "@material-ui/pickers";
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
export default function SelectStartTime(props) {

    return (
      <ThemeProvider theme={materialTheme}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <p>End Time</p>
        <TimePicker
        ampm
        views={["hours"]}
        variant="dialog"
        label="Latest End Time:"
        value={props.to}
        onChange={props.setTo} 
        />
      </MuiPickersUtilsProvider>
      </ThemeProvider>
    );

}