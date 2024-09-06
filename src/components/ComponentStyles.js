// Estilos do Popup Adicionar Tarefa
export const AddTaskPopupStyles = {
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

 // Estilos Calendário 
export const CalendarStyles = {
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

// Estilos para EditTaskPopup
export const EditTaskPopupStyles = {
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
  },
};

// Estilos Popup visão de tarefaz(Selecionar Slot)
// Styles.js
export const PopupStyles = {
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
    minWidth: '300px',
    minHeight: '200px',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'transparent',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
  },
};

// Estilos para o Drawer 
// Styles.js
export const TodayDrawerStyles = {
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
  },
};
