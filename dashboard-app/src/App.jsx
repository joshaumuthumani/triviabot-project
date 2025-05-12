// src/App.jsx
import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function App() {
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
        title: 'Question submitted!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setQuestion('');
      setAnswer('');
      setAttachment(null);
      setEndTime('');
    } catch (err) {
      console.error(err);
      toast({
        title: 'Submission failed',
        description: 'Please check your form and try again.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxW="500px" mx="auto" mt={10} p={6} borderWidth="1px" borderRadius="md" boxShadow="md">
      <Heading mb={6}>Submit Trivia Question</Heading>
      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Question</FormLabel>
            <Input value={question} onChange={(e) => setQuestion(e.target.value)} />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Correct Answer</FormLabel>
            <Input value={answer} onChange={(e) => setAnswer(e.target.value)} />
          </FormControl>

          <FormControl>
            <FormLabel>Attachment (optional)</FormLabel>
            <Input type="file" onChange={(e) => setAttachment(e.target.files[0])} />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>End Time (PST)</FormLabel>
            <Input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            <Text fontSize="sm" color="gray.500">All times are Pacific Time</Text>
          </FormControl>

          <Button colorScheme="blue" type="submit">Submit</Button>
        </Stack>
      </form>
    </Box>
  );
}

export default App;