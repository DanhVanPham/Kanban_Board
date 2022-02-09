import React, { useEffect, useState } from "react";
import { Calendar, CheckSquare, List, Tag, Trash, Type } from "react-feather";
import Chip from "../../Chip/Chip";
import Editable from "../../Editable/Editable";
import { v4 as uuidv4 } from "uuid";
import Modal from "../../Modal/Modal";
import "./CardInfo.css";

function CardInfo(props) {
  const colors = [
    "#a8193d",
    "#4fcc25",
    "#1ebffa",
    "#8da377",
    "#9975bd",
    "#cf61a1",
    "#240958",
  ];
  const [activeColor, setActiveColor] = useState("");
  const [values, setValues] = useState({ ...props.card });

  const calculateProgress = () => {
    if (values.tasks.length === 0) return "0";
    let processed = 0;
    values.tasks.forEach((task) => {
      if (task.completed) {
        processed++;
      }
    });
    return (processed / values.tasks.length) * 100 + "";
  };

  const handleChange = (key, value) => {
    switch (key) {
      case "labels":
        if (!activeColor) {
          alert("Please select a color");
        } else {
          let tmp = [...values.labels];
          let tempLabel = {
            id: uuidv4(),
            text: value,
            color: activeColor,
          };
          tmp.push(tempLabel);
          setValues({ ...values, labels: tmp });
          props.handleUpdateCard({ ...values, labels: tmp });
        }
        break;

      case "tasks":
        let tmp = [...values.tasks];
        let tempTask = {
          id: uuidv4(),
          text: value,
          completed: false,
        };
        tmp.push(tempTask);
        setValues({ ...values, tasks: tmp });
        props.handleUpdateCard({ ...values, tasks: tmp });
        break;
      default:
        setValues({ ...values, [key]: value });
        props.handleUpdateCard({ ...values, [key]: value });
        break;
    }
  };

  const handleDeleteLabel = (labelId) => {
    let tmp = [...values.labels];
    tmp = tmp.filter((label) => label.id !== labelId);
    setValues({ ...values, labels: tmp });
    props.deleteLabelById(labelId);
  };

  const handleDeleteTask = (taskId) => {
    let tmp = [...values.tasks];
    tmp = tmp.filter((task) => task.id !== taskId);
    setValues({ ...values, tasks: tmp });
    props.deleteTaskById(taskId);
  };

  useEffect(() => {
    setValues({ ...props.card });
  }, [props.card]);

  return (
    <div>
      <Modal onClose={() => props.onClose()}>
        <div className="cardinfo">
          <div className="cardinfo_box">
            <div className="cardinfo_box_title">
              <Type />
              <span>Title</span>
            </div>
            <div className="cardinfo_box_body">
              <Editable
                text={values.title}
                default={values.title}
                buttonText="Set Title"
                placeholder="Enter Title"
                onSubmit={(value) => handleChange("title", value)}
              />
            </div>
          </div>
          <div className="cardinfo_box">
            <div className="cardinfo_box_title">
              <List />
              <span>Description</span>
            </div>
            <div className="cardinfo_box_body">
              <Editable
                text={values.desc || "Enter description"}
                default={values.desc}
                placeholder="Enter Description"
                buttonText="Set Description"
                onSubmit={(value) => handleChange("desc", value)}
              />
            </div>
          </div>
          <div className="cardinfo_box">
            <div className="cardinfo_box_title">
              <Calendar />
              <span>Date</span>
            </div>
            <div className="cardinfo_box_body">
              <input
                className="cardinfo_box_body_input"
                type="date"
                defaultValue={
                  values.date
                    ? new Date(values.date).toISOString().substr(0, 10)
                    : ""
                }
                onChange={(e) => handleChange("date", e.target.value)}
              />
            </div>
          </div>

          <div className="cardinfo_box">
            <div className="cardinfo_box_title">
              <Tag />
              <span>Labels</span>
            </div>
            <div className="cardinfo_box_labels">
              {values.labels &&
                values.labels.length > 0 &&
                values.labels.map((item) => (
                  <Chip
                    close
                    text={item.text}
                    key={item.id}
                    color={item.color}
                    onClose={() => handleDeleteLabel(item.id)}
                  />
                ))}
            </div>
            <div className="cardinfo_box_colors">
              {colors.map((color, index) => (
                <li
                  key={index}
                  className={color === activeColor ? "active" : ""}
                  style={{
                    backgroundColor: color,
                  }}
                  onClick={() => setActiveColor(color)}
                ></li>
              ))}
            </div>
            <div className="cardinfo_box_body">
              <Editable
                text="Enter Label"
                placeholder="Enter label"
                buttonText="Add Label"
                onSubmit={(value) => handleChange("labels", value)}
              />
            </div>
          </div>
          <div className="cardinfo_box">
            <div className="cardinfo_box_title">
              <CheckSquare />
              <span>Tasks</span>
            </div>
            <div className="cardinfo_box_progress-bar">
              <div
                className="cardinfo_box_progress"
                style={{ width: calculateProgress() + "%" }}
              ></div>
            </div>

            <div className="cardinfo_box_list">
              {values.tasks &&
                values.tasks.length > 0 &&
                values.tasks.map((item) => (
                  <div className="cardinfo_task" key={item.id}>
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => props.changeStatusTask(item.id)}
                    />
                    <p>{item.text}</p>
                    <Trash onClick={() => handleDeleteTask(item.id)} />
                  </div>
                ))}
            </div>
            <div className="cardinfo_box_body">
              <Editable
                text="Add new task"
                placeholder="Enter task"
                buttonText="Add Task"
                onSubmit={(value) => handleChange("tasks", value)}
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default CardInfo;
