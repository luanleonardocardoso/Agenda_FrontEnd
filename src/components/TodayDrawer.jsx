import React, { useEffect, useState } from 'react';

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

  const styles = {
    drawer: {
      position: 'fixed',
      left: 0,
      top: 0,
      width: '300px',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Cor preta semitransparente
      boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
      padding: '20px',
      overflowY: 'auto',
      zIndex: 1000,
      color: '#fff', // Texto branco para melhor contraste com o fundo
    },
    title: {
      textAlign: 'center',
      marginBottom: '20px',
      color: '#fff',
    },
    taskItem: {
      borderBottom: '1px solid #ddd',
      padding: '10px 0',
      color: '#fff',
    },
    taskText: {
      margin: '5px 0',
    },
    strongText: {
      fontWeight: 'bold',
      color: '#fff',
    },
    message: {
      color: '#fff', // Cor branca para o texto da mensagem
    }
  };

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
