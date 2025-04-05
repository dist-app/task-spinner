import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useNavigate } from 'raviger'
import { useForm } from 'react-hook-form';

export const CreateWheelForm = () => {
  const {
    register,
    handleSubmit,
    formState,
  } = useForm();

  const navigate = useNavigate();

  async function onSubmit(data: {
    label: string;
  }) {
    try {
      const id = await Meteor.callAsync('wheels/create', data.label);
      navigate(`/wheels/${id}`);
    } catch (err) {
      alert(`Creation failed: ${(err as Error).message}`);
    }
  }

  return (
    <form onSubmit={handleSubmit(d => onSubmit(d as any))}>

      <input
        {...register('label', { required: true })}
        required
        placeholder="Wheel label..."
      />

      <button
        type="submit"
        disabled={formState.isSubmitting}
      >
        Create wheel
      </button>

    </form>
  );
};
