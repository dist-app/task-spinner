import React from 'react';
import { Link } from 'raviger'
import { useSubscribe, useFind } from 'meteor/react-meteor-data';

import { WheelsCollection } from '/imports/api/wheels';
import { CreateWheelForm } from './blocks/CreateWheelForm';

export const HomePage = () => {
  const wheels = useFind(() => WheelsCollection.find());

  return (
    <div>
      <h3>Wheels</h3>
      <ul>
        {wheels.map(wheel => (
          <li key={wheel._id}>
            <Link
              href={`/wheels/${wheel._id}`}
              style={{padding: '0.5em', display: 'inline-block'}}
            >{wheel.label}</Link>
          </li>
        ))}
        <li>
          <CreateWheelForm />
        </li>
      </ul>
    </div>
  );
};
