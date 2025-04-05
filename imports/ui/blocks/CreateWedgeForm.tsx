import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useForm } from 'react-hook-form';
import { Colors } from '../util/colors';

export const CreateWedgeForm = (props: {
  wheelId: string;
}) => {
  const {
    register,
    handleSubmit,
    formState,
    reset,
  } = useForm({
    defaultValues: {
      label: '',
      weight: '1',
      color: 'green',
    },
  });

  async function onSubmit(data: {
    label: string;
    weight: string;
    color: string;
  }) {
    try {
      await Meteor.callAsync('wedges/create',
        props.wheelId,
        data.label,
        parseInt(data.weight, 10),
        data.color);
      reset();
    } catch (err) {
      alert(`Creation failed: ${(err as Error).message}`);
    }
  }

  return (
    <form onSubmit={handleSubmit(d => onSubmit(d))}>

      <h4>Add wedge</h4>

      <input
        {...register('label', { required: true })}
        placeholder="Wedge label"
      />

      <input
        {...register('weight', { required: true, min: 1 })}
        type='number'
        style={{ width: '3em' }}
      />

      <div style={{display: 'flex', width: '20em', flexWrap: 'wrap'}}>
        {Object.entries(Colors).map(pair => (
          <label key={pair[0]} title={pair[0]} style={{
            width: '2.5em', height: '2.5em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: pair[1]}}>
            <input
              {...register('color', { required: true })}
              type='radio'
              value={pair[0]}
            />
          </label>
        ))}
      </div>

      <button
        type="submit"
        disabled={formState.isSubmitting}
      >
        Add wedge
      </button>

    </form>
  );
};
