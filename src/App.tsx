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
  const [finalFocusCountdown, setFinalFocusCountdown] = useState(1);
  const [finalFocusProgress, setFinalFocusProgress] = useState(1);
  const [finalBreakCountdown, setFinalBreakCountdown] = useState(1);
  const [finalBreakProgress, setFinalBreakProgress] = useState(1);
  const [focusCountdownKey, setFocusCountdownKey] = useState("focus");
  const [onBreak, setOnBreak] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const breakCountdownRef = useRef<any>();
  const focusCountdownRef = useRef<any>();

  chrome.runtime.connect();

  chrome.runtime.sendMessage({cmd: "getFocusTime"}, response => {
    if(response.focusCountdown && response.focusTime && response.countdownTime > Date.now()) {
      setFinalFocusCountdown(response.focusCountdown);
      setFinalFocusProgress(response.focusTime);
    }
  })

  chrome.runtime.sendMessage({cmd: "getBreakTime"}, response => {
    if(response.breakCountdown && response.breakTime && response.breakCountdown > Date.now()) {
      setFinalBreakCountdown(response.breakCountdown);
      setFinalBreakProgress(response.breakTime);
    }
  })

  chrome.runtime.sendMessage({cmd: "getOnBreak"}, response => {
    setOnBreak(response.onBreak);
  })

  useEffect(() => {
    setTimeout(() => {
      {onBreak ? breakCountdownRef.current.start() : focusCountdownRef.current.start()}
    }, 100)
  }, [])

  //function for inital setting of focus and break times
  const confirmSetInitialTimes = () => {
    const finalFocusTime = Date.now() + focusTime;
    chrome.runtime.sendMessage({
      cmd: "setFocusTime",
      focusCountdown: finalFocusTime,
      focusTime: focusTime,
      onBreak: false
    });
    chrome.runtime.sendMessage({
      cmd: "setBreakTime",
      focusTime: breakTime,
    });
    setFinalFocusProgress(focusTime);
    setFinalFocusCountdown(finalFocusTime);
  }

  //Starts the inital countdown when there is none already
  const startInitialCountdown = () => {
    confirmSetInitialTimes();
    setTimeout(() => {
      focusCountdownRef.current.start();
    }, 100)
  }

  //Function for switching back to focus countdown after a break
  const resetFocusCountdown = () => {
    chrome.runtime.sendMessage({cmd: "getTime"}, response => {
      if(response.focusTime) {
        setFocusTime(response.focusTime);
      }
    })
    const finalFocusTime = Date.now() + focusTime;
    chrome.runtime.sendMessage({
      cmd: "setFocusTime",
      focusCountdown: finalFocusTime,
      onBreak: false
    });
    setFinalFocusProgress(focusTime);
    setFinalFocusCountdown(finalFocusTime);
    setOnBreak(false);
  }

  //Switches countdown from focus to break and back and so on...
  const countdownSwitch = () => {
    if(!onBreak){
      setFocusCountdownKey("break");
      startBreak();
    }
    else if(onBreak){
      setFocusCountdownKey("focus");
      resetFocusCountdown();
    }
  }

  const startBreak = () => {
    chrome.runtime.sendMessage({cmd: "getBreakTime"}, response => {
      if(response.breakTime) {
        setBreakTime(response.breakTime);
      }
    });
    const finalBreakTime = Date.now() + breakTime;
    chrome.runtime.sendMessage({
      cmd: "setBreakTime",
      breakCountdown: finalBreakTime,
      onBreak: true
    });
    setFinalBreakProgress(breakTime);
    setFinalBreakCountdown(finalBreakTime);
    setOnBreak(true)
    setTimeout(() => {
      breakCountdownRef.current.start();
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
        {onBreak ? (
          <Box alignContent="center">
            <Countdown
              date={finalBreakCountdown}
              onComplete={() => {countdownSwitch();}}
              autoStart={false}
              ref={breakCountdownRef}
              renderer={props => 
              {return (
                <Box width="65%" height="55%">
                  <CircularProgressbarWithChildren 
                    value={finalBreakProgress - props.total}
                    maxValue={finalBreakProgress}
                    counterClockwise={true}
                    styles={buildStyles({
                      rotation: 1/(finalBreakProgress/1000),
                      strokeLinecap: 'round',
                      pathTransitionDuration: 0.1,
                      pathColor: 'blue',
                    })}
                  >
                    <Box>
                      <VStack alignItems="center">
                        <Text>Break Time!</Text>
                        <Box>
                          <span>
                            {zeroPad(props.hours)}:{zeroPad(props.minutes)}:{zeroPad(props.seconds)}
                          </span>
                        </Box>
                      </VStack>
                    </Box>
                  </CircularProgressbarWithChildren>
                </Box>
              )}
              }
            />
          </Box>
        ) : (
          <Box alignContent="center">
            <Countdown
              date={finalFocusCountdown}
              key={focusCountdownKey}
              onComplete={() => {countdownSwitch();}}
              autoStart={true}
              ref={focusCountdownRef}
              renderer={props => 
              {return (
                <Box width="65%" height="55%">
                  <CircularProgressbarWithChildren 
                    value={finalFocusProgress - props.total}
                    maxValue={finalFocusProgress}
                    styles={buildStyles({
                      rotation: 1/(finalFocusProgress/1000),
                      strokeLinecap: 'round',
                      pathTransitionDuration: 0.1,
                      pathColor: '#e42d2d',
                    })}
                  >
                    <Box>
                      {finalFocusCountdown === 1 ? (
                        <Box>
                          <VStack alignItems="center">
                            <Text>Welcome to Study Habits!</Text>
                            <Text>▼ Set your times below ▼</Text>
                          </VStack>
                        </Box>
                      ) : (
                        <Box>
                          <VStack alignItems="center">
                            <Text>Focus Time!</Text>
                            <Box>
                              <span>
                                {zeroPad(props.hours)}:{zeroPad(props.minutes)}:{zeroPad(props.seconds)}
                              </span>
                            </Box>
                          </VStack>
                        </Box>
                      )}
                    </Box>
                  </CircularProgressbarWithChildren>
                </Box>
              )}
              }
            />
          </Box>
        )}
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
