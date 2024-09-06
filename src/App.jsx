import React, { useState } from 'react';
import Calendar from './components/Calendar';
import AddTaskPopup from './components/AddTaskPopup';
import TodayDrawer from './components/TodayDrawer';
import useCalendar from './hooks/UseCalendar';
import { AppStyles as styles } from './GlobalStyles';

const App = () => {
  const { year, month, nextMonth, prevMonth, getMonthName } = useCalendar();
  const [reload, setReload] = useState(false);
  const [showAddTaskPopup, setShowAddTaskPopup] = useState(false);

  const openAddTaskPopup = () => {
    setShowAddTaskPopup(true);
  };

  const closeAddTaskPopup = () => {
    setShowAddTaskPopup(false);
  };

  // Função que será chamada para atualizar o drawer e o calendário após qualquer mudança
  const handleTaskUpdated = () => {
    setReload(!reload);
  };

  return (
    <div style={styles.appContainer}>
      <TodayDrawer reload={reload} />

      <div style={styles.mainContent}>
        <img src="/logo.png" alt="Logo" style={styles.logo} />
        <div style={styles.monthContainer}>
          <button onClick={prevMonth} style={styles.button}>
            <img src="/left-arrow.png" alt="Previous Month" style={styles.arrow} />
          </button>
          <h2 style={styles.monthDisplay}>{getMonthName()} {year}</h2>
          <button onClick={nextMonth} style={styles.button}>
            <img src="/right-arrow.png" alt="Next Month" style={styles.arrow} />
          </button>
        </div>
        <Calendar year={year} month={month} onTaskUpdated={handleTaskUpdated} reload={reload} />
        <button onClick={openAddTaskPopup} style={styles.addButton}>Adicionar nova Tarefa</button>
        <AddTaskPopup 
          show={showAddTaskPopup} 
          onClose={closeAddTaskPopup} 
          onTaskAdded={handleTaskUpdated}
        />
      </div>
    </div>
  );
};

export default App;
