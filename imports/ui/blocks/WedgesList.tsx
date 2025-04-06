import React, { useCallback } from 'react';
import { useFind } from 'meteor/react-meteor-data';
import { WedgesCollection } from '/imports/api/wedges';
import { Colors } from '../util/colors';
import { Meteor } from 'meteor/meteor';

export function WedgesList(props: {
  wheelId: string;
}) {
  const wedges = useFind(() => WedgesCollection
    .find({
      wheelId: props.wheelId,
      lifecycle: {$in: ['live', 'icebox']},
    }, {
      sort: {
        label: 1,
      },
    }), [props.wheelId]);

  const iceboxWedge = useCallback((id: string) => {
    Meteor.callAsync('wedges/icebox', id);
  }, []);

  const thawWedge = useCallback((id: string) => {
    Meteor.callAsync('wedges/thaw', id);
  }, []);

  const dropWedge = useCallback((id: string) => {
    if (!confirm(`Really delete task?`)) return;
    Meteor.callAsync('wedges/drop', id);
  }, []);

  const reweightWedge = useCallback((id: string, newWeight: number) => {
    Meteor.callAsync('wedges/reweight', id, newWeight);
  }, []);

  if (wedges.length == 0) {
    return (
      <div id="WedgesList">
        Add a task to get started
      </div>
    );
  }

  return (
    <div id="WedgesList">
      <h3>Tasks in play</h3>
      {wedges.filter(x => x.lifecycle == 'live').map(drawing => (
        <div>
          <div className="WedgeRow" style={{
            backgroundColor: Colors[drawing.color as 'red'],
            padding: '0.25em',
            gap: '0.25em',
          }}>
            <div style={{ padding: '0.25em', flex: 1}}>
              <div style={{fontWeight: 'bold'}}>{drawing.label}</div>
              <div style={{fontSize: '0.8em'}}>Added {drawing.createdAt?.toLocaleDateString()}</div>
            </div>
            {drawing.weight > 1 ? (
              <button type="button" onClick={() => reweightWedge(drawing._id, drawing.weight-1)}>➖</button>
            ) : []}
            <button type="button" onClick={() => reweightWedge(drawing._id, drawing.weight+1)}>➕</button>
            <button type="button" onClick={() => iceboxWedge(drawing._id)}>💤</button>
            <button type="button" onClick={() => dropWedge(drawing._id)}>🗑</button>
          </div>
        </div>
      ))}
      <h3 style={{marginTop: '1em'}}>Low priority</h3>
      {wedges.filter(x => x.lifecycle == 'icebox').map(drawing => (
        <div>
          <div className="WedgeRow" style={{
            backgroundColor: Colors[drawing.color as 'red'],
            padding: '0.25em',
            gap: '0.25em',
          }}>
            <div style={{ padding: '0.25em', flex: 1}}>
              <div style={{fontWeight: 'bold'}}>{drawing.label}</div>
              <div style={{fontSize: '0.8em'}}>Added {drawing.createdAt?.toLocaleDateString()}</div>
            </div>
            <button type="button" onClick={() => thawWedge(drawing._id)}>🆙</button>
            <button type="button" onClick={() => dropWedge(drawing._id)}>🗑</button>
          </div>
        </div>
      ))}
    </div>
  );
}
