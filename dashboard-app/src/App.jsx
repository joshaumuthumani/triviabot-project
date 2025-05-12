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
  VStack,
} from '@chakra-ui/react';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function App() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [endTime, setEndTime] = useState('');

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
      await axios.post(`${BASE_URL}/api/questions`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('✅ Question submitted!');
      setQuestion('');
      setAnswer('');
      setAttachment(null);
      setEndTime('');
    } catch (err) {
      console.error(err);
      alert('❌ Failed to submit question.');
    }
  };

  return (
    <Box maxW="600px" mx="auto" mt={10} p={6}>
      <Heading mb={6} textAlign="center">Submit Trivia Question</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
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
            <FormLabel>End Time (PST)</FormLabel>
            <Input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
            <Text fontSize="sm" color="gray.500">
              All times are in Pacific Standard Time (PST).
            </Text>
          </FormControl>

          <Button colorScheme="blue" type="submit" mt={4}>
            Submit Question
          </Button>
        </VStack>
      </form>
    </Box>
  );
}

export default App;