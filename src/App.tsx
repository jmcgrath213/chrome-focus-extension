import React from 'react';
import { Box, Heading, CircularProgress, CircularProgressLabel } from '@chakra-ui/react';
import logo from './logo.svg';
import './App.css';

function App() {

  return (
    <Box>
      <img src={logo} className="App-logo" alt="logo" />
      <Heading>Test Header</Heading>
      <CircularProgress value={30} color='orange.400' thickness='12px'>
        <CircularProgressLabel>30%</CircularProgressLabel>
      </CircularProgress>
    </Box>
    
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.tsx</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
  );
}

export default App;
