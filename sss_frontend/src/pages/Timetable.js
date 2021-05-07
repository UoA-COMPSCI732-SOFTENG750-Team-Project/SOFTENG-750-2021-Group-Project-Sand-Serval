import React, {useContext, useState} from 'react';
import Paper from '@material-ui/core/Paper';
import DeleteIcon from '@material-ui/icons/Delete';
import {EditingState, IntegratedEditing, ViewState} from '@devexpress/dx-react-scheduler';
import {Appointments, DragDropProvider, Scheduler, WeekView} from '@devexpress/dx-react-scheduler-material-ui';
import styles from './Timetable.module.css';
import {AppContext} from '../AppContextProvider';

const UserTimetableContext = React.createContext({
    data: [],
    startTime: null
});

function UserTimetableContextProvider({ children }) {
    const {timetable, setTimetable} = useContext(AppContext);
    const [startTime, setStartTime] = useState(null);
    const [highlight, setHighlight] = useState(null);
    const context = {
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
    const {data, setData, startTime, setStartTime, setHighlight} = useContext(UserTimetableContext);

    return (
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

const Timetable = () => {
    const {data, setData, setHighlight} = useContext(UserTimetableContext);

    return (
        <Paper>
            <Scheduler data={data}>
                <ViewState />
                <WeekView timeTableCellComponent={TimeTableCellComponent} />
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
            </Scheduler>
        </Paper>
    );
};

const Wrapper = () => {
    return (<UserTimetableContextProvider><Timetable/></UserTimetableContextProvider>)
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

export default Wrapper;
