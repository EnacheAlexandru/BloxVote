import React, { useState } from "react";
import "./custom_textfield.css";
import { MdSearch, MdDateRange } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function CustomTextField({
  width = "100%",
  icon = "none",
  minDate = null,
  withTime = true,
  onChange,
}) {
  const [selectedDate, setSelectedDate] = useState("");

  let textField;
  let textFieldIcon;

  if (icon === "date") {
    if (minDate && withTime) {
      textField = (
        <DatePicker
          className="custom-txtfld"
          showTimeSelect
          onChange={(date) => {
            onChange(date);
            setSelectedDate(date);
          }}
          selected={selectedDate}
          minDate={minDate}
          dateFormat="dd/MM/yyyy HH:mm"
          timeFormat="HH:mm"
        ></DatePicker>
      );
    } else if (!minDate && withTime) {
      textField = (
        <DatePicker
          className="custom-txtfld"
          showTimeSelect
          onChange={(date) => {
            onChange(date);
            setSelectedDate(date);
          }}
          selected={selectedDate}
          dateFormat="dd/MM/yyyy HH:mm"
          timeFormat="HH:mm"
        ></DatePicker>
      );
    } else if (!minDate && !withTime) {
      textField = (
        <DatePicker
          className="custom-txtfld"
          onChange={(date) => {
            onChange(date);
            setSelectedDate(date);
          }}
          selected={selectedDate}
          dateFormat="dd/MM/yyyy"
        ></DatePicker>
      );
    }

    textFieldIcon = (
      <MdDateRange size={24} style={{ marginRight: "3%" }}></MdDateRange>
    );
  } else {
    textField = (
      <input
        type="text"
        className="custom-txtfld"
        style={{ width: width }}
        onChange={(event) => onChange(event.target.value)}
      ></input>
    );
  }

  if (icon === "search") {
    textFieldIcon = (
      <MdSearch size={24} style={{ marginRight: "1%" }}></MdSearch>
    );
  }

  return (
    <div className="wrapper-txtfld">
      {textFieldIcon}
      {textField}
    </div>
  );
}
