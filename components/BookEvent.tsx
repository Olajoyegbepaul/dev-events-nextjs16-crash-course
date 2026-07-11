'use client';

import {useState} from 'react';

const BookEvent = () => {
  const [Email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setTimeout(() => {
      setSubmitted(true);
    }, 1000);
  }

  return (
    <div id="book-event">
      {submitted ? (
        <p className="text-sm">Thank you for signing up!.</p>
      ): (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email</label>
            <input 
              type="email"
              id="email"
              placeholder="Enter your email address"
              value={Email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button type="submit" className="button-submit">Submit</button>
        </form>
      )}
    </div>
  )
}

export default BookEvent