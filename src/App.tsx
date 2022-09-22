import React, { useRef, useState } from 'react';
import { 
  Box,
  Heading,
  Text,
  HStack,
  VStack,
  CheckboxGroup,
  Checkbox,
  Icon,
  Switch,
  Button,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter
} from '@chakra-ui/react';
import { GiSpellBook, GiBookshelf } from 'react-icons/gi';
import Countdown, { zeroPad } from 'react-countdown';
import { buildStyles, CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './App.css';

function App() {
  const [appIsOn, setAppIsOn] = useState(true);
  const [focusTime, setFocusTime] = useState(3600000);
  const [breakTime, setBreakTime] = useState(900000);
  const [finalFocus, setFinalFocus] = useState(1);
  const [finalBreak, setFinalBreak] = useState(0);
  const [onBreak, setOnBreak] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const countdownRef = useRef<any>();
  var countdownValue = countdownRef?.current?.total;
  console.log("count", countdownValue);

  const confirmSetTimes = () => {
    setFinalFocus(focusTime);
    setFinalBreak(breakTime);
  }

  const startCountdown = () => {
    confirmSetTimes();
    setTimeout(() => {
      countdownRef.current.start();
    }, 100)
  }

  const startBreak = () => {
    setTimeout(() => {
      countdownRef.current.start();
      console.log("hit timeout");
    }, 100)
  }

  return (
    <Box 
      backdropBlur="md"
      backgroundColor="whitesmoke"
      alignContent="center"
    >
      <VStack pb={4}>
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
        <Countdown
          date={onBreak ? Date.now() + finalBreak : Date.now() + finalFocus}
          onStop={() => {setOnBreak(!onBreak); startBreak();}}
          autoStart={false}
          ref={countdownRef}
          renderer={props => 
          {return (
            <Box width="65%" height="55%">
              <CircularProgressbarWithChildren 
                value={finalFocus - props.total}
                maxValue={finalFocus}
                counterClockwise={onBreak}
                styles={buildStyles({
                  rotation: 1/(finalFocus/1000),
                  strokeLinecap: 'round',
                  pathTransitionDuration: 0.1,
                  pathColor: '#e42d2d',
                })}
              >
                <Box>
                  <span>
                    {zeroPad(props.hours)}:{zeroPad(props.minutes)}:{zeroPad(props.seconds)}
                  </span>
                </Box>
              </CircularProgressbarWithChildren>
            </Box>
          )}
          }
        />
        <Text fontSize="md" as="u">Focus Time</Text>
        <Box width="80%" pb={4}>
          <Slider
            min={1}
            max={126}
            defaultValue={36}
            step={9}
            onChange={(val) => setFocusTime(val * 100000)}
          >
            <SliderMark mt={2} ml={-2.5} fontSize="sm" value={36}>
              1hr
            </SliderMark>
            <SliderMark mt={2} ml={-2.5} fontSize="sm" value={72}>
              2hr
            </SliderMark>
            <SliderMark mt={2} ml={-2.5} fontSize="sm" value={108}>
              3hr
            </SliderMark>
            <SliderTrack>
              <SliderFilledTrack bg="red.500" />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </Box>
        <Text fontSize="md" as="u">Break Time</Text>
        <Box width="80%" pb={4}>
          <Slider
            min={1}
            max={33}
            defaultValue={9}
            step={3}
            onChange={(val) => setBreakTime(val * 100000)}
          >
            <SliderMark mt={2} ml={-2.5} fontSize="sm" value={9}>
              15m
            </SliderMark>
            <SliderMark mt={2} ml={-2.5} fontSize="sm" value={18}>
              30m
            </SliderMark>
            <SliderMark mt={2} ml={-2.5} fontSize="sm" value={27}>
              45m
            </SliderMark>
            <SliderTrack>
              <SliderFilledTrack bg="blue.500" />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </Box>
        <Button size="xs" colorScheme="green" onClick={onOpen}>Enter</Button>
        <Text as="u" fontSize="xl">Blocked Sites</Text>
        <CheckboxGroup>
          <VStack spacing={1} alignItems="flex-start">
            <Checkbox>Test</Checkbox>
            <Checkbox>Test 2</Checkbox>
          </VStack>
        </CheckboxGroup>
      </VStack>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent width="90%">
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Yo</Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='red' mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="green"
              onClick={() => {
                startCountdown();
                onClose();
              }}
            >
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default App;
