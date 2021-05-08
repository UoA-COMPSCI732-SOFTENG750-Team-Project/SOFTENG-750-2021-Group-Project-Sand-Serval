import React, {useContext, useState} from 'react';
import Paper from '@material-ui/core/Paper';
import DeleteIcon from '@material-ui/icons/Delete';
import {EditingState, IntegratedEditing, ViewState} from '@devexpress/dx-react-scheduler';
import {Appointments, DateNavigator, DragDropProvider, Scheduler, Toolbar, WeekView} from '@devexpress/dx-react-scheduler-material-ui';
import styles from './UserTimetable.module.css';
import {AppContext} from '../AppContextProvider';
import {isTimeTableCellDisabled, useNavigator} from './timetableHelpers';

const UserTimetableContext = React.createContext({
    data: [],
    startTime: null
});

function UserTimetableContextProvider({ children }) {
    const {event, timetable, setTimetable} = useContext(AppContext);
    const [startTime, setStartTime] = useState(null);
    const [highlight, setHighlight] = useState(null);
    const context = {
        event,
        data: timetable,
        setData: setTimetable,
        startTime,
        setStartTime,
        highlight,
        setHighlight
    };

    // Wraps the given child components in a Provider for the above context.
    return (
        <UserTimetableContext.Provider value={context}>
            {children}
        </UserTimetableContext.Provider>
    );
}

const Appointment = (prop) => {
    const {data, setData, highlight, setHighlight} = useContext(UserTimetableContext);
    const isHighlighted = highlight === prop.data.id;

    return (
        <Appointments.Appointment
            {...prop}
            className={`${prop.className} ${styles.customAppointment} ${styles.appointment} ${isHighlighted && styles.highlight}` }
            onClick={() => setHighlight(prop.data.id)}
        >
            <div className={styles.resizeButtonsContainer}>
                {isHighlighted && (
                    <div className={`${styles.resizeButton} ${styles.resizeButtonTop}`}/>
                )}
                <div className={styles.appointmentDate}>
                    {prop.children}
                </div>
                {isHighlighted && (
                    <div className={`${styles.resizeButton} ${styles.resizeButtonBottom}`}/>
                )}
            </div>
            {isHighlighted && (
                <div onClick={() => {setData(data.filter(appointment => appointment.id !== prop.data.id))}} className={styles.deleteButton}>
                    <DeleteIcon fontSize={"small"}/>
                </div>
            )}
        </Appointments.Appointment>
    );
};

const TimeTableCellComponent = (prop) => {
    const {event, data, setData, startTime, setStartTime, setHighlight} = useContext(UserTimetableContext);

    const isDisabled = isTimeTableCellDisabled(event, prop);

    return isDisabled ? (
        <WeekView.TimeTableCell isShaded={true}/>
    ) : (
        <WeekView.TimeTableCell
            {...prop}
            onMouseDown={() => setStartTime(prop.startDate)}
            onMouseUp={() => {
                try {
                    if (!startTime) {
                        return;
                    }

                    let newAppointment = {startDate: startTime, endDate: prop.endDate};
                    let {newTimetable, modifiedNewAppointment} = mergeTimetable(data, newAppointment);
                    setHighlight(modifiedNewAppointment.id);
                    setData(newTimetable);
                } finally {
                    setStartTime(null);
                }
            }}
        />
    );
};

const UserTimetableLayout = () => {
    const {event, data, setData, setHighlight} = useContext(UserTimetableContext);
    const [currentDate, setCurrentDate] = useNavigator(event.dates[0], event.dates[1]);

    return (
        <Paper>
            <Scheduler data={data}>
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
                <EditingState
                    onCommitChanges={({ added, changed, deleted }) => {
                        let newData = [...data];
                        if (added) {
                            throw new Error('Shouldn\'t get in here');
                        }

                        if (changed) {
                            for (let changedAppointmentID in changed) {
                                let dataWithoutChanged = newData.filter(a => a.id !== Number(changedAppointmentID));
                                let {newTimetable, modifiedNewAppointment} = mergeTimetable(dataWithoutChanged, changed[changedAppointmentID]);
                                newData = newTimetable;
                                setHighlight(modifiedNewAppointment.id);
                            }
                        }

                        if (deleted !== undefined) {
                            newData = newData.filter((appointment) => appointment.id !== deleted);
                        }
                        setData(newData);
                    }}
                />
                <IntegratedEditing />
                <DragDropProvider allowDrag={() => false} />
                <Toolbar />
                <DateNavigator />
            </Scheduler>
        </Paper>
    );
};

const UserTimetable = () => {
    return (<UserTimetableContextProvider><UserTimetableLayout/></UserTimetableContextProvider>)
}

function mergeTimetable(oldAppointments, newAppointment) {
    let updatedNewAppointment = {id: generateID(), startDate: newAppointment.startDate, endDate: newAppointment.endDate};
    let newAppointments = [];
    oldAppointments.forEach(a => {
        if (a.startDate.getTime() < updatedNewAppointment.startDate.getTime()) {
            if (a.endDate.getTime() < updatedNewAppointment.startDate.getTime()) {
                newAppointments.push(a);
                return;
            } else {
                updatedNewAppointment.startDate = a.startDate;
            }

            if (a.endDate.getTime() > updatedNewAppointment.endDate.getTime()) {
                updatedNewAppointment.endDate = a.endDate;
            }
        } else if (a.startDate.getTime() <= updatedNewAppointment.endDate.getTime()) {
            if (a.endDate.getTime() > updatedNewAppointment.endDate.getTime()) {
                updatedNewAppointment.endDate = a.endDate;
            }
        } else {
            newAppointments.push(a);
        }
    });

    newAppointments.push(updatedNewAppointment);

    return {newTimetable: newAppointments, modifiedNewAppointment: updatedNewAppointment};
}

function generateID() {
    return Math.round(Math.random() * Math.pow(10, 10));
}

export default UserTimetable;
