import React, { useState } from "react";
import DataPicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CalendarPicker = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(null);
    const onChange = dates => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
    };
    console.log(startDate);

    console.log(endDate);

    return (
        <DataPicker
        selected={startDate}
        onChange={onChange}
        startDate={startDate}
        endDate={endDate}
        selectsRange
        inline
        />
    );
};

export default CalendarPicker;