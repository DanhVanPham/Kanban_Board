import React, { useCallback, useEffect, useState } from "react";
import { CheckSquare, Clock, MoreHorizontal } from "react-feather";
import Chip from "../Chip/Chip";
import Dropdown from "../Dropdown/Dropdown";
import "./Card.css";

function Card(props) {
  const [showDropdown, setShowDropdown] = useState(false);

  const calculateOfAmountWorkCompleted = useCallback(() => {
    if (props.tasks.length === 0) return "0/0";
    let processed = 0;
    props.tasks.forEach((task) => {
      if (task.completed) {
        processed++;
      }
    });
    return processed + "/" + props.tasks.length;
  }, [props.tasks]);

  useEffect(() => {
    calculateOfAmountWorkCompleted();
  }, [calculateOfAmountWorkCompleted]);

  const handleCheckShowModal = (e) => {
    if (e.target.className === "card_top_more") {
      setShowDropdown(true);
    } else if (e.target.className === "card_dropdown_item") {
      props.handleRemoveCard && props.handleRemoveCard();
    } else {
      props.handleShowModal();
    }
  };

  return (
    <div
      className="card"
      draggable
      onDragEnd={() => props.handleDragEnd()}
      onDragEnter={() => props.handleDragEnter()}
      onClick={(e) => handleCheckShowModal(e)}
    >
      <div className="card_top">
        <div className="card_top_labels">
          {props.labels &&
            props.labels.length > 0 &&
            props.labels.map((label) => (
              <Chip key={label.id} text={label?.text} color={label?.color} />
            ))}
        </div>
        <div className="card_top_more" onClick={(e) => handleCheckShowModal(e)}>
          <MoreHorizontal />
          {showDropdown && (
            <Dropdown onClose={() => setShowDropdown(false)}>
              <div className="card_dropdown">
                <p
                  className="card_dropdown_item"
                  onClick={(e) => handleCheckShowModal(e)}
                >
                  Delete Card
                </p>
              </div>
            </Dropdown>
          )}
        </div>
      </div>
      <div className="card_title">{props.title || ""}</div>
      <div className="card_footer">
        {props.date && (
          <p>
            <Clock />
            {props.date || ""}
          </p>
        )}
        <p>
          <CheckSquare />
          {calculateOfAmountWorkCompleted()}
        </p>
      </div>
    </div>
  );
}

export default Card;
