import React, {useContext} from 'react';
import Paper from '@material-ui/core/Paper';
import {interpolateRgb} from 'd3-interpolate';
import {ViewState} from '@devexpress/dx-react-scheduler';
import {
    Appointments,
    AppointmentTooltip,
    DateNavigator,
    Scheduler,
    Toolbar,
    WeekView
} from '@devexpress/dx-react-scheduler-material-ui';
import {AppContext} from '../AppContextProvider';
import {isTimeTableCellDisabled, useNavigator} from './timetableHelpers';

const GroupTimetableContext = React.createContext({});

const GroupTimetable = () => {
    const {event} = useContext(AppContext);
    const [currentDate, setCurrentDate] = useNavigator(event.dates[0], event.dates[1]);

    let colorInterpolator = interpolateRgb('white', 'rgb(100, 181, 246)');
    const context = {
        event,
        getColor: numberOfAvailable => {
            return colorInterpolator(numberOfAvailable / event.userCount);
        }
    };

    return (
        <GroupTimetableContext.Provider value={context}>
            <Paper>
                <Scheduler data={event.timetable}>
                    <ViewState
                        currentDate={currentDate}
                        onCurrentDateChange={setCurrentDate}
                    />
                    <WeekView
                        timeTableCellComponent={TimeTableCellComponent}
                        // Show at least from 8 AM to 6PM
                        startDayHour={Math.min(event.from.getHours(), 8)}
                        endDayHour={Math.max(event.to.getHours(), 18)}
                    />
                    <Appointments appointmentComponent={Appointment} />
                    <AppointmentTooltip contentComponent={AppointmentTooltipContent} />
                    <Toolbar />
                    <DateNavigator />
                </Scheduler>
            </Paper>
        </GroupTimetableContext.Provider>
    );
};

const TimeTableCellComponent = (prop) => {
    const {event} = useContext(GroupTimetableContext);
    const isDisabled = isTimeTableCellDisabled(event, prop);
    return <WeekView.TimeTableCell isShaded={isDisabled}/>;
};

const Appointment = (prop) => {
    const {getColor} = useContext(GroupTimetableContext);

    return (
        <Appointments.Appointment
            {...prop}
            style={{
                backgroundColor: getColor(prop.data.users.length)
            }}
        />
    );
};

const AppointmentTooltipContent = ({appointmentData}) => {
    return <p>Available: {appointmentData.users.join(', ')}.</p>
}

export default GroupTimetable;
