import React, {useContext, useState} from 'react';
import Paper from '@material-ui/core/Paper';
import {EditingState, IntegratedEditing, ViewState} from '@devexpress/dx-react-scheduler';
import {Appointments, AppointmentForm, DragDropProvider, Scheduler, WeekView} from '@devexpress/dx-react-scheduler-material-ui';

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
                    let newData = [];
                    data.forEach(a => {
                        if (a.startDate.getTime() < newAppointment.startDate.getTime()) {
                            if (a.endDate.getTime() < newAppointment.startDate.getTime()) {
                                newData.push(a);
                                return;
                            } else {
                                newAppointment.startDate = a.startDate;
                            }

                            if (a.endDate.getTime() > newAppointment.endDate.getTime()) {
                                newAppointment.endDate = a.endDate;
                            }
                        } else if (a.startDate.getTime() <= newAppointment.endDate.getTime()) {
                            if (a.endDate.getTime() > newAppointment.endDate.getTime()) {
                                newAppointment.endDate = a.endDate;
                            }
                        } else {
                            newData.push(a);
                        }

                        // a.endDate.getTime() <= newAppointment.startDate.getTime()
                    });

                    newData.push(newAppointment);
                    setData(newData);

                    // if (startTime.getTime() === prop.endDate.getTime()) {
                    //     let index = data.findIndex(
                    //         (a) => a.startDate.getTime() === prop.startDate.getTime() && a.endDate.getTime() === prop.endDate.getTime()
                    //     );
                    //     console.log("index")
                    //     console.log(index)
                    //     if (index !== -1) {
                    //         setData([...data.slice(0, index), ...data.slice(index + 1)]);
                    //         return;
                    //     }
                    //     setData([
                    //         ...data,
                    //         {startDate: prop.startDate, endDate: prop.endDate}
                    //     ]);
                    //     return;
                    // }
                    //
                    // setData([...data, {startDate: startTime, endDate: prop.endDate}]);
                } finally {
                    setStartTime(null);
                }
            }}
        />
    );
};

const Timetable = () => {
    const {data,
        setData,
        startTime,
        setStartTime} = useContext(AppContext)

    console.log("timetable")
    console.log(data)

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
                                throw new Error("Shouldn't get in here")
                                const startingAddedId =
                                    data.length > 0 ? data[data.length - 1].id + 1 : 0;
                                // for ()
                                data = [...data, { id: startingAddedId, ...added }];
                            }
                            if (changed) {
                                data = data.map((appointment) =>
                                    changed[appointment.id]
                                        ? { ...appointment, ...changed[appointment.id] }
                                        : appointment
                                );
                            }
                            if (deleted !== undefined) {
                                data = data.filter((appointment) => appointment.id !== deleted);
                            }
                            return data;
                        });
                    }}
                />
                <IntegratedEditing />
                {/*<AppointmentForm/>*/}
                <DragDropProvider />
            </Scheduler>
        </Paper>
    );
};

const Wrapper = () => {
    return (<AppContextProvider><Timetable/></AppContextProvider>)
}

export default Wrapper;
