import React, {useContext} from 'react';
import Paper from '@material-ui/core/Paper';
import {interpolateRgb} from 'd3-interpolate';
import {ViewState} from '@devexpress/dx-react-scheduler';
import {Appointments, AppointmentTooltip, Scheduler, WeekView} from '@devexpress/dx-react-scheduler-material-ui';
import {AppContext} from '../AppContextProvider';

const GroupTimetableContext = React.createContext({});

const GroupTimetable = () => {
    const {event} = useContext(AppContext);

    let colorInterpolator = interpolateRgb('white', 'rgb(100, 181, 246)');
    const context = {
        getColor: numberOfAvailable => {
            return colorInterpolator(numberOfAvailable / event.userCount);
        }
    };

    return (
        <GroupTimetableContext.Provider value={context}>
            <Paper>
                <Scheduler data={event.timetable}>
                    <ViewState />
                    <WeekView />
                    <Appointments appointmentComponent={Appointment} />
                    <AppointmentTooltip contentComponent={AppointmentTooltipContent} />
                </Scheduler>
            </Paper>
        </GroupTimetableContext.Provider>
    );
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
