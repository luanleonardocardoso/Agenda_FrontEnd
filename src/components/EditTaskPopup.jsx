import React, { useState, useEffect } from 'react';
import Popup from './Popup';
import { EditTaskPopupStyles as styles } from './ComponentStyles'; // Importando os estilos

const EditTaskPopup = ({ show, onClose, task, date, onTaskUpdated }) => {
  const [taskDate, setTaskDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [description, setDescription] = useState('');
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    if (show && task) {
      setTaskDate(date || ''); 
      setStartTime(task.initialScheduledTime);
      setEndTime(task.finalScheduledTime);
      setDescription(task.description);
      setIsModified(false); 
    }
  }, [show, task, date]);

  const handleInputChange = (setter, originalValue) => (e) => {
    setter(e.target.value);
    if (e.target.value !== originalValue) {
      setIsModified(true); 
    }
  };

  const handleSave = () => {
    const updatedTask = {
      idSchedule: task.idSchedule,
      daySchedule: taskDate,
      initialScheduledTime: startTime,
      finalScheduledTime: endTime,
      description: description,
    };

    fetch('http://localhost:8080/api/appointments/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTask),
    })
    .then(response => {
      if (response.ok) {
        return response.text();
      } else if (response.status === 400) {
        return response.text().then(errorMessage => {
          throw new Error(errorMessage);
        });
      }
      throw new Error('Failed to update appointment');
    })
    .then(message => {
      console.log(message);
      onClose();
      onTaskUpdated(); 
    })
    .catch(error => {
      alert(error.message);
    });
  };

  return (
    <Popup show={show} onClose={onClose}>
      <h2 style={styles.title}>Editar Tarefa</h2>
      <div style={styles.formGroup}>
        <label style={styles.label}>Data:</label>
        <input 
          type="date" 
          value={taskDate} 
          onChange={handleInputChange(setTaskDate, date)}
          style={styles.input}
        />
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Hora Inicial:</label>
        <input 
          type="time" 
          value={startTime} 
          onChange={handleInputChange(setStartTime, task.initialScheduledTime)}
          style={styles.input}
        />
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Hora Final:</label>
        <input 
          type="time" 
          value={endTime} 
          onChange={handleInputChange(setEndTime, task.finalScheduledTime)}
          style={styles.input}
        />
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Descrição:</label>
        <textarea 
          value={description}
          onChange={handleInputChange(setDescription, task.description)}
          style={styles.textarea}
        />
      </div>
      <div style={styles.buttonGroup}>
        <button style={styles.button} onClick={onClose}>Cancelar</button>
        {isModified && (
          <button style={styles.button} onClick={handleSave}>
            Salvar alterações
          </button>
        )}
      </div>
    </Popup>
  );
};

export default EditTaskPopup;
