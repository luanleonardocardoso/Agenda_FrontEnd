import React, { useState, useEffect } from 'react';
import { AddTaskPopupStyles } from './ComponentStyles'; // Importa os estilos do Styles.js

const AddTaskPopup = ({ show, onClose, onTaskAdded }) => {
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    if (show) {
      setDate('');
      setStartTime('');
      setEndTime('');
      setDescription('');
      setErrors({});
      setApiError('');
    }
  }, [show]);

  if (!show) return null;

  const validateFields = () => {
    const newErrors = {};
    if (!date) newErrors.date = 'A data é obrigatória';
    if (!startTime) newErrors.startTime = 'A hora inicial é obrigatória';
    if (!endTime) newErrors.endTime = 'A hora final é obrigatória';
    if (!description) newErrors.description = 'A descrição é obrigatória';
    return newErrors;
  };

  const handleSave = () => {
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSaving(true);

    const newAppointment = {
      daySchedule: date,
      initialScheduledTime: startTime,
      finalScheduledTime: endTime,
      description: description,
    };

    fetch('http://localhost:8080/api/appointments/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newAppointment),
    })
      .then(response => {
        if (response.ok) {
          return response.text();
        } else if (response.status === 400) {
          return response.text().then(errorMessage => {
            throw new Error(errorMessage);
          });
        }
        throw new Error('Falha ao adicionar tarefa');
      })
      .then(message => {
        console.log(message);
        onClose();
        onTaskAdded();
      })
      .catch(error => {
        setApiError(error.message);
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  return (
    <div style={AddTaskPopupStyles.overlay}>
      <div style={AddTaskPopupStyles.popup}>
        <h2 style={AddTaskPopupStyles.title}>Adicionar Nova Tarefa</h2>
        {apiError && <span style={AddTaskPopupStyles.apiErrorText}>{apiError}</span>}
        <div style={AddTaskPopupStyles.formGroup}>
          <label style={AddTaskPopupStyles.label}>Data:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{ ...AddTaskPopupStyles.input, borderColor: errors.date ? 'red' : '#ccc' }}
          />
          {errors.date && <span style={AddTaskPopupStyles.errorText}>{errors.date}</span>}
        </div>
        <div style={AddTaskPopupStyles.formGroup}>
          <label style={AddTaskPopupStyles.label}>Hora Inicial:</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            style={{ ...AddTaskPopupStyles.input, borderColor: errors.startTime ? 'red' : '#ccc' }}
          />
          {errors.startTime && <span style={AddTaskPopupStyles.errorText}>{errors.startTime}</span>}
        </div>
        <div style={AddTaskPopupStyles.formGroup}>
          <label style={AddTaskPopupStyles.label}>Hora Final:</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            style={{ ...AddTaskPopupStyles.input, borderColor: errors.endTime ? 'red' : '#ccc' }}
          />
          {errors.endTime && <span style={AddTaskPopupStyles.errorText}>{errors.endTime}</span>}
        </div>
        <div style={AddTaskPopupStyles.formGroup}>
          <label style={AddTaskPopupStyles.label}>Descrição:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ ...AddTaskPopupStyles.textarea, borderColor: errors.description ? 'red' : '#ccc' }}
          />
          {errors.description && <span style={AddTaskPopupStyles.errorText}>{errors.description}</span>}
        </div>
        <div style={AddTaskPopupStyles.buttonGroup}>
          <button style={AddTaskPopupStyles.button} onClick={onClose}>Cancelar</button>
          <button
            style={{ ...AddTaskPopupStyles.button, backgroundColor: isSaving ? '#ccc' : '#00b7fd' }}
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTaskPopup;
