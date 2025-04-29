import axios from 'axios';

const groupTasksByDate = (taskList) => {
  return taskList.reduce((acc, task) => {
    const date = task.deadline.slice(0, 10);
    if (!acc[date]) acc[date] = [];
    acc[date].push(task);
    return acc;
  }, {});
};

const oneLess = (month, year, setMonth, setYear) => {
  if (month === 0) {
    setMonth(11);
    setYear(year - 1);
  } else {
    setMonth(month - 1);
  }
};

const oneMore = (month, year, setMonth, setYear) => {
  if (month === 11) {
    setMonth(0);
    setYear(year + 1);
  } else {
    setMonth(month + 1);
  }
};

const showTaskForm = (setShowTask) => setShowTask(true);

const Hide = (setShowTask, setShowProject, setTask, setDate, setProject) => {
  setShowTask(false);
  setShowProject(false);
  setTask('');
  setDate('');
  setProject('');
};

export {oneLess, oneMore, Hide, showTaskForm, groupTasksByDate}