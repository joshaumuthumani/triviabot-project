import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useToast,
} from '@chakra-ui/react';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export default function SubmitQuestion() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [endTime, setEndTime] = useState('');
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('question', question);
    formData.append('answer', answer);
    formData.append('endTime', endTime);
    if (attachment) {
      formData.append('attachment', attachment);
    }

    try {
      const response = await axios.post(`${BASE_URL}/api/questions`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast({
        title: 'Success',
        description: 'Question submitted!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      console.log(response.data);
      setQuestion('');
      setAnswer('');
      setAttachment(null);
      setEndTime('');
    } catch (err) {
      console.error(err);
      toast({
        title: 'Error',
        description: 'Failed to submit question.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      px={4}
    >
      <Box width="100%" maxW="500px">
        <Heading as="h2" size="lg" mb={6}>
          Submit New Trivia Question
        </Heading>
        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Question</FormLabel>
              <Input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Correct Answer</FormLabel>
              <Input
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Attachment (optional)</FormLabel>
              <Input
                type="file"
                onChange={(e) => setAttachment(e.target.files[0])}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>End Time</FormLabel>
              <Input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </FormControl>

            <Button colorScheme="green" type="submit">
              Submit Question
            </Button>
          </Stack>
        </form>
      </Box>
    </Box>
  );
}