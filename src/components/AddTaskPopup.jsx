import React, { useState, useEffect } from 'react'; 
import { AddTaskPopupStyles } from './ComponentStyles';

const AddTaskPopup = ({ show, onClose, onTaskAdded }) => {
  // Define estados para os campos do formulário e controle de erros
  const [date, setDate] = useState(''); 
  const [startTime, setStartTime] = useState(''); 
  const [endTime, setEndTime] = useState(''); 
  const [description, setDescription] = useState(''); 
  const [errors, setErrors] = useState({}); 
  const [isSaving, setIsSaving] = useState(false); 
  const [apiError, setApiError] = useState('');

  // reseta os campos quando o popup é exibido
  useEffect(() => {
    if (show) {
      // Limpa todos os campos quando o popup é aberto.
      setDate('');
      setStartTime('');
      setEndTime('');
      setDescription('');
      setErrors({});
      setApiError('');
    }
  }, [show]); // Dependência em 'show' para rodar sempre que o valor mudar.

  // Se o popup não estiver visível, retorna null e não renderiza o componente.
  if (!show) return null;

  // Função para validar os campos do formulário
  const validateFields = () => {
    const newErrors = {};
    if (!date) newErrors.date = 'A data é obrigatória';
    if (!startTime) newErrors.startTime = 'A hora inicial é obrigatória';
    if (!endTime) newErrors.endTime = 'A hora final é obrigatória';
    if (!description) newErrors.description = 'A descrição é obrigatória';
    return newErrors;
  };

  // Função para salvar a nova tarefa
  const handleSave = () => {
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSaving(true); // Define que está salvando.

    // Cria o objeto de agendamento com os dados do formulário.
    const newAppointment = {
      daySchedule: date,
      initialScheduledTime: startTime,
      finalScheduledTime: endTime,
      description: description,
    };

    // Faz uma requisição para a API para adicionar a tarefa.
    fetch('http://localhost:8080/api/appointments/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newAppointment),
    })
      .then(response => {
        if (response.ok) {
          return response.text(); // Se a resposta for OK, retorna o texto da resposta.
        } else if (response.status === 400) {
          return response.text().then(errorMessage => {
            throw new Error(errorMessage); // Lança um erro personalizado se a resposta for 400 (bad request).
          });
        }
        throw new Error('Falha ao adicionar tarefa'); // Lança um erro genérico se a resposta não for 200 ou 400.
      })
      .then(message => {
        console.log(message);
        onClose(); // Fecha o popup.
        onTaskAdded(); // Notifica que a tarefa foi adicionada.
      })
      .catch(error => {
        setApiError(error.message); // Define o erro da API no estado, para exibir na interface.
      })
      .finally(() => {
        setIsSaving(false); // Finaliza o estado de salvamento, habilitando os botões novamente.
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
            onChange={(e) => setDate(e.target.value)} // Atualiza a data ao mudar o valor.
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
