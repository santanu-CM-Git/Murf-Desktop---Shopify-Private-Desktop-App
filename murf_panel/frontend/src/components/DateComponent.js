import React, { useState } from "react"; 
import Datepicker from "react-tailwindcss-datepicker"; 

const DateComponent = ({ handleDateCallback }) => { 
    const [value, setValue] = useState({ 
        startDate: null, 
        endDate: null
    });

    return (
        <Datepicker 
            value={value} 
            onChange={newValue => {setValue(newValue); handleDateCallback(newValue); }}
            showShortcuts={true}
        /> 
    );
};

export default DateComponent;
