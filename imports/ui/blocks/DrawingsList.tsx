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
      <div id="DrawingsList">
        Spin for a new task!
      </div>
    );
  }

  return (
    <div id="DrawingsList">
      <h3>Active Tasks</h3>
      {drawings.map(drawing => (
        <div>
          <div className="WedgeRow" style={{
            backgroundColor: Colors[drawing.color as 'red'],
            padding: '0.5em',
            gap: '0.5em',
          }}>
            <div style={{ padding: '0.5em', flex: 1}}>
              <div style={{fontWeight: 'bold', fontSize: '1.2em'}}>{drawing.label}</div>
              <div>Drawn {drawing.drawnAt?.toLocaleDateString()}</div>
            </div>
            <button type="button" onClick={() => kickbackWedge(drawing._id)}>👎</button>
            <button type="button" onClick={() => completeWedge(drawing._id)}>✔</button>
          </div>
        </div>
      ))}
    </div>
  );
}
