import React, { useCallback, useMemo } from 'react';
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

  const liveWedges = useMemo(() => wedges.filter(x => x.lifecycle == 'live'), [wedges]);
  const iceboxWedges = useMemo(() => wedges.filter(x => x.lifecycle == 'icebox'), [wedges]);

  return (
    <div id="WedgesList">

      <h3>Tasks in play</h3>
      {liveWedges.length ? liveWedges.map(wedge => (
        <div key={wedge._id} className="WedgeRow" style={{
          backgroundColor: Colors[wedge.color as 'red'],
          padding: '0.25em',
          gap: '0.25em',
        }}>
          <div style={{ padding: '0.25em', flex: 1}}>
            <div style={{fontWeight: 'bold'}}>{wedge.label}</div>
            <div style={{fontSize: '0.8em'}}>Added {wedge.createdAt?.toLocaleDateString()}</div>
          </div>
          {wedge.weight > 1 ? (
            <button type="button" onClick={() => reweightWedge(wedge._id, wedge.weight-1)}>➖</button>
          ) : []}
          <button type="button" onClick={() => reweightWedge(wedge._id, wedge.weight+1)}>➕</button>
          <button type="button" onClick={() => iceboxWedge(wedge._id)}>💤</button>
          <button type="button" onClick={() => dropWedge(wedge._id)}>🗑</button>
        </div>
      )) : (
        <div className="EmptyList LgFont">
          Add several tasks you've been procrastinating on to get started.
        </div>
      )}

      <h3 style={{marginTop: '1em'}}>Low priority</h3>
      {iceboxWedges.length ? iceboxWedges.map(wedge => (
        <div key={wedge._id} className="WedgeRow" style={{
          backgroundColor: Colors[wedge.color as 'red'],
          padding: '0.25em',
          gap: '0.25em',
        }}>
          <div style={{ padding: '0.25em', flex: 1}}>
            <div style={{fontWeight: 'bold'}}>{wedge.label}</div>
            <div style={{fontSize: '0.8em'}}>Added {wedge.createdAt?.toLocaleDateString()}</div>
          </div>
          <button type="button" onClick={() => thawWedge(wedge._id)}>🆙</button>
          <button type="button" onClick={() => dropWedge(wedge._id)}>🗑</button>
        </div>
      )) : (
        <div className="EmptyList SmFont">
          Snooze any tasks that aren't as important yet.
        </div>
      )}

    </div>
  );
}
