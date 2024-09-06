import React, { useState } from 'react';
import Calendar from './components/Calendar';
import AddTaskPopup from './components/AddTaskPopup';
import TodayDrawer from './components/TodayDrawer';
import useCalendar from './hooks/UseCalendar';

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
    setReload(!reload); // Alterna o estado para forçar o recarregamento do drawer e do calendário
  };

  const styles = {
    appContainer: {
      display: 'flex',
      height: '100vh',
      backgroundImage: `url('/background.jpeg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    mainContent: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      flexGrow: 1,
    },
    logo: {
      width: '120px',
      marginBottom: '20px',
      borderRadius: '50%',
      border: '5px solid white',
    },
    monthContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '10px',
    },
    button: {
      backgroundColor: 'transparent',
      border: 'none',
      padding: '8px',
      cursor: 'pointer',
    },
    arrow: {
      width: '20px',
      height: '20px',
    },
    monthDisplay: {
      margin: '0 10px',
      textAlign: 'center',
      color: '#000 !important',
      fontStyle: 'italic !important',
    },
    addButton: {
      marginTop: '10px',
      padding: '8px 15px',
      fontSize: '16px',
      cursor: 'pointer',
      backgroundColor: '#00b7fd',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
    },
  };

  return (
    <div style={styles.appContainer}>
      {/* Drawer que carrega as tarefas do dia atual e é recarregado com base no estado `reload` */}
      <TodayDrawer reload={reload} />

      {/* Conteúdo principal, incluindo o calendário */}
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
        {/* Passando `reload` como prop para o calendário */}
        <Calendar year={year} month={month} onTaskUpdated={handleTaskUpdated} reload={reload} />
        <button onClick={openAddTaskPopup} style={styles.addButton}>Adicionar nova Tarefa</button>
        <AddTaskPopup 
          show={showAddTaskPopup} 
          onClose={closeAddTaskPopup} 
          onTaskAdded={handleTaskUpdated} // Atualizar drawer e calendário ao adicionar tarefa
        />
      </div>
    </div>
  );
};

export default App;
