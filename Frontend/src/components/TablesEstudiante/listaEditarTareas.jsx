import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  List,
  ListItem,
  ListItemText,
  Button,
  TextField,
  Fab,
  IconButton,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles((theme) => ({
  taskList: {
    padding: theme.spacing(2),
  },
  taskItem: {
    margin: theme.spacing(1),
    padding: theme.spacing(2),
    borderRadius: '8px',
    backgroundColor: '#CFD4E1',
    color: 'black',
    '&:hover': {
      backgroundColor: '#3e8e41',
    },
  },
  addButton: {
    margin: theme.spacing(1),
  },
}));

const editarTareas = () => {
  const classes = useStyles();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  const handleAddTask = () => {
    if (newTask.trim() !== '') {
      setTasks([...tasks, newTask]);
      setNewTask('');
    }
  };

  const handleDeleteTask = (index) => {
    setTasks(tasks.filter((task, i) => i !== index));
  };

  return (
    <div className={classes.taskList}>
      <List>
        {tasks.map((task, index) => (
          <ListItem key={index} className={classes.taskItem}>
            <ListItemText primary={task} />
            <IconButton onClick={() => handleDeleteTask(index)}>
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
      <TextField
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Agregar tarea"
        fullWidth
      />
      <Fab
        color="primary"
        aria-label="add"
        className={classes.addButton}
        onClick={handleAddTask}
      >
        <AddIcon />
      </Fab>
    </div>
  );
};

export default TaskList;