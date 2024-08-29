import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import { createLogEntry } from './API'; // Make sure this API function is defined

const LogEntryForm = ({ location, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit } = useForm(); // Destructure methods from react-hook-form

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      data.latitude = location.lat;
      data.longitude = location.lng;
      console.log(data);
      await createLogEntry(data);
      onClose(); // Close the popup after a successful submission
    } catch (error) {
      console.error(error);
      setError(error.message); // Set and display the error
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="entry-form">
      {error && <h3 className="error">{error}</h3>}
      
      
      <label htmlFor="title">Title</label>
      <input
        name="title"
        required
        {...register("title")} // Correct register usage
      />
      
      <label htmlFor="comments">Comments</label>
      <textarea
        name="comments"
        rows={3}
        {...register("comments")} // Correct register usage
      ></textarea>
      
      <label htmlFor="description">Description</label>
      <textarea
        name="description"
        rows={3}
        {...register("description")} // Correct register usage
      ></textarea>
      
      <label htmlFor="image">Image URL</label>
      <input
        name="image"
        {...register("image")} // Correct register usage
      />
      
      <label htmlFor="visitDate">Visit Date</label>
      <input
        name="visitDate"
        type="date"
        required
        {...register("visitDate")} // Correct register usage
      />
      
      <button disabled={loading}>
        {loading ? 'Loading...' : 'Create Entry'}
      </button>
    </form>
  );
};

export default LogEntryForm;
