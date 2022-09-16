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
  Switch
} from '@chakra-ui/react';
import { GiSpellBook, GiBookmark } from 'react-icons/gi';
import './App.css';

function App() {
  const [appIsOn, setAppIsOn] = useState(true);

  return (
    <Box 
      backdropBlur="md"
      backgroundColor="ivory"
      alignContent="center"
    >
      <VStack>
        <HStack spacing={3} mt={3}>
          <Heading>Study Habits</Heading>
          <VStack>
            <Icon 
              onClick={() => setAppIsOn(!appIsOn)}
              as={appIsOn ? GiSpellBook : GiBookmark}
              color={appIsOn ? "green.500" : "gray.700"}
              boxSize={10}
            />
            <Switch onChange={() => setAppIsOn(!appIsOn)} isChecked={appIsOn} size="md" colorScheme="green" />
          </VStack>
        </HStack>
        <CircularProgress value={30} color='orange.400' size="200px" thickness='10px'>
          <CircularProgressLabel>30%</CircularProgressLabel>
        </CircularProgress>
        <Text as="u" fontSize="2xl">Ratio</Text>
        <HStack>
          <VStack>
            <Text fontSize="md">Focus Time</Text>
            <Select />
          </VStack>
          <Text pt="20px">to</Text>
          <VStack>
            <Text fontSize="md">Break Time</Text>
            <Select />
          </VStack>
        </HStack>
        <Text as="u" fontSize="2xl">Blocked Sites</Text>
        <CheckboxGroup>
          <VStack>
            <Checkbox>Test</Checkbox>
          </VStack>
        </CheckboxGroup>
      </VStack>
    </Box>
  );
}

export default App;
