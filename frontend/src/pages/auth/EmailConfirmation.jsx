import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const EmailConfirmation = () => {
  const { code  } = useParams();
  const [confirmationMessage, setConfirmationMessage] = useState('');

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const response = await fetch(`http://localhost:8000/auth/confirm?code=${code}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        const data = await response.json();

        if (response.ok) {
          setConfirmationMessage(data.message);
        } else {
          setConfirmationMessage('Email confirmation failed');
        }
      } catch (error) {
        setConfirmationMessage('Error confirming email');
      }
    };

    confirmEmail();
  }, [token]);

  return (
    <div>
      <h2>Email Confirmation</h2>
      <p>{confirmationMessage}</p>
    </div>
  );
};

export default EmailConfirmation;

