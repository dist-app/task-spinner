import React, { useCallback } from 'react';
import { useFind } from 'meteor/react-meteor-data';
import { WedgesCollection } from '/imports/api/wedges';
import { Colors } from '../util/colors';
import { Meteor } from 'meteor/meteor';

export function DrawingsList(props: {
  wheelId: string;
}) {
  const drawings = useFind(() => WedgesCollection
    .find({
      wheelId: props.wheelId,
      lifecycle: 'drawn',
    }, {
      sort: {
        drawnAt: 1,
      },
    }), [props.wheelId]);

  const completeWedge = useCallback((id: string) => {
    Meteor.callAsync('wedges/complete', id);
  }, []);

  const kickbackWedge = useCallback((id: string) => {
    Meteor.callAsync('wedges/kickback', id);
  }, []);

  if (drawings.length == 0) {
    return (
      <div id="DrawingsList" className="EmptyList">
        Spin for a new task!
      </div>
    );
  }

  return (
    <div id="DrawingsList">
      <h3>Active Tasks</h3>
      {drawings.map(wedge => (
        <div key={wedge._id} className="WedgeRow" style={{
          backgroundColor: Colors[wedge.color as 'red'],
          padding: '0.5em',
          gap: '0.5em',
        }}>
          <div style={{ padding: '0.5em', flex: 1}}>
            <div className="LgFont" style={{fontWeight: 'bold'}}>{wedge.label}</div>
            <div>Drawn {wedge.drawnAt?.toLocaleDateString()}</div>
          </div>
          <button className="LgFont" type="button" onClick={() => kickbackWedge(wedge._id)}>👎</button>
          <button className="LgFont" type="button" onClick={() => completeWedge(wedge._id)}>✔</button>
        </div>
      ))}
    </div>
  );
}
