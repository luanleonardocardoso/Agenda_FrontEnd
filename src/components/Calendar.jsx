import React, { useState, useEffect, useCallback } from 'react';
import Popup from './Popup';
import EditTaskPopup from './EditTaskPopup';
import { FaTrash } from 'react-icons/fa';
import { CalendarStyles as styles } from './ComponentStyles';

const Calendar = ({ year, month, onTaskUpdated, reload }) => {
  // Estados para controlar o popup
  const [showPopup, setShowPopup] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [appointmentDetails, setAppointmentDetails] = useState([]);
  const [appointments, setAppointments] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(false);

  // Informações da data atual
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth() + 1; // Janeiro é indexado como 0, então add 1
  const currentYear = currentDate.getFullYear();

  // Função para buscar compromissos dia a dia do mês atual
  const fetchAppointmentsForMonth = useCallback(async () => {
    const daysInMonth = new Date(year, month, 0).getDate(); // Número de dias no mês
    let appointmentsData = {}; // Objeto para armazenar dias com compromissos

    // Loop por todos os dias do mês para verificar compromissos
    for (let day = 1; day <= daysInMonth; day++) {
      const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

      try {
        const response = await fetch(`http://localhost:8080/api/appointments/check?date=${formattedDate}`);
        const hasAppointment = await response.json(); // Verifica se o dia tem compromisso

        if (hasAppointment) {
          appointmentsData[day] = true; // Marca o dia como tendo compromisso
        }
      } catch (error) {
        console.error(`Erro ao buscar compromissos para o dia ${formattedDate}:`, error);
      }
    }

    setAppointments(appointmentsData); // Atualiza o estado com os dias que possuem compromissos
  }, [year, month]);

  // carrega dados ao inicializar ou quando o mês/ano mudar
  useEffect(() => {
    const loadData = async () => {
      setLoading(true); // Mostra o estado de carregamento
      await fetchAppointmentsForMonth(); // Busca compromissos para o mês
      setTimeout(() => {
        setLoading(false); // Desativa o carregamento após 2,5 segundos
        setIsLoaded(true); // Marca o calendário como carregado
      }, 1500); // Simula um atraso de 1,5 segundos
    };

    loadData(); // Chama a função de carregamento de dados
  }, [fetchAppointmentsForMonth, reload]); // Recarrega sempre que o mês/ano ou a prop 'reload' mudar

  // Função para buscar detalhes de compromissos de uma data específica
  const fetchAppointmentDetails = useCallback(() => {
    if (selectedDate) {
      const formattedDate = `${selectedDate.year}-${String(selectedDate.month).padStart(2, '0')}-${String(selectedDate.day).padStart(2, '0')}`;
      fetch(`http://localhost:8080/api/appointments?date=${formattedDate}`)
        .then(response => {
          if (!response.ok) {
            throw new Error("Erro ao conectar com a API");
          }
          return response.json(); // Processa a resposta da API
        })
        .then(details => setAppointmentDetails(details)) // Armazena os detalhes dos compromissos no estado
        .catch(error => {
          console.error("Erro ao buscar compromissos:", error);
          setAppointmentDetails([]); // Define o estado como vazio em caso de erro
        });
    }
  }, [selectedDate]);

  // Carrega detalhes dos compromissos quando o popup é aberto
  useEffect(() => {
    if (showPopup) {
      fetchAppointmentDetails(); // Busca detalhes ao abrir o popup
    }
  }, [fetchAppointmentDetails, showPopup]);

  // Função chamada ao clicar em um dia do calendário
  const handleDayClick = (slot) => {
    // Bloqueia dias anteriores sem atividades
    if (!slot.currentMonth || (slot.isPast && !appointments[slot.day])) return;

    // Define a data selecionada
    const selected = {
      day: String(slot.day).padStart(2, '0'),
      month: String(month).padStart(2, '0'),
      year: year
    };

    setSelectedDate(selected);
    setShowPopup(true); // Exibe o popup
  };

  // Função para fechar o popup
  const closePopup = () => {
    setShowPopup(false);
    setSelectedDate(null);
    setAppointmentDetails([]); // Limpa os detalhes ao fechar o popup
  };

  // Função chamada ao clicar em uma tarefa
  const handleTaskClick = (task) => {
    setSelectedTask(task); // Define a tarefa selecionada para edição
  };

  // Função para fechar o popup de edição de tarefa
  const closeEditPopup = () => {
    setSelectedTask(null);
  };

  // Função chamada após a atualização de uma tarefa
  const handleTaskUpdatedInternal = () => {
    fetchAppointmentDetails(); // Recarrega os detalhes do compromisso
    closeEditPopup(); // Fecha o popup de edição
    onTaskUpdated(); // Notifica o componente pai para atualizar
  };

  // Função para excluir uma tarefa
  const handleTaskDelete = (idSchedule) => {
    fetch(`http://localhost:8080/api/appointments/delete/${idSchedule}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          fetchAppointmentDetails(); // Recarrega os compromissos após a exclusão
          onTaskUpdated(); // Atualiza os slots do calendário
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

  // Calcula os dias do mês e como eles se alinham no calendário
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayIndex = new Date(year, month - 1, 1).getDay();
  const daysInPrevMonth = new Date(year, month - 1, 0).getDate();

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const prevMonthDays = Array.from({ length: firstDayIndex }, (_, i) => daysInPrevMonth - firstDayIndex + i + 1);
  const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const lastDayIndex = (firstDayIndex + daysInMonth) % 7;
  const nextMonthDays = lastDayIndex !== 0 ? Array.from({ length: 7 - lastDayIndex }, (_, i) => i + 1) : []; 

  // Cria os slots para o calendário (dias do mês anterior, atual e próximo)
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
      {loading ? ( // Mostra o GIF de carregamento enquanto os dados estão sendo carregados
        <div style={styles.loadingContainer}>
          <img src="/loading.gif" alt="Carregando" style={styles.loadingGif} />
        </div>
      ) : (
        isLoaded ? ( // Exibe o calendário após os dados terem sido carregados
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
                    ? '#28a745' // Verde se houver compromisso no dia atual
                    : slot.currentMonth && slot.isPast && appointments[slot.day]
                      ? '#ffcccc' // Vermelho claro para dias passados com atividades
                      : 'rgba(0, 0, 0, 0.8)', // Cor padrão para dias sem compromissos
                  color: slot.currentMonth
                    // Vermelho escuro para passados com atividades
                    ? (slot.isPast ? (appointments[slot.day] ? '#8b0000' : '#721c24') : '#fff') 
                    : '#721c24',
                  cursor: (slot.currentMonth && slot.isPast && appointments[slot.day])
                    ? 'pointer' // Permite clique em dias passados com atividades
                    : (slot.currentMonth && !slot.isPast)
                      ? 'pointer' // Permite clique em dias futuros
                      : 'not-allowed', // Desabilita clique em dias não selecionáveis
                }}
                onClick={() => handleDayClick(slot)}
              >
                {slot.day}
              </div>
            ))}
          </div>
        ) : (
          <p>Carregando...</p> // Exibe texto de carregamento se ainda não estiver pronto
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
                        onClick={() => handleTaskDelete(appointment.idSchedule)} // Excluir tarefa
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

export default Calendar;
