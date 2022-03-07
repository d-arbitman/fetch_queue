import React from 'react';
import './App.css';
import Log from './features/log/Log';
import Container from 'react-bootstrap/Container';
import FormData from './features/formData/FormData.jsx';

const App = () => {
  return (
    <Container fluid="md">
      <div className="App">
        <header className="App-header">Fetch Queue</header>
        <FormData />
        <Log />
      </div>
    </Container>
  );
};

export default App;
