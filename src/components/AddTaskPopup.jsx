import React, { useState, useEffect } from 'react';

const AddTaskPopup = ({ show, onClose, onTaskAdded }) => {
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false); // Estado para desabilitar o botão enquanto salva
  const [apiError, setApiError] = useState(''); // Estado para erros da API

  useEffect(() => {
    if (show) {
      // Resetar todos os campos e erros quando o popup é aberto
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

    setIsSaving(true); // Desabilitar o botão enquanto a requisição está em andamento

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
        onClose(); // Fecha o popup após salvar
        onTaskAdded(); // Chama a função para recarregar os dados do calendário
      })
      .catch(error => {
        setApiError(error.message); // Exibe a mensagem de erro retornada pela API
      })
      .finally(() => {
        setIsSaving(false); // Habilitar o botão após a conclusão da operação
      });
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <h2 style={styles.title}>Adicionar Nova Tarefa</h2>
        {apiError && <span style={styles.apiErrorText}>{apiError}</span>}
        <div style={styles.formGroup}>
          <label style={styles.label}>Data:</label>
          <input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
            style={{ ...styles.input, borderColor: errors.date ? 'red' : '#ccc' }}
          />
          {errors.date && <span style={styles.errorText}>{errors.date}</span>}
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Hora Inicial:</label>
          <input 
            type="time" 
            value={startTime} 
            onChange={(e) => setStartTime(e.target.value)} 
            style={{ ...styles.input, borderColor: errors.startTime ? 'red' : '#ccc' }}
          />
          {errors.startTime && <span style={styles.errorText}>{errors.startTime}</span>}
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Hora Final:</label>
          <input 
            type="time" 
            value={endTime} 
            onChange={(e) => setEndTime(e.target.value)} 
            style={{ ...styles.input, borderColor: errors.endTime ? 'red' : '#ccc' }}
          />
          {errors.endTime && <span style={styles.errorText}>{errors.endTime}</span>}
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Descrição:</label>
          <textarea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ ...styles.textarea, borderColor: errors.description ? 'red' : '#ccc' }}
          />
          {errors.description && <span style={styles.errorText}>{errors.description}</span>}
        </div>
        <div style={styles.buttonGroup}>
          <button style={styles.button} onClick={onClose}>Cancelar</button>
          <button 
            style={{ ...styles.button, backgroundColor: isSaving ? '#ccc' : '#00b7fd' }} 
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

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  popup: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    position: 'relative',
    minWidth: '320px',
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    marginBottom: '20px',
    textAlign: 'center',
  },
  formGroup: {
    width: '100%',
    marginBottom: '15px',
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  label: {
    alignSelf: 'flex-start',
    marginBottom: '5px',
    fontWeight: 'bold',
  },
  input: {
    width: '90%',
    padding: '8px',
    fontSize: '16px',
  },
  textarea: {
    width: '90%',
    padding: '8px',
    fontSize: '16px',
    minHeight: '80px',
    resize: 'none',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    padding: '10px 15px',
    fontSize: '16px',
    cursor: 'pointer',
    flex: 1,
    margin: '0 5px',
    borderRadius: '5px',
    border: 'none',
    color: '#fff',
  },
  errorText: {
    color: 'red',
    fontSize: '12px',
    marginTop: '5px',
  },
  apiErrorText: {
    color: 'red',
    fontSize: '14px',
    marginBottom: '10px',
    textAlign: 'center',
  },
};

export default AddTaskPopup;
