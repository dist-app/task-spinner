import React from 'react';
import { Link } from 'raviger'
import { useSubscribe, useFind, useTracker } from 'meteor/react-meteor-data';

import { WheelsCollection } from '/imports/api/wheels';
import { WedgesCollection } from '../api/wedges';
import { CreateWedgeForm } from './blocks/CreateWedgeForm';
import { WheelSpinner } from './blocks/WheelSpinner';
import { DrawingsList } from './blocks/DrawingsList';
import { WedgesList } from './blocks/WedgesList';

export const WheelPage = (props: {
  wheelId: string;
}) => {
  const isLoading = useSubscribe("wheel-wedges", props.wheelId);
  const wheel = useTracker(() => WheelsCollection.findOne({ _id: props.wheelId }), [props.wheelId]);

  if (isLoading() || !wheel) {
    return <div>Loading wheel...</div>;
  }

  return (
    <div id="WheelPage">
      <div id="WheelHeader">
        <h2>{wheel.label}</h2>
      </div>
      <WheelSpinner wheelId={wheel._id} />
      <div id="WheelSidebar">
        <DrawingsList wheelId={wheel._id} />
        <WedgesList wheelId={wheel._id} />
        <CreateWedgeForm wheelId={wheel._id} />
      </div>
    </div>
  );
};
