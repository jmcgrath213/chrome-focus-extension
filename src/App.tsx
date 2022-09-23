import React, { useEffect, useRef, useState } from 'react';
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
  const [finalCountdown, setFinalCountdown] = useState(1);
  const [finalProgress, setFinalProgress] = useState(1);
  const [onBreak, setOnBreak] = useState(false);
  const [resetTimer, setResetTimer] = useState(0);
  const [showStartBreak, setShowStartBreak] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const countdownRef = useRef<any>();

  chrome.runtime.connect();

  chrome.runtime.sendMessage({cmd: "getTime"}, response => {
    if(response.countdownTime && response.focusTime && response.breakTime && response.countdownTime > Date.now()) {
      setFinalProgress(onBreak ? response.breakTime : response.focusTime);
      setFinalCountdown(response.countdownTime);
    } 
  })

  useEffect(() => {
    setTimeout(() => {
      countdownRef.current.start();
    }, 100)
  }, [])

  //function for inital setting of focus and break times
  const confirmSetInitialTimes = () => {
    const finalFocusTime = Date.now() + focusTime;
    chrome.runtime.sendMessage({
      cmd: "setTime",
      countdownTime: finalFocusTime,
      focusTime: focusTime,
      breakTime: breakTime,
    });
    setFinalProgress(focusTime);
    setFinalCountdown(finalFocusTime);
  }

  //Starts the inital countdown when there is none already
  const startInitialCountdown = () => {
    confirmSetInitialTimes();
    setTimeout(() => {
      countdownRef.current.start();
    }, 100)
  }

  //Function for switching back to focus countdown after a break
  const resetFocusCountdown = () => {
    let currentFocusTime = 0;
    chrome.runtime.sendMessage({cmd: "getTime"}, response => {
      currentFocusTime = response.focusTime;
    })
    const finalFocusTime = Date.now() + currentFocusTime;
    chrome.runtime.sendMessage({
      cmd: "setTime",
      countdownTime: finalFocusTime,
    });
    setFinalProgress(currentFocusTime);
    setFinalCountdown(finalFocusTime);
    setOnBreak(!onBreak);
    setTimeout(() => {
      countdownRef.current.start();
    }, 100)
  }

  //Switches countdown from focus to break and back and so on...
  const countdownSwitch = () => {
    if(!onBreak){
      setShowStartBreak(true);
    }
    else if(onBreak){
      resetFocusCountdown();
    }
  }

  const startBreak = () => {
    let currentBreakTime = 0;
    chrome.runtime.sendMessage({cmd: "getTime"}, response => {
      currentBreakTime = response.breakTime;
      console.log("breakTime: ", response.breakTime)
    });
    const finalBreakTime = Date.now() + currentBreakTime;
    chrome.runtime.sendMessage({
      cmd: "setTime",
      countdownTime: finalBreakTime,
    });
    setFinalProgress(currentBreakTime);
    setFinalCountdown(finalBreakTime);
    setOnBreak(!onBreak)
    setTimeout(() => {
      countdownRef.current.start();
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
          date={finalCountdown}
          onComplete={() => {countdownSwitch();}}
          autoStart={false}
          ref={countdownRef}
          renderer={props => 
          {return (
            <Box width="65%" height="55%">
              <CircularProgressbarWithChildren 
                value={finalProgress - props.total}
                maxValue={finalProgress}
                styles={buildStyles({
                  rotation: 1/(finalProgress/1000),
                  strokeLinecap: 'round',
                  pathTransitionDuration: 0.1,
                  pathColor: '#e42d2d',
                })}
              >
                <Box>
                  {finalCountdown === 1 ? (
                    <Box>
                      <VStack alignItems="center">
                        <Text>Welcome to Study Habits!</Text>
                        <Text>▼ Set your times below ▼</Text>
                      </VStack>
                    </Box>
                  ) : (
                    <Box>
                      {showStartBreak ? (
                        <Box>
                          <VStack>
                            <Text>Time to start your break!</Text>
                            <Button
                              size="xs"
                              colorScheme="blue"
                              onClick={() => {startBreak(); setShowStartBreak(false)}}
                            >
                              Start
                            </Button>
                          </VStack>
                        </Box>
                      ) : (
                        <Box>
                          <VStack alignItems="center">
                            <Text>{onBreak ? 'Break Time!' : 'Focus Time!'}</Text>
                            <Box>
                              <span>
                                {zeroPad(props.hours)}:{zeroPad(props.minutes)}:{zeroPad(props.seconds)}
                              </span>
                            </Box>
                          </VStack>
                        </Box>
                      )}
                    </Box>
                  )}
                </Box>
              </CircularProgressbarWithChildren>
            </Box>
          )}
          }
        />
        <Text fontSize="md" as="u">Focus Time</Text>
        <Box width="80%" pb={4}>
          <Slider
            min={0.1}
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
            min={0.1}
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
        <ModalContent alignSelf="center" width="90%">
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
                startInitialCountdown();
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
