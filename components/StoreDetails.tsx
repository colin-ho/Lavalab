import { Button, IconButton } from '@chakra-ui/button';
import { useDisclosure } from '@chakra-ui/hooks';
import { Box, Divider, Flex, Heading, HStack, Stack, Text, VStack } from '@chakra-ui/layout'
import { Modal, ModalBody, ModalCloseButton, InputGroup, InputLeftElement, InputRightElement, ModalContent, Input, ModalFooter, ModalHeader, ModalOverlay, Menu, MenuButton, MenuList, MenuItem, Wrap, InputRightAddon, FormErrorMessage, FormControl, Radio, RadioGroup } from '@chakra-ui/react';
import React, { useContext, useEffect, useState, useReducer } from 'react'
import { AuthContext, AuthContextInterface } from '../lib/context';
import { arrayRemove, arrayUnion, } from '../lib/firebase';
import { Select } from '@chakra-ui/select';
import { BsPinMap } from 'react-icons/bs';
import { AiOutlineLink, AiOutlineMail, AiOutlinePhone, AiOutlinePlus } from 'react-icons/ai';
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import { IoCloseOutline } from 'react-icons/io5'
import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import Geocode from "react-geocode";
import { useForm } from 'react-hook-form';

const geofire = require('geofire-common');
process.env.NEXT_PUBLIC_GOOGLE_API_KEY && Geocode.setApiKey(process.env.NEXT_PUBLIC_GOOGLE_API_KEY);

const initialState = {
    'mon': { 'open': { 'hr': 0, 'min': 0 }, 'close': { 'hr': 0, 'min': 0 } },
    'tue': { 'open': { 'hr': 0, 'min': 0 }, 'close': { 'hr': 0, 'min': 0 } },
    'wed': { 'open': { 'hr': 0, 'min': 0 }, 'close': { 'hr': 0, 'min': 0 } },
    'thu': { 'open': { 'hr': 0, 'min': 0 }, 'close': { 'hr': 0, 'min': 0 } },
    'fri': { 'open': { 'hr': 0, 'min': 0 }, 'close': { 'hr': 0, 'min': 0 } },
    'sat': { 'open': { 'hr': 0, 'min': 0 }, 'close': { 'hr': 0, 'min': 0 } },
    'sun': { 'open': { 'hr': 0, 'min': 0 }, 'close': { 'hr': 0, 'min': 0 } }
};

function reducer(state: any, action: any) {
    if (action.type === "All") return action.payload;
    return {
        ...state, [action.day]: {
            ...state[action.day], [action.time]: {
                'hr': action.payload.hr,
                'min': action.payload.min,
            }
        }
    }
}

export default function StoreDetails({ open }: { open: boolean }) {
    const { business, businessRef } = useContext<AuthContextInterface>(AuthContext);
    const [tag, setTag] = useState("");
    const [address, setAddress] = useState("");
    const { register, handleSubmit, setValue, formState: { errors } } = useForm({ mode: 'onSubmit' });
    const { register: register2, handleSubmit: handleSubmit2, watch, reset, formState: { errors: errors2 } } = useForm({ mode: 'onSubmit' });
    const [editDetails, setEditDetails] = useState<string | boolean>(false);
    const [editHours, setEditHours] = useState<string | boolean>(false);
    const [addressError, setAddressError] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [hours, dispatch] = useReducer(reducer, initialState);
    const { isOpen: isOpen1, onOpen: onOpen1, onClose: onClose1 } = useDisclosure()
    const { isOpen: isOpen2, onOpen: onOpen2, onClose: onClose2 } = useDisclosure()
    const [specialTime, setSpecialTime] = useState({ open: { hr: '11', min: '00' }, close: { hr: '21', min: '00' } })

    useEffect(() => {
        if (business) {
            setAddress(business.address);
            setValue('phone', business.phone);
            setValue('email', business.email);
            setValue('website', business.website);
            dispatch({ type: 'All', payload: business.times })
        }
    }, [business])

    const {
        placePredictions,
        getPlacePredictions,
    } = usePlacesService({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
    });

    const changeBusinessType = async (type: string) => {
        if (businessRef) {
            await businessRef.update({ businessType: type })
        }
    }

    const addTag = async () => {
        if (businessRef&& business && business.tags.length<2&&tag!="") {
            await businessRef.update({ tags: arrayUnion(tag) })
        }
        setTag("")
    }

    const removeTag = async (tag: string) => {
        if (businessRef) {
            await businessRef.update({ tags: arrayRemove(tag) })
        }
    }

    const submitDetails = async ({ phone, email, website }: { phone: number, email: string, website: string }) => {
        if (!address) {
            setAddressError(true);
            return;
        } else {
            setAddressError(false);
        }
        if (businessRef) {
            setEditDetails('loading')
            const { lat, lng } = (await Geocode.fromAddress(address)).results[0].geometry.location;
            const geohash = geofire.geohashForLocation([lat, lng]);
            await businessRef.update({
                phone: phone, email: email, website: website, address: address,
                geohash: geohash, lat: lat, lng: lng,
            })
            setEditDetails(false);
        }
    }

    const changeHours = async () => {
        if (businessRef && parseInt(hours.mon.open.hr) * 1000 + parseInt(hours.mon.open.min) <= parseInt(hours.mon.close.hr) * 1000 + parseInt(hours.mon.close.min)
            && parseInt(hours.tue.open.hr) * 1000 + parseInt(hours.tue.open.min) <= parseInt(hours.tue.close.hr) * 1000 + parseInt(hours.tue.close.min)
            && parseInt(hours.wed.open.hr) * 1000 + parseInt(hours.wed.open.min) <= parseInt(hours.wed.close.hr) * 1000 + parseInt(hours.wed.close.min)
            && parseInt(hours.thu.open.hr) * 1000 + parseInt(hours.thu.open.min) <= parseInt(hours.thu.close.hr) * 1000 + parseInt(hours.thu.close.min)
            && parseInt(hours.fri.open.hr) * 1000 + parseInt(hours.fri.open.min) <= parseInt(hours.fri.close.hr) * 1000 + parseInt(hours.fri.close.min)
            && parseInt(hours.sat.open.hr) * 1000 + parseInt(hours.sat.open.min) <= parseInt(hours.sat.close.hr) * 1000 + parseInt(hours.sat.close.min)
            && parseInt(hours.sun.open.hr) * 1000 + parseInt(hours.sun.open.min) <= parseInt(hours.sun.close.hr) * 1000 + parseInt(hours.sun.close.min)) {
            setEditHours('loading')
            await businessRef.update({ times: hours });
            setEditHours(false);
        }
    }

    const setDelay = async (delay: string) => {
        if (businessRef) {
            await businessRef.update({ delay: delay });
        }
    }

    const setPaused = async (status: boolean) => {
        if (businessRef) {
            await businessRef.update({ paused: status });
        }
    }

    const addClosure = async ({ description, from, to }: any) => {
        reset({ description: '', from: '', to: '' });
        if (businessRef && parseInt(specialTime.open.hr) * 1000 + parseInt(specialTime.open.min) < parseInt(specialTime.close.hr) * 1000 + parseInt(specialTime.close.min)) {
            let data = {
                description: description
                , from: from
                , to: to
                , hours: specialTime
            }
            await businessRef.update({ closures: arrayUnion(data) });
        }
    }

    const removeClosure = async (closure: any) => {
        if (businessRef) {
            await businessRef.update({ closures: arrayRemove(closure) });
        }
    }

    return (
        <Flex direction="column" align="flex-start">
            <Heading size="lg" mb="10px"> Store details</Heading>
            <Text>Edit store hours and tags</Text>
            <Stack mt="10" spacing="8" width="full" direction={{ base: "column", pxl: "row" }} >
                <VStack alignItems="start" flex="1" spacing="4" p={4} borderRadius="xl" boxShadow="0px 16px 50px rgba(0, 0, 0, 0.07)">
                    <Text as={'b'} fontSize="18px">{business?.businessName}</Text>
                    <HStack w="full" align="center" justify="space-between">
                        <Text >Business Type:</Text>
                        <Select w="50%" value={business ? business.businessType : "Boba"} onChange={(e) => changeBusinessType(e.target.value)}>
                            <option value="American">American</option>
                            <option value="Boba">Boba</option>
                            <option value="Breakfast">Breakfast</option>
                            <option value="Burgers">Burgers</option>
                            <option value="Cafe">Cafe</option>
                            <option value="Chinese">Chinese</option>
                            <option value="Deserts">Deserts</option>
                            <option value="Fast Food">Fast Food</option>
                            <option value="Healthy">Healthy</option>
                            <option value="Italian">Italian</option>
                            <option value="Japanese">Japanese</option>
                            <option value="Korean">Korean</option>
                            <option value="Juice">Juice</option>
                            <option value="Mediterranean">Mediterranean</option>
                            <option value="Mexican">Mexican</option>
                            <option value="Poke">Poke</option>
                            <option value="South American">South American</option>
                            <option value="Thai">Thai</option>
                            <option value="Vietnamese">Vietnamese</option>
                            <option value="Mexican">Mexican</option>
                        </Select>
                    </HStack>
                    <HStack w="full" align="center" justify="space-between">
                        <Text>Add Tags (2 max):</Text>
                        <InputGroup w="50%">
                            <Input value={tag} maxLength={15} onChange={(e) => setTag(e.target.value)} onKeyPress={(e) => { if (e.key === "Enter") addTag() }} list="browsers" />
                            <InputRightElement cursor="pointer" onClick={addTag} ><AiOutlinePlus /></InputRightElement>
                            <datalist id="browsers">
                                <option value="American">American</option>
                                <option value="Boba">Boba</option>
                                <option value="Breakfast">Breakfast</option>
                                <option value="Burgers">Burgers</option>
                                <option value="Cafe">Cafe</option>
                                <option value="Chinese">Chinese</option>
                                <option value="Deserts">Deserts</option>
                                <option value="Fast Food">Fast Food</option>
                                <option value="Healthy">Healthy</option>
                                <option value="Italian">Italian</option>
                                <option value="Japanese">Japanese</option>
                                <option value="Korean">Korean</option>
                                <option value="Juice">Juice</option>
                                <option value="Mediterranean">Mediterranean</option>
                                <option value="Mexican">Mexican</option>
                                <option value="Poke">Poke</option>
                                <option value="South American">South American</option>
                                <option value="Thai">Thai</option>
                                <option value="Vietnamese">Vietnamese</option>
                                <option value="Mexican">Mexican</option>
                            </datalist>
                        </InputGroup>
                    </HStack>
                    <HStack w="full" align="center" justify="space-between">
                        <Box></Box>
                        <Wrap w="50%" spacing="4">
                            {business ? business.tags.map((tag: string) =>
                                <HStack key={tag} background="brand.100" px="11px" py="4px">
                                    <Text>
                                        {tag}
                                    </Text>
                                    <IoCloseOutline id={tag} color='gray.300' cursor="pointer" onClick={(e) => removeTag((e.target as Element).id)} />
                                </HStack>
                            ) : null}

                        </Wrap>
                    </HStack>
                </VStack>
                <VStack alignItems="start" flex="1" spacing="4" p={4} borderRadius="xl" boxShadow="0px 16px 50px rgba(0, 0, 0, 0.07)">
                    <Text as={'b'} fontSize="18px">Current Status</Text>
                    <Text >{business && !open ? "The store is currently closed" : "Currently open and accepting redemptions"}
                        <b>{business && (parseInt(business.delay) > 0) && open ? ` with ${business.delay} min delay` : null}</b></Text>
                    <Button p="7" w="full" boxShadow="0px 16px 50px rgba(0, 0, 0, 0.12)" fontSize={'md'} fontWeight={500} color={'white'} bg={'black'}
                        _hover={{ bg: 'black', color: 'white' }} _active={{ bg: 'black', color: 'white' }} _focus={{
                            boxShadow:
                                '0px 16px 50px rgba(0, 0, 0, 0.12)',
                        }}
                        onClick={onOpen1}>
                        Set fulfillment delay</Button>
                    <Button p="7" w="full" boxShadow="0px 16px 50px rgba(0, 0, 0, 0.12)" fontSize={'md'} fontWeight={500} color={'black'} bg={'white'}
                        _hover={{ bg: 'white', color: 'black' }} _active={{ bg: 'white', color: 'black' }} _focus={{
                            boxShadow:
                                '0px 16px 50px rgba(0, 0, 0, 0.12)',
                        }} onClick={onOpen2}>
                        {business && !business.paused ? 'Pause Redemptions' : 'Resume Redemptions'}</Button>
                </VStack>
            </Stack>
            <Stack mt="10" spacing="8" width="full" direction={{ base: "column", pxl: "row" }}>
                <VStack alignItems="start" h="fit-content" spacing="4" flex="1" p={4} borderRadius="xl" boxShadow="0px 16px 50px rgba(0, 0, 0, 0.07)">
                    <HStack>
                        <Text as={'b'} fontSize="18px">Store Details </Text>
                        <Button background="black" _hover={{ bg: 'black' }} _active={{ bg: 'black' }} isLoading={editDetails === 'loading' ? true : false} color="white" size="sm" onClick={() => {
                            if (editDetails) handleSubmit(submitDetails)()
                            else setEditDetails(true);
                        }} _focus={{
                            boxShadow:
                                'none',
                        }}>
                            {editDetails ? "Save" : "Edit"}
                        </Button>
                    </HStack>
                    <FormControl isInvalid={addressError}>
                        <InputGroup >
                            <InputLeftElement
                                pointerEvents='none'><BsPinMap color='gray.300' /></InputLeftElement>
                            <Input placeholder='Address' isDisabled={!editDetails} value={address} onChange={(evt) => { setAddressError(false); setShowSuggestions(evt.target.value !== '' ? true : false); setAddress(evt.target.value); getPlacePredictions({ input: evt.target.value }) }} />
                        </InputGroup>
                        <FormErrorMessage>Address is Required</FormErrorMessage>
                    </FormControl>
                    {placePredictions && showSuggestions ? (
                        <Flex direction="column"  >
                            {placePredictions.map((item) => {
                                return (
                                    <Button mb="10px" h="fit-content" py="2" key={item.description} onClick={() => { setShowSuggestions(false); setAddress(item.description) }}>
                                        <Text whiteSpace="normal">{item.description}</Text>
                                    </Button>
                                )
                            })}
                        </Flex>
                    ) : null}
                    <FormControl isInvalid={errors.phone?.message}>
                        <InputGroup>
                            <InputLeftElement
                                pointerEvents='none'><AiOutlinePhone color='gray.300' /></InputLeftElement>
                            <Input placeholder='Phone' type="number" isDisabled={!editDetails}
                                {...register('phone', {
                                    required: { value: true, message: "Phone number is required" },
                                    minLength: { value: 10, message: 'Phone number is too short' }, maxLength: { value: 10, message: 'Phone number is too long' }
                                })}
                            />
                        </InputGroup>
                        <FormErrorMessage>{errors.phone?.message}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={errors.email?.message}>
                        <InputGroup>
                            <InputLeftElement
                                pointerEvents='none'><AiOutlineMail color='gray.300' /></InputLeftElement>
                            <Input placeholder='Email' type="email" isDisabled={!editDetails}
                                {...register('email', { required: { value: true, message: "Email is required" }, pattern: { value: /^\S+@\S+$/i, message: "Please enter an appropriate email" } })}
                            />
                        </InputGroup>
                        <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={errors.website?.message}>
                        <InputGroup>
                            <InputLeftElement
                                pointerEvents='none'><AiOutlineLink color='gray.300' /></InputLeftElement>
                            <Input placeholder='Website' type="url" isDisabled={!editDetails}
                                {...register('website', { required: false })} />
                        </InputGroup>
                        <FormErrorMessage>{errors.website?.message}</FormErrorMessage>
                    </FormControl>
                    <Divider />
                    <HStack>
                        <Text as={'b'} fontSize="18px">Opening Hours</Text>
                        <Button background="black" _hover={{ bg: 'black' }} _active={{ bg: 'black' }} isLoading={editHours === 'loading' ? true : false} color="white" size="sm" onClick={() => {
                            if (editHours) changeHours();
                            if (!editHours) setEditHours(true);
                        }} _focus={{
                            boxShadow:
                                '0px 16px 50px rgba(0, 0, 0, 0.12)',
                        }}>
                            {editHours ? "Save" : "Edit"}
                        </Button>
                    </HStack>
                    <FormControl isInvalid={parseInt(hours.mon.open.hr) * 1000 + parseInt(hours.mon.open.min) > parseInt(hours.mon.close.hr) * 1000 + parseInt(hours.mon.close.min)}>
                        <HStack align="center" w="full" justify="space-between">
                            <Text>Mon</Text>
                            <HStack w="70%">
                                {hours.mon.open.hr !== 0 ?
                                    <>
                                        <Input p="2" id="mon:open" value={`${hours.mon.open.hr}:${hours.mon.open.min}`} isDisabled={!editHours} type="time" onChange={(e) => dispatch({ type: 'single', day: e.target.id.split(':')[0], time: e.target.id.split(':')[1], payload: { hr: e.target.value.split(':')[0], min: e.target.value.split(':')[1] } })} />
                                        <Text>To</Text>
                                        <Input p="2" id="mon:close" value={`${hours.mon.close.hr}:${hours.mon.close.min}`} isDisabled={!editHours} type="time" onChange={(e) => dispatch({ type: 'single', day: e.target.id.split(':')[0], time: e.target.id.split(':')[1], payload: { hr: e.target.value.split(':')[0], min: e.target.value.split(':')[1] } })} />
                                    </> :
                                    <Box flex="1" p={2} borderRadius="xl" boxShadow="0px 16px 50px rgba(0, 0, 0, 0.07)">
                                        <Text ml="2" opacity={!editHours ? 0.4 : 1}>Closed</Text>
                                    </Box>
                                }

                                <Menu offset={[-20, -20]}>
                                    <MenuButton
                                        as={IconButton}
                                        icon={<BiDotsHorizontalRounded />}
                                        variant="ghost"
                                        isDisabled={!editHours}
                                    />
                                    <MenuList>
                                        <MenuItem onClick={() => hours.mon.open.hr === 0 ?
                                            (dispatch({ type: 'single', day: 'mon', time: 'open', payload: { hr: '08', min: '00' } }),
                                                dispatch({ type: 'single', day: 'mon', time: 'close', payload: { hr: '20', min: '00' } })
                                            )
                                            : null}>
                                            Hours
                                        </MenuItem>
                                        <MenuItem onClick={() => {
                                            dispatch({ type: 'single', day: 'mon', time: 'open', payload: { hr: 0, min: 0 } })
                                            dispatch({ type: 'single', day: 'mon', time: 'close', payload: { hr: 0, min: 0 } })
                                        }}>
                                            Closed
                                        </MenuItem>
                                    </MenuList>
                                </Menu>
                            </HStack>
                        </HStack >
                        <HStack w="full">
                            <Box flex="1"></Box>
                            <FormErrorMessage w="70%">The opening time cannot be later than the closing time</FormErrorMessage>
                        </HStack>
                    </FormControl>
                    <FormControl isInvalid={parseInt(hours.tue.open.hr) * 1000 + parseInt(hours.tue.open.min) > parseInt(hours.tue.close.hr) * 1000 + parseInt(hours.tue.close.min)}>
                        <HStack align="center" w="full" justify="space-between">
                            <Text>Tue</Text>
                            <HStack w="70%">
                                {hours.tue.open.hr !== 0 ?
                                    <>
                                        <Input p="2" id="tue:open" value={`${hours.tue.open.hr}:${hours.tue.open.min}`} isDisabled={!editHours} type="time" onChange={(e) => dispatch({ type: 'single', day: e.target.id.split(':')[0], time: e.target.id.split(':')[1], payload: { hr: e.target.value.split(':')[0], min: e.target.value.split(':')[1] } })} />
                                        <Text>To</Text>
                                        <Input p="2" id="tue:close" value={`${hours.tue.close.hr}:${hours.tue.close.min}`} isDisabled={!editHours} type="time" onChange={(e) => dispatch({ type: 'single', day: e.target.id.split(':')[0], time: e.target.id.split(':')[1], payload: { hr: e.target.value.split(':')[0], min: e.target.value.split(':')[1] } })} />
                                    </> :
                                    <Box flex="1" p={2} borderRadius="xl" boxShadow="0px 16px 50px rgba(0, 0, 0, 0.07)">
                                        <Text ml="2" opacity={!editHours ? 0.4 : 1}>Closed</Text>
                                    </Box>
                                }
                                <Menu offset={[-20, -20]}>
                                    <MenuButton
                                        as={IconButton}
                                        icon={<BiDotsHorizontalRounded />}
                                        variant="ghost"
                                        isDisabled={!editHours}
                                    />
                                    <MenuList>
                                        <MenuItem onClick={() => hours.tue.open.hr === 0 ?
                                            (dispatch({ type: 'single', day: 'tue', time: 'open', payload: { hr: '08', min: '00' } }),
                                                dispatch({ type: 'single', day: 'tue', time: 'close', payload: { hr: '20', min: '00' } })
                                            )
                                            : null}>
                                            Hours
                                        </MenuItem>
                                        <MenuItem onClick={() => {
                                            dispatch({ type: 'single', day: 'tue', time: 'open', payload: { hr: 0, min: 0 } })
                                            dispatch({ type: 'single', day: 'tue', time: 'close', payload: { hr: 0, min: 0 } })
                                        }}>
                                            Closed
                                        </MenuItem>
                                    </MenuList>
                                </Menu>
                            </HStack>
                        </HStack >
                        <HStack w="full">
                            <Box flex="1"></Box>
                            <FormErrorMessage w="70%">The opening time cannot be later than the closing time</FormErrorMessage>
                        </HStack>
                    </FormControl>
                    <FormControl isInvalid={parseInt(hours.wed.open.hr) * 1000 + parseInt(hours.wed.open.min) > parseInt(hours.wed.close.hr) * 1000 + parseInt(hours.wed.close.min)}>
                        <HStack align="center" w="full" justify="space-between">
                            <Text>Wed</Text>
                            <HStack w="70%">
                                {hours.wed.open.hr !== 0 ?
                                    <>
                                        <Input p="2" id="wed:open" value={`${hours.wed.open.hr}:${hours.wed.open.min}`} isDisabled={!editHours} type="time" onChange={(e) => dispatch({ type: 'single', day: e.target.id.split(':')[0], time: e.target.id.split(':')[1], payload: { hr: e.target.value.split(':')[0], min: e.target.value.split(':')[1] } })} />
                                        <Text>To</Text>
                                        <Input p="2" id="wed:close" value={`${hours.wed.close.hr}:${hours.wed.close.min}`} isDisabled={!editHours} type="time" onChange={(e) => dispatch({ type: 'single', day: e.target.id.split(':')[0], time: e.target.id.split(':')[1], payload: { hr: e.target.value.split(':')[0], min: e.target.value.split(':')[1] } })} />
                                    </> :
                                    <Box flex="1" p={2} borderRadius="xl" boxShadow="0px 16px 50px rgba(0, 0, 0, 0.07)">
                                        <Text ml="2" opacity={!editHours ? 0.4 : 1}>Closed</Text>
                                    </Box>
                                }
                                <Menu offset={[-20, -20]}>
                                    <MenuButton
                                        as={IconButton}
                                        icon={<BiDotsHorizontalRounded />}
                                        variant="ghost"
                                        isDisabled={!editHours}
                                    />
                                    <MenuList>
                                        <MenuItem onClick={() => hours.wed.open.hr === 0 ?
                                            (dispatch({ type: 'single', day: 'wed', time: 'open', payload: { hr: '08', min: '00' } }),
                                                dispatch({ type: 'single', day: 'wed', time: 'close', payload: { hr: '20', min: '00' } })
                                            )
                                            : null}>
                                            Hours
                                        </MenuItem>
                                        <MenuItem onClick={() => {
                                            dispatch({ type: 'single', day: 'wed', time: 'open', payload: { hr: 0, min: 0 } })
                                            dispatch({ type: 'single', day: 'wed', time: 'close', payload: { hr: 0, min: 0 } })
                                        }}>
                                            Closed
                                        </MenuItem>
                                    </MenuList>
                                </Menu>
                            </HStack>
                        </HStack >
                        <HStack w="full">
                            <Box flex="1"></Box>
                            <FormErrorMessage w="70%">The opening time cannot be later than the closing time</FormErrorMessage>
                        </HStack>
                    </FormControl>
                    <FormControl isInvalid={parseInt(hours.thu.open.hr) * 1000 + parseInt(hours.thu.open.min) > parseInt(hours.thu.close.hr) * 1000 + parseInt(hours.thu.close.min)}>
                        <HStack align="center" w="full" justify="space-between">
                            <Text>Thu</Text>
                            <HStack w="70%">
                                {hours.thu.open.hr !== 0 ?
                                    <>
                                        <Input p="2" id="thu:open" value={`${hours.thu.open.hr}:${hours.thu.open.min}`} isDisabled={!editHours} type="time" onChange={(e) => dispatch({ type: 'single', day: e.target.id.split(':')[0], time: e.target.id.split(':')[1], payload: { hr: e.target.value.split(':')[0], min: e.target.value.split(':')[1] } })} />
                                        <Text>To</Text>
                                        <Input p="2" id="thu:close" value={`${hours.thu.close.hr}:${hours.thu.close.min}`} isDisabled={!editHours} type="time" onChange={(e) => dispatch({ type: 'single', day: e.target.id.split(':')[0], time: e.target.id.split(':')[1], payload: { hr: e.target.value.split(':')[0], min: e.target.value.split(':')[1] } })} />
                                    </> :
                                    <Box flex="1" p={2} borderRadius="xl" boxShadow="0px 16px 50px rgba(0, 0, 0, 0.07)">
                                        <Text ml="2" opacity={!editHours ? 0.4 : 1}>Closed</Text>
                                    </Box>
                                }
                                <Menu offset={[-20, -20]}>
                                    <MenuButton
                                        as={IconButton}
                                        icon={<BiDotsHorizontalRounded />}
                                        variant="ghost"
                                        isDisabled={!editHours}
                                    />
                                    <MenuList>
                                        <MenuItem onClick={() => hours.thu.open.hr === 0 ?
                                            (dispatch({ type: 'single', day: 'thu', time: 'open', payload: { hr: '08', min: '00' } }),
                                                dispatch({ type: 'single', day: 'thu', time: 'close', payload: { hr: '20', min: '00' } })
                                            )
                                            : null}>
                                            Hours
                                        </MenuItem>
                                        <MenuItem onClick={() => {
                                            dispatch({ type: 'single', day: 'thu', time: 'open', payload: { hr: 0, min: 0 } })
                                            dispatch({ type: 'single', day: 'thu', time: 'close', payload: { hr: 0, min: 0 } })
                                        }}>
                                            Closed
                                        </MenuItem>
                                    </MenuList>
                                </Menu>
                            </HStack>
                        </HStack >
                        <HStack w="full">
                            <Box flex="1"></Box>
                            <FormErrorMessage w="70%">The opening time cannot be later than the closing time</FormErrorMessage>
                        </HStack>
                    </FormControl>
                    <FormControl isInvalid={parseInt(hours.fri.open.hr) * 1000 + parseInt(hours.fri.open.min) > parseInt(hours.fri.close.hr) * 1000 + parseInt(hours.fri.close.min)}>
                        <HStack align="center" w="full" justify="space-between">
                            <Text>Fri</Text>
                            <HStack w="70%">
                                {hours.fri.open.hr !== 0 ?
                                    <>
                                        <Input p="2" id="fri:open" value={`${hours.fri.open.hr}:${hours.fri.open.min}`} isDisabled={!editHours} type="time" onChange={(e) => dispatch({ type: 'single', day: e.target.id.split(':')[0], time: e.target.id.split(':')[1], payload: { hr: e.target.value.split(':')[0], min: e.target.value.split(':')[1] } })} />
                                        <Text>To</Text>
                                        <Input p="2" id="fri:close" value={`${hours.fri.close.hr}:${hours.fri.close.min}`} isDisabled={!editHours} type="time" onChange={(e) => dispatch({ type: 'single', day: e.target.id.split(':')[0], time: e.target.id.split(':')[1], payload: { hr: e.target.value.split(':')[0], min: e.target.value.split(':')[1] } })} />
                                    </> :
                                    <Box flex="1" p={2} borderRadius="xl" boxShadow="0px 16px 50px rgba(0, 0, 0, 0.07)">
                                        <Text ml="2" opacity={!editHours ? 0.4 : 1}>Closed</Text>
                                    </Box>
                                }
                                <Menu offset={[-20, -20]}>
                                    <MenuButton
                                        as={IconButton}
                                        icon={<BiDotsHorizontalRounded />}
                                        variant="ghost"
                                        isDisabled={!editHours}
                                    />
                                    <MenuList>
                                        <MenuItem onClick={() => hours.fri.open.hr === 0 ?
                                            (dispatch({ type: 'single', day: 'fri', time: 'open', payload: { hr: '08', min: '00' } }),
                                                dispatch({ type: 'single', day: 'fri', time: 'close', payload: { hr: '20', min: '00' } })
                                            )
                                            : null}>
                                            Hours
                                        </MenuItem>
                                        <MenuItem onClick={() => {
                                            dispatch({ type: 'single', day: 'fri', time: 'open', payload: { hr: 0, min: 0 } })
                                            dispatch({ type: 'single', day: 'fri', time: 'close', payload: { hr: 0, min: 0 } })
                                        }}>
                                            Closed
                                        </MenuItem>
                                    </MenuList>
                                </Menu>
                            </HStack>
                        </HStack >
                        <HStack w="full">
                            <Box flex="1"></Box>
                            <FormErrorMessage w="70%">The opening time cannot be later than the closing time</FormErrorMessage>
                        </HStack>
                    </FormControl>
                    <FormControl isInvalid={parseInt(hours.sat.open.hr) * 1000 + parseInt(hours.sat.open.min) > parseInt(hours.sat.close.hr) * 1000 + parseInt(hours.sat.close.min)}>
                        <HStack align="center" w="full" justify="space-between">
                            <Text>Sat</Text>
                            <HStack w="70%">
                                {hours.sat.open.hr !== 0 ?
                                    <>
                                        <Input p="2" id="sat:open" value={`${hours.sat.open.hr}:${hours.sat.open.min}`} isDisabled={!editHours} type="time" onChange={(e) => dispatch({ type: 'single', day: e.target.id.split(':')[0], time: e.target.id.split(':')[1], payload: { hr: e.target.value.split(':')[0], min: e.target.value.split(':')[1] } })} />
                                        <Text>To</Text>
                                        <Input p="2" id="sat:close" value={`${hours.sat.close.hr}:${hours.sat.close.min}`} isDisabled={!editHours} type="time" onChange={(e) => dispatch({ type: 'single', day: e.target.id.split(':')[0], time: e.target.id.split(':')[1], payload: { hr: e.target.value.split(':')[0], min: e.target.value.split(':')[1] } })} />
                                    </> :
                                    <Box flex="1" p={2} borderRadius="xl" boxShadow="0px 16px 50px rgba(0, 0, 0, 0.07)">
                                        <Text ml="2" opacity={!editHours ? 0.4 : 1}>Closed</Text>
                                    </Box>
                                }
                                <Menu offset={[-20, -20]}>
                                    <MenuButton
                                        as={IconButton}
                                        icon={<BiDotsHorizontalRounded />}
                                        variant="ghost"
                                        isDisabled={!editHours}
                                    />
                                    <MenuList>
                                        <MenuItem onClick={() => hours.sat.open.hr === 0 ?
                                            (dispatch({ type: 'single', day: 'sat', time: 'open', payload: { hr: '08', min: '00' } }),
                                                dispatch({ type: 'single', day: 'sat', time: 'close', payload: { hr: '20', min: '00' } })
                                            )
                                            : null}>
                                            Hours
                                        </MenuItem>
                                        <MenuItem onClick={() => {
                                            dispatch({ type: 'single', day: 'sat', time: 'open', payload: { hr: 0, min: 0 } })
                                            dispatch({ type: 'single', day: 'sat', time: 'close', payload: { hr: 0, min: 0 } })
                                        }}>
                                            Closed
                                        </MenuItem>
                                    </MenuList>
                                </Menu>
                            </HStack>
                        </HStack >
                        <HStack w="full">
                            <Box flex="1"></Box>
                            <FormErrorMessage w="70%">The opening time cannot be later than the closing time</FormErrorMessage>
                        </HStack>
                    </FormControl>
                    <FormControl isInvalid={parseInt(hours.sun.open.hr) * 1000 + parseInt(hours.sun.open.min) > parseInt(hours.sun.close.hr) * 1000 + parseInt(hours.sun.close.min)}>
                        <HStack align="center" w="full" justify="space-between">
                            <Text>Sun</Text>
                            <HStack w="70%">
                                {hours.sun.open.hr !== 0 ?
                                    <>
                                        <Input p="2" id="sun:open" value={`${hours.sun.open.hr}:${hours.sun.open.min}`} isDisabled={!editHours} type="time" onChange={(e) => dispatch({ type: 'single', day: e.target.id.split(':')[0], time: e.target.id.split(':')[1], payload: { hr: e.target.value.split(':')[0], min: e.target.value.split(':')[1] } })} />
                                        <Text>To</Text>
                                        <Input p="2" id="sun:close" value={`${hours.sun.close.hr}:${hours.sun.close.min}`} isDisabled={!editHours} type="time" onChange={(e) => dispatch({ type: 'single', day: e.target.id.split(':')[0], time: e.target.id.split(':')[1], payload: { hr: e.target.value.split(':')[0], min: e.target.value.split(':')[1] } })} />
                                    </> :
                                    <Box flex="1" p={2} borderRadius="xl" boxShadow="0px 16px 50px rgba(0, 0, 0, 0.07)">
                                        <Text ml="2" opacity={!editHours ? 0.4 : 1}>Closed</Text>
                                    </Box>
                                }
                                <Menu offset={[-20, -20]}>
                                    <MenuButton
                                        as={IconButton}
                                        icon={<BiDotsHorizontalRounded />}
                                        variant="ghost"
                                        isDisabled={!editHours}
                                    />
                                    <MenuList>
                                        <MenuItem onClick={() => hours.sun.open.hr === 0 ?
                                            (dispatch({ type: 'single', day: 'sun', time: 'open', payload: { hr: '08', min: '00' } }),
                                                dispatch({ type: 'single', day: 'sun', time: 'close', payload: { hr: '20', min: '00' } })
                                            )
                                            : null}>
                                            Hours
                                        </MenuItem>
                                        <MenuItem onClick={() => {
                                            dispatch({ type: 'single', day: 'sun', time: 'open', payload: { hr: 0, min: 0 } })
                                            dispatch({ type: 'single', day: 'sun', time: 'close', payload: { hr: 0, min: 0 } })
                                        }}>
                                            Closed
                                        </MenuItem>
                                    </MenuList>
                                </Menu>
                            </HStack>
                        </HStack >
                        <HStack w="full">
                            <Box flex="1"></Box>
                            <FormErrorMessage w="70%">The opening time cannot be later than the closing time</FormErrorMessage>
                        </HStack>
                    </FormControl>
                </VStack>
                <VStack alignItems="start" spacing="4" flex="1" p={4} borderRadius="xl" boxShadow="0px 16px 50px rgba(0, 0, 0, 0.07)">
                    <Text as={'b'} fontSize="18px">Special Hours</Text>

                    <HStack w="full" align="center" justify="space-between">
                        <Text>Description</Text>
                        <FormControl w="70%" isInvalid={errors2.description?.message}>
                            <Input placeholder='Christmas hours' {...register2('description', { required: { value: true, message: "Description is required" } })} />
                            <FormErrorMessage>{errors2.description?.message}</FormErrorMessage>
                        </FormControl>
                    </HStack>

                    <HStack align="center" w="full" justify="space-between">
                        <Text>From</Text>
                        <FormControl w="70%" isInvalid={errors2.from?.message}>
                            <Input p="2" w="70%" type="date" {...register2('from', { required: { value: true, message: "Start date is required" } })} />
                            <FormErrorMessage>{errors2.from?.message}</FormErrorMessage>
                        </FormControl>
                    </HStack >
                    <HStack align="center" w="full" justify="space-between">
                        <Text>To</Text>
                        <FormControl w="70%" isInvalid={errors2.to?.message}>
                            <Input p="2" w="70%" type="date" {...register2('to', {
                                required: { value: true, message: "End date is required" }, validate: {
                                    moreThanFroms: date => (new Date(date)) >= (new Date(watch('from'))) || "End date must be after start date",
                                }
                            })} />
                            <FormErrorMessage>{errors2.to?.message}</FormErrorMessage>
                        </FormControl>
                    </HStack >
                    <FormControl isInvalid={parseInt(specialTime.open.hr) * 1000 + parseInt(specialTime.open.min) >= parseInt(specialTime.close.hr) * 1000 + parseInt(specialTime.close.min)}>
                        <HStack w="full" align="center" justify="space-between">
                            <Text >Hours</Text>
                            <HStack w="70%">
                                {specialTime.open.hr !== '0' ?
                                    <>

                                        <Input p="2" type="time" value={`${specialTime.open.hr}:${specialTime.open.min}`} onChange={(e) => setSpecialTime(prev => ({ ...prev, open: { hr: e.target.value.split(":")[0], min: e.target.value.split(":")[1] } }))} />
                                        <Text >To</Text>
                                        <Input p="2" type="time" value={`${specialTime.close.hr}:${specialTime.close.min}`} onChange={(e) => setSpecialTime(prev => ({ ...prev, close: { hr: e.target.value.split(":")[0], min: e.target.value.split(":")[1] } }))} />


                                    </> :
                                    <Box flex="1" p={2} borderRadius="xl" boxShadow="0px 16px 50px rgba(0, 0, 0, 0.07)">
                                        <Text ml="2">Closed</Text>
                                    </Box>
                                }
                                <Menu offset={[-20, -20]}>
                                    <MenuButton
                                        as={IconButton}
                                        icon={<BiDotsHorizontalRounded />}
                                        variant="ghost"
                                    />
                                    <MenuList>
                                        <MenuItem onClick={() => specialTime.open.hr === '0' ?
                                            setSpecialTime({ open: { hr: '11', min: '00' }, close: { hr: '21', min: '00' } })
                                            : null}>
                                            Hours
                                        </MenuItem>
                                        <MenuItem onClick={() => setSpecialTime(prev => ({ ...prev, open: { ...prev.open, hr: '0' } }))}>
                                            Closed
                                        </MenuItem>
                                    </MenuList>
                                </Menu>
                            </HStack>

                        </HStack>
                        <HStack w="full">
                            <Box flex="1"></Box>
                            <FormErrorMessage w="70%">The opening time cannot be later than the closing time</FormErrorMessage>
                        </HStack>

                    </FormControl>
                    <Button alignSelf="flex-end" background="black" _hover={{ bg: 'black' }} _active={{ bg: 'black' }} color="white" size="md" _focus={{
                        boxShadow:
                            '0px 16px 50px rgba(0, 0, 0, 0.12)',
                    }} onClick={() => handleSubmit2(addClosure)()}>Add</Button>
                    <Divider />
                    <Text as={'b'} fontSize="18px">Upcoming</Text>
                    <VStack spacing="4" w="full">
                        {business && business.closures.length > 0 ?

                            business.closures.map((closure: any, i: number) => {
                                return (
                                    <HStack key={i} w="full" align="flex-start">
                                        <VStack flex="1" w="full" align="flex-start" p="4" borderRadius="xl" boxShadow="0px 16px 50px rgba(0, 0, 0, 0.07)">
                                            <Text as="b">{closure.description}</Text>
                                            <HStack w="full">
                                                <VStack align="flex-start" flex="1">
                                                    <Text as="b">From:</Text>
                                                    <Text>{closure.from} to {closure.to}</Text>
                                                </VStack>
                                                <VStack align="flex-start" flex="1">
                                                    <Text as="b">Hours:</Text>
                                                    <Text>{closure.hours.open.hr === 0 ? "Closed" : `${closure.hours.open.hr}:${closure.hours.open.min} to ${closure.hours.close.hr}:${closure.hours.close.min}`}</Text>
                                                </VStack>
                                            </HStack>
                                        </VStack>
                                        <Menu>
                                            <MenuButton
                                                as={IconButton}
                                                icon={<BiDotsHorizontalRounded />}
                                                variant="ghost"
                                            />
                                            <MenuList mt="-30px" mr="20px">
                                                <MenuItem onClick={() => removeClosure(closure)}>
                                                    Remove
                                                </MenuItem>
                                            </MenuList>
                                        </Menu>
                                    </HStack>
                                )
                            })
                            : <Text>No special hours added</Text>}
                    </VStack>
                </VStack>
            </Stack>
            <Delay isOpen={isOpen1} onClose={onClose1} delay={business ? business.delay : '0'} setDelay={setDelay} />
            <Pause isOpen={isOpen2} onClose={onClose2} paused={business ? business.paused : false} setPaused={setPaused} />
        </Flex>
    )
}

interface DelayProps {
    isOpen: boolean,
    onClose: () => void,
    setDelay: (delay: string) => Promise<void>,
    delay: string
}

function Delay({ isOpen, onClose, setDelay, delay }: DelayProps) {
    const [value, setValue] = useState(delay)

    const saveChanges = () => {
        setDelay(value);
        onClose();
    }
    return (
        <Modal isCentered isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Set fulfillment delay</ModalHeader>
                <ModalCloseButton />
                <ModalBody >
                    <RadioGroup onChange={setValue} value={value}>
                        <VStack align="flex-start" mt="-20px" mb="20px" spacing="4">
                            <Text>Let customers know an approximate time delay it takes to fulfil their redemption</Text>
                            <Text as={'b'}>How long?</Text>
                            <HStack spacing="10">
                                <VStack>
                                    <Radio value='5'>
                                        5 min
                                    </Radio>
                                    <Radio value='10'>
                                        10 min
                                    </Radio>
                                    <Radio value='15'>
                                        15 min
                                    </Radio>
                                    <Radio value='20'>
                                        20 min
                                    </Radio>
                                    <Radio value='25'>
                                        25 min
                                    </Radio>
                                    <Radio value='30'>
                                        30 min
                                    </Radio>
                                </VStack>
                                <VStack>
                                    <Radio value='35'>
                                        35 min
                                    </Radio>
                                    <Radio value='40'>
                                        40 min
                                    </Radio>
                                    <Radio value='45'>
                                        45 min
                                    </Radio>
                                    <Radio value='50'>
                                        50 min
                                    </Radio>
                                    <Radio value='55'>
                                        55 min
                                    </Radio>
                                    <Radio value='60'>
                                        60 min
                                    </Radio>
                                </VStack>
                            </HStack>
                        </VStack>
                    </RadioGroup>
                </ModalBody>
                <ModalFooter>
                    <VStack w="full">
                        <Button p="7" w="full" boxShadow="0px 16px 50px rgba(0, 0, 0, 0.12)" fontSize={'md'} fontWeight={500} color={'white'} bg={'black'}
                            _hover={{ bg: 'black', color: 'white' }} _active={{ bg: 'black', color: 'white' }} _focus={{
                                boxShadow:
                                    '0px 16px 50px rgba(0, 0, 0, 0.12)',
                            }} onClick={saveChanges} >
                            Save Changes
                        </Button>
                        <Button p="7" w="full" boxShadow="0px 16px 50px rgba(0, 0, 0, 0.12)" fontSize={'md'} fontWeight={500} color={'black'} bg={'white'}
                            _hover={{ bg: 'white', color: 'black' }} _active={{ bg: 'white', color: 'black' }} _focus={{
                                boxShadow:
                                    '0px 16px 50px rgba(0, 0, 0, 0.12)',
                            }} onClick={onClose}>Close</Button>
                    </VStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

interface PauseProps {
    isOpen: boolean,
    onClose: () => void,
    setPaused: (status: boolean) => Promise<void>,
    paused: boolean

}

function Pause({ isOpen, onClose, setPaused, paused }: PauseProps) {
    const saveChanges = () => {
        setPaused(!paused);
        onClose();
    }
    return (
        <Modal isCentered isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{paused ? 'Resume Redemptions' : 'Pause Redemptions'}</ModalHeader>
                <ModalCloseButton />
                <ModalBody >
                    <VStack align="flex-start" mt="-20px" mb="20px" spacing="4">
                        <Text>
                            {paused ? 'Enable your customers to redeem their subscriptions by resuming redemptions' : 'Customers will not be able to redeem any subscriptions once redemptions are paused'}
                        </Text>
                        <Button p="7" w="full" boxShadow="0px 16px 50px rgba(0, 0, 0, 0.12)" fontSize={'md'} fontWeight={500} color={'white'} bg={'black'}
                            _hover={{ bg: 'black', color: 'white' }} _active={{ bg: 'black', color: 'white' }} _focus={{
                                boxShadow:
                                    '0px 16px 50px rgba(0, 0, 0, 0.12)',
                            }} onClick={saveChanges} >
                            {paused ? 'Resume' : 'Pause'}
                        </Button>
                        <Button p="7" w="full" boxShadow="0px 16px 50px rgba(0, 0, 0, 0.12)" fontSize={'md'} fontWeight={500} color={'black'} bg={'white'}
                            _hover={{ bg: 'white', color: 'black' }} _active={{ bg: 'white', color: 'black' }} _focus={{
                                boxShadow:
                                    '0px 16px 50px rgba(0, 0, 0, 0.12)',
                            }} onClick={onClose}>Close</Button>
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}