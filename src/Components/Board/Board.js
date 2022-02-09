import React, { useState } from "react";
import "./Board.css";
import { MoreHorizontal } from "react-feather";
import Card from "../Card/Card";
import Editable from "../Editable/Editable";
import Dropdown from "../Dropdown/Dropdown";

function Board(props) {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div
      className="board"
      onDragEnter={() => props.handleDragBoardEnter(props.id)}
    >
      <div className="board_top">
        <div className="board_top_title">
          <p className="board_top_title_name">{props.title}</p>
          <span className="board_top_title_count">
            {props.cards?.length || 0}
          </span>
        </div>
        <div className="board_top_more" onClick={() => setShowDropdown(true)}>
          <MoreHorizontal />
          {showDropdown && (
            <Dropdown onClose={() => setShowDropdown(false)}>
              <div className="board_dropdown">
                <p
                  onClick={() =>
                    props.handleRemoveBoard && props.handleRemoveBoard(props.id)
                  }
                >
                  Delete Board
                </p>
              </div>
            </Dropdown>
          )}
        </div>
      </div>
      <div className="board_cards custom-scroll">
        {props.cards &&
          props.cards.length > 0 &&
          props.cards?.map((card) => {
            return (
              <Card
                key={card?.id}
                handleRemoveCard={() =>
                  props.handleRemoveCard(card?.id, props.id)
                }
                handleDragEnd={() => props.handleDragEnd(card?.id, props.id)}
                handleDragEnter={() =>
                  props.handleDragEnter(card?.id, props.id)
                }
                handleShowModal={() => props.handleShowModal(card, props.id)}
                {...card}
              />
            );
          })}
        <Editable
          displayClass="board_cards_add"
          text="Add Card"
          placeholder="Enter Card Title"
          onSubmit={(title) =>
            props.handleAddCard && props.handleAddCard(title, props.id)
          }
        />
      </div>
    </div>
  );
}

export default Board;
