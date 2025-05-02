import React, { useState } from 'react';
import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;
console.log('Posting to:', BASE_URL);

function SubmitQuestion() {
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
      const response = await axios.post(`${BASE_URL}/api/questions`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Question submitted!');
      console.log(response.data);
      setQuestion('');
      setAnswer('');
      setAttachment(null);
      setEndTime('');
    } catch (err) {
      console.error(err);
      alert('Failed to submit question');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '500px', textAlign: 'left' }}>
        <h2>Submit New Trivia Question</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Question:</label><br />
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
          <div>
            <label>Correct Answer:</label><br />
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
          <div>
            <label>Attachment (optional):</label><br />
            <input
              type="file"
              onChange={(e) => setAttachment(e.target.files[0])}
              style={{ marginTop: '5px' }}
            />
          </div>
          <div>
            <label>End Time:</label><br />
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
              style={{ marginTop: '5px' }}
            />
          </div>
          <br />
          <button type="submit" style={{ marginTop: '10px', backgroundColor: '#4CAF50', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Submit Question
          </button>
        </form>
      </div>
    </div>
  );
}

export default SubmitQuestion;