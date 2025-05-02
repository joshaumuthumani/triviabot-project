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
    <div className="submit-question-container">
      <h2>Submit New Trivia Question</h2>
      <form onSubmit={handleSubmit} className="submit-form">
        <div className="form-group">
          <label htmlFor="question">Question:</label>
          <input
            id="question"
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="answer">Correct Answer:</label>
          <input
            id="answer"
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="attachment">Attachment (optional):</label>
          <input
            id="attachment"
            type="file"
            onChange={(e) => setAttachment(e.target.files[0])}
          />
        </div>

        <div className="form-group">
          <label htmlFor="endTime">End Time (PST):</label>
          <input
            id="endTime"
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
          <small className="helper-text">All times are in Pacific Standard Time (PST).</small>
        </div>

        <button type="submit" className="submit-button">
          Submit Question
        </button>
      </form>
    </div>
  );
}

export default SubmitQuestion;