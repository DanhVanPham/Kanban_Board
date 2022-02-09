import React from "react";
import "./Editable.css";
import { X } from "react-feather";

function Editable(props) {
  const [editable, setEditable] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(props.default || "");

  const handleSubmitInput = (e) => {
    e.preventDefault();
    if (!inputValue) {
      alert("Please enter a value");
      return;
    }
    props.onSubmit && props.onSubmit(inputValue);
    setInputValue("");
  };

  const handleChangeInput = (e) => {
    setInputValue(e.target.value);
  };
  return (
    <div className="editable">
      {editable ? (
        <form
          className={`editable_edit ${props.editClass || ""}`}
          onSubmit={handleSubmitInput}
        >
          <input
            autoFocus
            type="text"
            placeholder={props.placeholder}
            value={inputValue}
            onChange={handleChangeInput}
          />
          <div className="editable_edit_footer">
            <button type="submit" className="editable_edit_footer_button">
              {props.buttonText || "Add"}
            </button>
            <X onClick={() => setEditable(false)} />
          </div>
        </form>
      ) : (
        <p
          className={`editable_display ${props.displayClass || ""}`}
          onClick={() => setEditable(true)}
        >
          {props.text || "Add item"}
        </p>
      )}
    </div>
  );
}

export default Editable;
