import React, { useState } from 'react';
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
import './App.css';

function App() {
  const [appIsOn, setAppIsOn] = useState(true);
  const [focusTime, setFocusTime] = useState("");
  const [breakTime, setBreakTime] = useState("");

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
          <CircularProgressLabel fontSize="lg">0:59:34</CircularProgressLabel>
        </CircularProgress>
        <Text as="u" fontSize="xl">Ratio</Text>
        <HStack>
          <VStack>
            <Text fontSize="md">Focus Time</Text>
            <Select />
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
