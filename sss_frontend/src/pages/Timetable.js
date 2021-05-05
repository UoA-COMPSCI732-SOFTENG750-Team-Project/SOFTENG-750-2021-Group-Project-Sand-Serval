import React, {useContext, useState} from 'react';
import Paper from '@material-ui/core/Paper';
import {EditingState, IntegratedEditing, ViewState} from '@devexpress/dx-react-scheduler';
import {Appointments, DragDropProvider, Scheduler, WeekView} from '@devexpress/dx-react-scheduler-material-ui';

const AppContext = React.createContext({
    data: [],
    startTime: null
});

function AppContextProvider({ children }) {
    const [data, setData] = useState([]);
    const [startTime, setStartTime] = useState(null);
    const context = {
        data,
        setData: data => {
            console.log(data);setData(data)
        },
        startTime,
        setStartTime
    };

    // Wraps the given child components in a Provider for the above context.
    return (
        <AppContext.Provider value={context}>
            {children}
        </AppContext.Provider>
    );
}

const TimeTableCellComponent = (prop) => {
    const {data,
        setData,
        startTime,
        setStartTime} = useContext(AppContext)
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
                    setData(mergeTimetable(data, newAppointment));
                } finally {
                    setStartTime(null);
                }
            }}
        />
    );
};

const Timetable = () => {
    const {data, setData} = useContext(AppContext)

    return (
        <Paper>
            <Scheduler data={data}>
                <ViewState />
                <WeekView timeTableCellComponent={TimeTableCellComponent} />
                <Appointments />
                <EditingState
                    onCommitChanges={({ added, changed, deleted }) => {
                        setData((data) => {
                            if (added) {
                                throw new Error("Shouldn't get in here");
                            }
                            if (changed) {
                                for (let changedAppointmentID in changed) {
                                    let dataWithoutChanged = data.filter(a => a.id !== Number(changedAppointmentID));
                                    data = mergeTimetable(dataWithoutChanged, changed[changedAppointmentID])
                                }
                            }
                            if (deleted !== undefined) {
                                data = data.filter((appointment) => appointment.id !== deleted);
                            }
                            return data;
                        });
                    }}
                />
                <IntegratedEditing />
                <DragDropProvider allowDrag={() => false} />
            </Scheduler>
        </Paper>
    );
};

const Wrapper = () => {
    return (<AppContextProvider><Timetable/></AppContextProvider>)
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

    return newAppointments;
}

function generateID() {
    return Math.round(Math.random() * Math.pow(10, 10));
}

export default Wrapper;
