import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const ResetPassword = ({ match }) => {
  const { resetToken } = useParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resetToken,password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
      } else {
        setMessage('Password reset failed');
      }
    } catch (error) {
      setMessage('Error resetting password');
    }
  };

  return (
    <form className="login" >
      
        <h3>Reset Password</h3>
        <label>Email:</label>
        <input type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label>Nouveau mot de passe:</label>
        <input type="password" placeholder="New Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <label>Confirmer mot de passe:</label>
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button onClick={handleResetPassword}>Reset Password</button>
        <p>{message}</p>
      
    </form>
  );
};

export default ResetPassword;