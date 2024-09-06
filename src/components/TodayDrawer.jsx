import React, { useEffect, useState } from 'react';
import { TodayDrawerStyles as styles } from './ComponentStyles';

// Componente para exibir as atividades do dia atual
const TodayDrawer = ({ reload }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const today = new Date().toISOString().split('T')[0];

  // Busca as tarefas sempre que o componente for montado ou o valor de `reload` mudar
  useEffect(() => {
    // Função assíncrona para buscar as atividades do dia atual a partir da API
    const fetchTodayTasks = async () => {
      try {
        // Faz uma requisição GET à API para buscar as tarefas do dia atual
        const response = await fetch(`http://localhost:8080/api/appointments?date=${today}`);
        const data = await response.json(); // Converte a resposta para JSON
        
        // Ordena as tarefas pelo horário inicial (menor para maior)
        const sortedTasks = data.sort((a, b) => a.initialScheduledTime.localeCompare(b.initialScheduledTime));

        // Atualiza o estado com as tarefas ordenadas
        setTasks(sortedTasks); 
      } catch (error) {
        console.error('Erro ao carregar as tarefas do dia:', error); 
      } finally {
        setLoading(false);
      }
    };

    fetchTodayTasks(); // Chama a função para buscar as tarefas do dia
  }, [today, reload]); // Dependências: o hook será executado se a data de hoje ou a prop `reload` mudar

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

export default TodayDrawer; // Exporta o componente para ser utilizado em outras partes da aplicação
