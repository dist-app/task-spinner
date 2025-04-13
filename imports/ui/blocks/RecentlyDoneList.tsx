import React, { useCallback } from 'react';
import { useFind } from 'meteor/react-meteor-data';
import { WedgesCollection } from '/imports/api/wedges';
import { Colors } from '../util/colors';
import { Meteor } from 'meteor/meteor';

export function RecentlyDoneList(props: {
  wheelId: string;
}) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - 7);
  const wedges = useFind(() => WedgesCollection
    .find({
      wheelId: props.wheelId,
      lifecycle: 'done',
      $or: [{
        doneAt: { $gt: cutoffDate },
      }, {
        drawnAt: { $gt: cutoffDate },
      }],
    }, {
      limit: 5,
      sort: {
        doneAt: -1,
        drawnAt: -1,
      },
    }), [props.wheelId]);

  if (wedges.length == 0) {
    return (
      <div id="RecentlyDoneList">
        Completed tasks will go here
      </div>
    );
  }

  return (
    <div id="RecentlyDoneList">
      <h3>Recently completed</h3>
      {wedges.map(drawing => (
        <div key={drawing._id} className="WedgeRow" style={{
          backgroundColor: Colors[drawing.color as 'red'],
          padding: '0.25em',
          gap: '0.25em',
        }}>
          <div style={{ padding: '0.25em', flex: 1}}>
            <div style={{fontWeight: 'bold', textDecoration: 'line-through' }}>{drawing.label}</div>
            <div style={{fontSize: '0.8em'}}>Completed {drawing.doneAt?.toLocaleDateString()}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
