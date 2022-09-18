import React, { useRef, useState } from 'react';
import { 
  Box,
  Heading,
  Text,
  CircularProgress,
  CircularProgressLabel,
  HStack,
  VStack,
  Select,
  CheckboxGroup,
  Checkbox,
  Icon,
  Switch,
  Button
} from '@chakra-ui/react';
import { GiSpellBook, GiBookshelf } from 'react-icons/gi';
import Countdown, { zeroPad } from 'react-countdown';
import './App.css';

function App() {
  const [appIsOn, setAppIsOn] = useState(true);
  const [countdownStarted, setCountdownStarted] = useState(false);
  const [focusTime, setFocusTime] = useState(0);
  const countdownRef = useRef<any>();

  const focusOptions = [
    {
      label: "30min",
      timeInMil: 1800000
    },
    {
      label: "45min",
      timeInMil: 2700000
    },
    {
      label: "1hr",
      timeInMil: 3600000
    },
    {
      label: "1hr 15min",
      timeInMil: 4500000
    },
    {
      label: "1hr 30min",
      timeInMil: 5400000
    },
    {
      label: "1hr 45min",
      timeInMil: 6300000
    },
    {
      label: "2hr",
      timeInMil: 7200000
    },
    {
      label: "2hr 30min",
      timeInMil: 9000000
    },
    {
      label: "3hrs",
      timeInMil: 10800000
    },
  ]

  const getFocusValue = () => {
    const value = (document.getElementById('focusSelect') as HTMLInputElement).value;
    setFocusTime(parseInt(value));
  }

  return (
    <Box 
      backdropBlur="md"
      backgroundColor="whitesmoke"
      alignContent="center"
    >
      <VStack>
        <HStack spacing={3} mt={3}>
          <Heading>Study Habits</Heading>
          <VStack>
            <Icon 
              onClick={() => setAppIsOn(!appIsOn)}
              as={appIsOn ? GiSpellBook : GiBookshelf}
              color={appIsOn ? "green.500" : "gray.700"}
              boxSize={10}
              aria-label='On/Off Toggle'
            />
            <Switch
              onChange={() => setAppIsOn(!appIsOn)}
              isChecked={appIsOn}
              size="md"
              colorScheme="green"
              aria-label='On/Off Toggle'
            />
          </VStack>
        </HStack>
        <CircularProgress value={30} color="red.500" size="200px" thickness='12px'>
          <CircularProgressLabel fontSize="lg">
            <Countdown
              date={Date.now() + focusTime}
              autoStart={false}
              ref={countdownRef}
              renderer={props => 
              {return countdownStarted && (
                <Box>
                  <span>
                    {zeroPad(props.hours)}:{zeroPad(props.minutes)}:{zeroPad(props.seconds)}
                  </span>
                </Box>
              );}
              }
            />
            {!countdownStarted && (
              <Button
                size="xs"
                colorScheme="red"
                isDisabled={focusTime === 0}
                onClick={() => {
                  setCountdownStarted(true);
                  countdownRef.current.start();
                }}
              >
                Start
              </Button>
            )}
          </CircularProgressLabel>
        </CircularProgress>
        <Text as="u" fontSize="xl">Ratio</Text>
        <HStack>
          <VStack>
            <Text fontSize="md">Focus Time</Text>
            <Select id="focusSelect" placeholder='Set Focus Time' onChange={() => getFocusValue()}>
              {focusOptions.map((option, i) => {
                return (
                  <option key={i} value={option.timeInMil}>{option.label}</option>
                )
              })}
            </Select>
          </VStack>
          <Text pt="30px" fontSize="md">to</Text>
          <VStack>
            <Text fontSize="md">Break Time</Text>
            <Select />
          </VStack>
        </HStack>
        <Button size="xs" colorScheme="green">Enter</Button>
        <Text as="u" fontSize="xl">Blocked Sites</Text>
        <CheckboxGroup>
          <VStack spacing={1} alignItems="flex-start">
            <Checkbox>Test</Checkbox>
            <Checkbox>Test 2</Checkbox>
          </VStack>
        </CheckboxGroup>
      </VStack>
    </Box>
  );
}

export default App;
