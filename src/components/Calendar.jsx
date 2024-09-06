import React, { useState, useEffect, useCallback } from 'react';
import Popup from './Popup';
import EditTaskPopup from './EditTaskPopup';
import { FaTrash } from 'react-icons/fa';

const Calendar = ({ year, month, onTaskUpdated, reload }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [appointmentDetails, setAppointmentDetails] = useState([]);
  const [appointments, setAppointments] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(false);

  const currentDate = new Date(); // Data atual
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth() + 1; // Ajustar para 1-indexado (Janeiro = 1)
  const currentYear = currentDate.getFullYear();

  // Função para buscar compromissos dia a dia
  const fetchAppointmentsForMonth = useCallback(async () => {
    const daysInMonth = new Date(year, month, 0).getDate();
    let appointmentsData = {};

    for (let day = 1; day <= daysInMonth; day++) {
      const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      try {
        const response = await fetch(`http://localhost:8080/api/appointments/check?date=${formattedDate}`);
        const hasAppointment = await response.json();

        if (hasAppointment) {
          appointmentsData[day] = true; // Marcar que o dia possui compromisso
        }
      } catch (error) {
        console.error(`Erro ao buscar compromissos para o dia ${formattedDate}:`, error);
      }
    }

    setAppointments(appointmentsData); // Atualizar o estado com os dias que têm compromissos
  }, [year, month]);

  // Sincronizar: buscar dados da API, depois exibir o GIF por 2,5 segundos e carregar os slots
  useEffect(() => {
    const loadData = async () => {
      setLoading(true); // Ativa o estado de carregamento antes de buscar os dados
      await fetchAppointmentsForMonth(); // Busca os compromissos do mês
      setTimeout(() => {
        setLoading(false); // Após 2,5 segundos, desativa o GIF e carrega os slots
        setIsLoaded(true); // Marca que os slots podem ser carregados
      }, 2500); // Espera 2,5 segundos após carregar os dados para exibir os slots
    };

    loadData(); // Chama a função para sincronizar a busca de dados e exibição do GIF
  }, [fetchAppointmentsForMonth, reload]);

  // Buscar detalhes do compromisso para um dia específico
  const fetchAppointmentDetails = useCallback(() => {
    if (selectedDate) {
      const formattedDate = `${selectedDate.year}-${String(selectedDate.month).padStart(2, '0')}-${String(selectedDate.day).padStart(2, '0')}`;
      fetch(`http://localhost:8080/api/appointments?date=${formattedDate}`)
        .then(response => {
          if (!response.ok) {
            throw new Error("Erro ao conectar com a API");
          }
          return response.json();
        })
        .then(details => setAppointmentDetails(details))
        .catch(error => {
          console.error("Erro ao buscar compromissos:", error);
          setAppointmentDetails([]); // Define como vazio em caso de erro
        });
    }
  }, [selectedDate]);

  // Carregar detalhes do compromisso ao abrir o popup
  useEffect(() => {
    if (showPopup) {
      fetchAppointmentDetails();
    }
  }, [fetchAppointmentDetails, showPopup]);

  const handleDayClick = (slot) => {
    if (!slot.currentMonth || (slot.isPast && !appointments[slot.day])) return; // Bloqueia dias anteriores sem atividade

    const selected = {
      day: String(slot.day).padStart(2, '0'),
      month: String(month).padStart(2, '0'),
      year: year
    };

    setSelectedDate(selected);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedDate(null);
    setAppointmentDetails([]);
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  const closeEditPopup = () => {
    setSelectedTask(null);
  };

  const handleTaskUpdatedInternal = () => {
    fetchAppointmentDetails();
    closeEditPopup();
    onTaskUpdated(); // Dispara a atualização do drawer e dos slots do calendário
  };

  const handleTaskDelete = (idSchedule) => {
    fetch(`http://localhost:8080/api/appointments/delete/${idSchedule}`, {
      method: 'DELETE',
    })
    .then(response => {
      if (response.ok) {
        fetchAppointmentDetails(); // Recarrega os compromissos após a exclusão
        onTaskUpdated(); // Atualiza o drawer e os slots do calendário após a exclusão
      } else {
        return response.text().then((text) => {
          throw new Error(text || 'Erro ao excluir a tarefa.');
        });
      }
    })
    .catch(error => {
      console.error("Erro ao excluir a tarefa:", error);
      alert(error.message || "Erro ao excluir a tarefa.");
    });
  };

  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayIndex = new Date(year, month - 1, 1).getDay();
  const daysInPrevMonth = new Date(year, month - 1, 0).getDate();

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const prevMonthDays = Array.from({ length: firstDayIndex }, (_, i) => daysInPrevMonth - firstDayIndex + i + 1);
  const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const lastDayIndex = (firstDayIndex + daysInMonth) % 7;
  const nextMonthDays = lastDayIndex !== 0 ? Array.from({ length: 7 - lastDayIndex }, (_, i) => i + 1) : [];

  const slots = [
    ...prevMonthDays.map(day => ({
      day, 
      currentMonth: false, 
      isPast: false,
    })),
    ...currentMonthDays.map(day => ({
      day, 
      currentMonth: true, 
      isPast: (year < currentYear || (year === currentYear && month < currentMonth) || (year === currentYear && month === currentMonth && day < currentDay))
    })),
    ...nextMonthDays.map(day => ({
      day, 
      currentMonth: false, 
      isPast: false,
    })),
  ];

  return (
    <div>
      {loading ? ( // Se estiver carregando, mostra o GIF de carregamento
        <div style={styles.loadingContainer}>
          <img src="/loading.gif" alt="Carregando" style={styles.loadingGif} />
        </div>
      ) : (
        isLoaded ? (
          <div style={styles.calendar}>
            {weekDays.map((day, index) => (
              <div key={index} style={{ ...styles.slot, fontWeight: 'bold' }}>
                {day}
              </div>
            ))}
            {slots.map((slot, index) => (
              <div 
                key={index} 
                style={{
                  ...styles.slot,
                  backgroundColor: slot.currentMonth && appointments[slot.day]
                    ? '#28a745' 
                    : slot.currentMonth && slot.isPast && appointments[slot.day]
                    ? '#ffcccc' // Vermelho claro para dias passados com atividades
                    : 'rgba(0, 0, 0, 0.8)',
                  color: slot.currentMonth 
                    ? (slot.isPast ? (appointments[slot.day] ? '#8b0000' : '#721c24') : '#fff') // Vermelho escuro se for passado com atividade
                    : '#721c24',
                  cursor: (slot.currentMonth && slot.isPast && appointments[slot.day]) 
                    ? 'pointer' 
                    : (slot.currentMonth && !slot.isPast) 
                    ? 'pointer' 
                    : 'not-allowed',
                }}
                onClick={() => handleDayClick(slot)}
              >
                {slot.day}
              </div>
            ))}
          </div>
        ) : (
          <p>Carregando...</p>
        )
      )}
      {showPopup && (
        <Popup show={showPopup} onClose={closePopup}>
          <h2 style={styles.popupTitle}>{selectedDate.day}/{selectedDate.month}/{selectedDate.year}</h2>
          {appointmentDetails.length > 0 ? (
            <table style={styles.appointmentTable}>
              <tbody>
                {appointmentDetails.map((appointment) => (
                  <tr 
                    key={appointment.idSchedule} 
                    style={styles.taskRow}
                  >
                    <td style={styles.iconCell}>
                      <FaTrash 
                        style={styles.trashIcon} 
                        onClick={() => handleTaskDelete(appointment.idSchedule)} 
                      />
                    </td>
                    <td style={styles.timeCell} onClick={() => handleTaskClick(appointment)}>
                      {appointment.initialScheduledTime}-{appointment.finalScheduledTime}
                    </td>
                    <td style={styles.descriptionCell} onClick={() => handleTaskClick(appointment)}>
                      {appointment.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Não há atividades</p>
          )}
        </Popup>
      )}
      {selectedTask && (
        <EditTaskPopup 
          show={!!selectedTask} 
          onClose={closeEditPopup} 
          task={selectedTask} 
          date={`${selectedDate.year}-${selectedDate.month}-${selectedDate.day}`} 
          onTaskUpdated={handleTaskUpdatedInternal} 
        />
      )}
    </div>
  );
};

const styles = {
  calendar: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '5px',
    padding: '10px',
  },
  slot: {
    border: '1px solid #ccc',
    borderRadius: '10px',
    padding: '10px',
    textAlign: 'center',
    fontSize: '14px',
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Fundo preto translúcido para os slots
    color: '#fff',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100px', // Define o tamanho mínimo da área de loading
  },
  loadingGif: {
    width: '100px', // Define o tamanho do GIF de carregamento
  },
  popupTitle: {
    textAlign: 'center',
    color: '#000', // Cor preta para a data no popup
    fontStyle: 'italic', // Estilo itálico para a data
  },
  appointmentTable: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  taskRow: {
    cursor: 'pointer',
    borderBottom: '1px solid #ccc',
    transition: 'background-color 0.2s ease',
  },
  iconCell: {
    width: '40px',
    textAlign: 'center',
  },
  trashIcon: {
    color: 'red',
    cursor: 'pointer',
  },
  timeCell: {
    border: '1px solid #ccc',
    padding: '8px',
    textAlign: 'left',
    width: '150px',
  },
  descriptionCell: {
    border: '1px solid #ccc',
    padding: '8px',
    textAlign: 'left',
  },
};

export default Calendar;
