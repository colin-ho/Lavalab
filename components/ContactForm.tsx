import { Button } from "@chakra-ui/button";
import { ArrowForwardIcon, CloseIcon} from "@chakra-ui/icons";
import {  Heading, VStack,  HStack, Text,  } from "@chakra-ui/layout";
import {  FormControl, FormErrorMessage, Input, Modal, ModalContent,ModalOverlay, Textarea, useToast,IconButton } from "@chakra-ui/react";
import { FormEvent, useState } from "react";

import{ sendForm } from '@emailjs/browser';

export function Contact({ isOpen, onClose }: any) {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [nameError, setNameError] = useState(false)
    const [emailError, setEmailError] = useState(false)
    const [messageError, setMessageError] = useState(false)
    const [loading, setLoading] = useState(false)
    const toast = useToast()

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!name) setNameError(true)
        else if (!email) {
            setNameError(false)
            setEmailError(true)
        }
        else if (!message) {
            setNameError(false)
            setEmailError(false)
            setMessageError(true)
        }
        else {
            setNameError(false)
            setEmailError(false)
            setMessageError(false)
            setLoading(true)
            try {
                await sendForm('contact_service', 'contact_form', e.currentTarget,process.env.NEXT_PUBLIC_EMAILJS_USERID)

                setLoading(false)
                toast({
                    title: 'Message sent',
                    description: "We will get back to you shortly!",
                    status: 'success',
                    position: 'top',
                    duration: 4000,
                    isClosable: true,
                })
                setName('')
                setEmail('')
                setMessage('')
                onClose()
            } catch (err) {
                setLoading(false)
                alert('Error in submitting')
                console.log(err)
            }
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent p="8" mx="4">
                <VStack spacing="8" alignItems="flex-start">
                    <HStack w="full" justify="flex-end">
                        <IconButton aria-label='Close form' variant="unstyled" _focus={{ borderColor: 'none' }} icon={<CloseIcon />}onClick={onClose}/>
                    </HStack>
                    <Heading>Contact us</Heading>
                    <Text>We&apos;re happy to help! Please leave a message below and we will get back to you as soon as possible.</Text>
                    <form style={{ width: "100%" }} onSubmit={(e) => handleSubmit(e)}>
                        <VStack align="flex-end" w="full" spacing="4">
                            <FormControl isInvalid={nameError}>
                                <FormErrorMessage>Name cannot be empty</FormErrorMessage>
                                <Input name="user_name" placeholder="Name*" type="text" value={name} onChange={(e) => setName(e.target.value)} borderColor="black" variant="flushed" />
                            </FormControl>
                            <FormControl isInvalid={emailError}>
                                <FormErrorMessage>Email cannot be empty</FormErrorMessage>
                                <Input name="user_email" placeholder="Email*" type="email" value={email} onChange={(e) => setEmail(e.target.value)} borderColor="black" variant="flushed" />
                            </FormControl>
                            <FormControl isInvalid={messageError}>
                                <FormErrorMessage>Message cannot be empty</FormErrorMessage>
                                <Textarea name="message" placeholder="Message*" type="text" value={message} onChange={(e) => setMessage(e.target.value)} borderColor="black" variant="flushed" />
                            </FormControl>
                            <Button isLoading={loading} type="submit" variant="unstyled" _focus={{ borderColor: 'none' }} rightIcon={<ArrowForwardIcon />}>Submit</Button>
                        </VStack>
                    </form>
                </VStack>
            </ModalContent>
        </Modal>

    )
}