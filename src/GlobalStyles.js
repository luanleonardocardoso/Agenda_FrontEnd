// Styles.js
export const AppStyles = {
    appContainer: {
      display: 'flex',
      height: '100vh',
      backgroundImage: `url('/background.jpeg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    mainContent: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      flexGrow: 1,
    },
    logo: {
      width: '120px',
      marginBottom: '20px',
      borderRadius: '50%',
      border: '5px solid white',
    },
    monthContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '10px',
    },
    button: {
      backgroundColor: 'transparent',
      border: 'none',
      padding: '8px',
      cursor: 'pointer',
    },
    arrow: {
      width: '20px',
      height: '20px',
    },
    monthDisplay: {
      margin: '0 10px',
      textAlign: 'center',
      color: '#000 !important',
      fontStyle: 'italic !important',
    },
    addButton: {
      marginTop: '10px',
      padding: '8px 15px',
      fontSize: '16px',
      cursor: 'pointer',
      backgroundColor: '#00b7fd',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
    },
  };
  