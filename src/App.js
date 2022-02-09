import "./App.css";
import Board from "./Components/Board/Board";
import Editable from "./Components/Editable/Editable";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import CardInfo from "./Components/Card/CardInfo/CardInfo";

function App() {
  const [boards, setBoards] = useState([]);

  const [target, setTarget] = useState({
    cid: "",
    bid: "",
  });

  const [showModal, setShowModal] = useState({
    cardSelected: "",
    boardId: "",
    status: false,
  });

  const addCard = (title, bid) => {
    const card = {
      id: uuidv4(),
      title: title,
      labels: [],
      tasks: [],
      date: "",
      desc: "",
    };

    const index = boards.findIndex((item) => item.id === bid);
    if (index < 0) return;
    const tempBoards = [...boards];
    tempBoards[index].cards.push(card);
    setBoards(tempBoards);
  };

  const removeCard = (cid, bid) => {
    const bIndex = boards.findIndex((item) => item.id === bid);
    if (bIndex < 0) return;

    const cIndex = boards[bIndex].cards.findIndex((item) => item.id === cid);
    if (cIndex < 0) return;

    const tempBoards = [...boards];
    tempBoards[bIndex].cards.splice(cIndex, 1);
    setBoards(tempBoards);
  };

  const addBoard = (title) => {
    setBoards([...boards, { id: uuidv4(), title: title, cards: [] }]);
  };

  const removeBoard = (bid) => {
    const tempBoards = boards.filter((item) => item.id !== bid);
    setBoards(tempBoards);
  };

  const handleDragEnter = (cid, bid) => {
    setTarget({ bid, cid });
  };

  const handleDragEnd = (cid, bid) => {
    let s_bIndex, s_cIndex, t_bIndex, t_cIndex;
    s_bIndex = boards.findIndex((item) => item.id === bid);
    if (s_bIndex < 0) return;
    s_cIndex = boards[s_bIndex].cards?.findIndex((item) => item.id === cid);

    if (s_cIndex < 0) return;

    const tempBoards = [...boards];
    const tempCards = tempBoards[s_bIndex].cards[s_cIndex];

    t_bIndex = boards.findIndex((item) => item.id === target.bid);

    if (t_bIndex < 0) return;

    if (boards[t_bIndex].cards) {
      if (boards[t_bIndex].cards.length === 0) {
        tempBoards[s_bIndex].cards.splice(s_cIndex, 1);
        tempBoards[t_bIndex].cards.push(tempCards);
      } else {
        t_cIndex = boards[t_bIndex].cards?.findIndex(
          (item) => item.id === target.cid
        );
        if (t_cIndex < 0) return;

        tempBoards[s_bIndex].cards.splice(s_cIndex, 1);
        tempBoards[t_bIndex].cards.splice(t_cIndex, 0, tempCards);
      }
    }
    setBoards(tempBoards);
  };

  const handleDragBoardEnter = (bid) => {
    let t_bIndex = boards.findIndex((item) => item.id === bid);
    if (t_bIndex < 0) return;
    const tempBoards = [...boards];
    let cards = tempBoards[t_bIndex].cards;
    if (cards.length > 0) return;
    setTarget({ bid });
  };

  const handleShowModal = (card, bId) => {
    setShowModal({
      cardSelected: card,
      status: true,
      boardId: bId,
    });
  };

  const updateCard = ({ title, tasks, labels, desc, date }) => {
    let b_Index = boards.findIndex((item) => item.id === showModal.boardId);
    if (b_Index < 0) return;
    let c_Index = boards[b_Index].cards.findIndex(
      (item) => item.id === showModal.cardSelected.id
    );
    if (c_Index < 0) return;
    let tempBoards = [...boards];
    tempBoards[b_Index].cards[c_Index].title = title;
    tempBoards[b_Index].cards[c_Index].tasks = tasks;
    tempBoards[b_Index].cards[c_Index].labels = labels;
    tempBoards[b_Index].cards[c_Index].desc = desc;
    tempBoards[b_Index].cards[c_Index].date = date;
    setBoards(tempBoards);
  };

  const handleDeleteLabel = (labelId) => {
    let b_Index = boards.findIndex((item) => item.id === showModal.boardId);
    if (b_Index < 0) return;
    let c_Index = boards[b_Index].cards.findIndex(
      (item) => item.id === showModal.cardSelected.id
    );
    if (c_Index < 0) return;
    let temp = [...boards];
    temp[b_Index].cards[c_Index].labels = temp[b_Index].cards[
      c_Index
    ].labels.filter((item) => item.id !== labelId);
    setBoards(temp);
  };

  const handleCheckStatusTask = (taskId) => {
    let b_Index = boards.findIndex((item) => item.id === showModal.boardId);
    if (b_Index < 0) return;
    let c_Index = boards[b_Index].cards.findIndex(
      (item) => item.id === showModal.cardSelected.id
    );
    if (c_Index < 0) return;
    let task_Index = boards[b_Index].cards[c_Index].tasks.findIndex(
      (item) => item.id === taskId
    );
    if (task_Index < 0) return;
    let temp = [...boards];
    temp[b_Index].cards[c_Index].tasks[task_Index].completed =
      !temp[b_Index].cards[c_Index].tasks[task_Index].completed;
    setBoards(temp);
  };

  const handleDeleteTask = (taskId) => {
    let b_Index = boards.findIndex((item) => item.id === showModal.boardId);
    if (b_Index < 0) return;
    let c_Index = boards[b_Index].cards.findIndex(
      (item) => item.id === showModal.cardSelected.id
    );
    if (c_Index < 0) return;

    let temp = [...boards];
    temp[b_Index].cards[c_Index].tasks = temp[b_Index].cards[
      c_Index
    ].tasks.filter((item) => item.id !== taskId);
    setBoards(temp);
  };

  useEffect(() => {
    if (window.localStorage) {
      const data = JSON.parse(localStorage.getItem("kanban"));
      if (data) {
        setBoards(data);
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("kanban", JSON.stringify(boards));
  }, [boards]);

  return (
    <>
      {showModal.status && (
        <CardInfo
          card={showModal.cardSelected}
          handleUpdateCard={updateCard}
          deleteLabelById={handleDeleteLabel}
          changeStatusTask={handleCheckStatusTask}
          deleteTaskById={handleDeleteTask}
          onClose={() =>
            setShowModal({
              cardSelected: "",
              status: false,
            })
          }
        />
      )}
      <div
        className="app"
        style={{
          background:
            "url(https://trello-backgrounds.s3.amazonaws.com/SharedBackground/2133x1600/7ef8b224f3afd4df3d52915a267d36ef/photo-1628850923193-544e7b81ebad.jpg) no-repeat center center/cover",
        }}
      >
        <div className="app_navbar">
          <h2>Kanban Board</h2>
        </div>
        <div className="app_outer custom-scroll">
          <div className="app_boards ">
            {boards &&
              boards.map((board) => (
                <Board
                  key={board.id}
                  {...board}
                  handleAddCard={addCard}
                  handleRemoveCard={removeCard}
                  handleRemoveBoard={removeBoard}
                  handleDragEnd={handleDragEnd}
                  handleDragEnter={handleDragEnter}
                  handleDragBoardEnter={handleDragBoardEnter}
                  handleShowModal={handleShowModal}
                />
              ))}
            <div className="app_boards_board">
              <Editable
                text="Add Board"
                placeholder="Enter Board Title"
                displayClass="app_boards_board_add"
                onSubmit={addBoard}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
