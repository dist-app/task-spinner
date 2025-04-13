import React from 'react';
import { useSubscribe, useFind, useTracker } from 'meteor/react-meteor-data';

import { WheelsCollection } from '/imports/api/wheels';
import { CreateWedgeForm } from './blocks/CreateWedgeForm';
import { DrawingsList } from './blocks/DrawingsList';
import { RecentlyDoneList } from './blocks/RecentlyDoneList';
import { WedgesList } from './blocks/WedgesList';
import { WheelSpinner } from './blocks/WheelSpinner';

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
      {/* <div id="WheelSidebar"> */}
      <DrawingsList wheelId={wheel._id} />
      <div id="CreateBox">
        <CreateWedgeForm wheelId={wheel._id} />
        <RecentlyDoneList wheelId={wheel._id} />
      </div>
      <WedgesList wheelId={wheel._id} />
      {/* </div> */}
    </div>
  );
};
