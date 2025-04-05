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
    <form id="CreateWedgeForm" onSubmit={handleSubmit(d => onSubmit(d))}>

      <h4>Add wedge</h4>

      <div style={{display: 'flex'}} className="input-row">
        <input
          {...register('label', { required: true })}
          style={{flex: 1}}
          placeholder="Wedge label"
        />

        <input
          {...register('weight', { required: true, min: 1 })}
          type='number'
          style={{ width: '3em' }}
        />

        <button
          type="submit"
          disabled={formState.isSubmitting}
        >
          Save
        </button>
      </div>

      <div style={{display: 'flex', flexWrap: 'wrap'}}>
        {Object.entries(Colors).map(pair => (
          <label key={pair[0]} title={pair[0]} style={{
            // width: '3em', height: '3em',
            flex: '11%',
            aspectRatio: '1/1',
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

    </form>
  );
};
