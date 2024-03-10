import React, { useState, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import "./App.css";

const Task = ({ task, index, moveTask, category }) => {
  const [, drag] = useDrag({
    type: "TASK",
    item: { index, category },
  });

  const [, drop] = useDrop({
    accept: "TASK",
    hover: (draggedItem) => {
      if (draggedItem.category !== category) {
        moveTask(draggedItem.index, index, draggedItem.category, category);
        draggedItem.index = index;
        draggedItem.category = category;
      }
    },
  });

  return (
    <div ref={(node) => drag(drop(node))}>
      <Button variant="outlined">{task}</Button>
    </div>
  );
};

function App() {
  const [tasks, setTasks] = useState({
    notStarted: ["Project", "Assignment", "Jamming"],
    inProgress: ["Game", "Eating"],
    Completed: ["Sleep"],
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addNewTask = (category) => {
    const newTask = prompt("Enter new task in " + category + " list :");
    if (newTask) {
      setTasks((prevTasks) => ({
        ...prevTasks,
        [category]: [...prevTasks[category], newTask],
      }));
    }
  };

  const moveTask = (fromIndex, toIndex, fromCategory, toCategory) => {
    const taskToMove = tasks[fromCategory][fromIndex];
    const updatedFromCategory = [...tasks[fromCategory]];
    updatedFromCategory.splice(fromIndex, 1);
    const updatedToCategory = [...tasks[toCategory]];
    updatedToCategory.splice(toIndex, 0, taskToMove);
    setTasks((prevTasks) => ({
      ...prevTasks,
      [fromCategory]: updatedFromCategory,
      [toCategory]: updatedToCategory,
    }));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="project-container">
        <h1 className="heading">Task Manager</h1>
        <br />
        <div className="task-wrapper">
          <div className="task-category">
            <div className="task-header">
              <h3 className="not-completed">Not started </h3>
              <h3>{tasks.notStarted.length}</h3>
              <AddIcon fontSize="small" onClick= {() => addNewTask("notStarted")}/>
            </div>
            <Stack spacing={1} direction="column">
              {tasks.notStarted.map((task, index) => (
                <Task
                  key={index}
                  task={task}
                  index={index}
                  moveTask={moveTask}
                  category="notStarted"
                />
              ))}
              <Button
                variant="outlined"
                onClick={() => addNewTask("notStarted")}
              >
                + New
              </Button>
            </Stack>
          </div>
          <div className="task-category">
            <div className="task-header">
              <h3 className="progress">In Progress </h3>
              <h3>{tasks.inProgress.length}</h3>
              <AddIcon fontSize="small" onClick= {() => addNewTask("inProgress")}/>
            </div>
            <Stack spacing={1} direction="column">
              {tasks.inProgress.map((task, index) => (
                <Task
                  key={index}
                  task={task}
                  index={index}
                  moveTask={moveTask}
                  category="inProgress"
                />
              ))}
              <Button
                variant="outlined"
                onClick={() => addNewTask("inProgress")}
              >
                + New
              </Button>
            </Stack>
          </div>
          <div className="task-category">
            <div className="task-header">
              <h3 className="completed">Completed </h3>
              <h3>{tasks.Completed.length}</h3>
              <AddIcon fontSize="small" onClick= {() => addNewTask("Completed")}/>
            </div>
            <Stack spacing={1} direction="column">
              {tasks.Completed.map((task, index) => (
                <Task
                  key={index}
                  task={task}
                  index={index}
                  moveTask={moveTask}
                  category="Completed"
                />
              ))}
              <Button
                variant="outlined"
                onClick={() => addNewTask("Completed")}
              >
                + New
              </Button>
            </Stack>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}

export default App;
