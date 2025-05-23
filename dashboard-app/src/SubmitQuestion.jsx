import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  VStack,
  Heading,
  useToast
} from '@chakra-ui/react';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function SubmitQuestion() {
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
        isClosable: true
      });
      console.log(response.data);
      setQuestion('');
      setAnswer('');
      setAttachment(null);
      setEndTime('');
    } catch (err) {
      console.error(err);
      toast({
        title: 'Submission failed',
        description: 'Could not submit the question.',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  };

  return (
    <Box maxW="600px" mx="auto" p={6}>
      <Heading size="md" mb={6}>Submit New Trivia Question</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl isRequired>
            <FormLabel>Question</FormLabel>
            <Input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Correct Answer</FormLabel>
            <Input
              type="text"
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

          <Button type="submit" colorScheme="blue">
            Submit Question
          </Button>
        </VStack>
      </form>
    </Box>
  );
}

export default SubmitQuestion;