import React, { useEffect, useState } from 'react';
import { TodayDrawerStyles as styles } from './ComponentStyles'; // Importando os estilos

const TodayDrawer = ({ reload }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const today = new Date().toISOString().split('T')[0]; // Obter data de hoje no formato yyyy-mm-dd

  useEffect(() => {
    // Função para buscar as atividades do dia atual
    const fetchTodayTasks = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/appointments?date=${today}`);
        const data = await response.json();
        
        // Ordenar tarefas do menor horário (inicial) para o maior
        const sortedTasks = data.sort((a, b) => a.initialScheduledTime.localeCompare(b.initialScheduledTime));

        setTasks(sortedTasks); // Atualizar o estado com as tarefas ordenadas
      } catch (error) {
        console.error('Erro ao carregar as tarefas do dia:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTodayTasks();
  }, [today, reload]); // O drawer será recarregado sempre que `reload` mudar

  return (
    <div style={styles.drawer}>
      <h2 style={styles.title}>Atividades Hoje</h2>
      {loading ? (
        <p>Carregando...</p>
      ) : tasks.length > 0 ? (
        <ul>
          {tasks.map(task => (
            <li key={task.idSchedule} style={styles.taskItem}>
              <p style={styles.taskText}>
                <span style={styles.strongText}>Hora:</span> {task.initialScheduledTime} - {task.finalScheduledTime}
              </p>
              <p style={styles.taskText}>
                <span style={styles.strongText}>Descrição:</span> {task.description}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p style={styles.message}>Hoje você não possui atividades agendadas.</p>
      )}
    </div>
  );
};

export default TodayDrawer;
