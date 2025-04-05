import React, { useCallback, useState } from 'react';
import { Wheel } from 'react-custom-roulette'

import { useFind } from 'meteor/react-meteor-data';
import { Wedge, WedgesCollection } from '/imports/api/wedges';
import { Colors } from '../util/colors';
import { Meteor } from 'meteor/meteor';

export function WheelSpinner(props: {
  wheelId: string;
}) {
  const wedges = useFind(() => WedgesCollection.find({
    wheelId: props.wheelId,
    lifecycle: 'live',
  }, {
    sort: {
      label: 1,
    },
  }), [props.wheelId]);

  const [activeSpin, setActiveSpin] = useState<{
    wedges: Wedge[];
    winnerIdx: number
  } | null>(null);

  const startSpin = useCallback(() => {
    const choices = wedges.flatMap((wedge, idx) => new Array(wedge.weight).fill(idx));
    const winnerIdx = choices[Math.floor(Math.random() * choices.length)];
    setActiveSpin({
      wedges,
      winnerIdx: winnerIdx,
    });
  }, [setActiveSpin, wedges]);
  const endSpin = useCallback(() => {
    if (!activeSpin) throw new Error(`invalid state`);
    const wedge = activeSpin.wedges[activeSpin.winnerIdx];
    Meteor.callAsync('wedges/draw', wedge._id).then(() => setActiveSpin(null), err => {
      alert(`Failed to record drawing: ${err.message}`);
      setActiveSpin(null);
    });
  }, [activeSpin, setActiveSpin]);

  if (wedges.length < 2) {
    return (
      <div id="WheelSpinner">
        Add more tasks to start spinning!
      </div>
    );
  }

  return (
    <div id="WheelSpinner">
      <Wheel
        mustStartSpinning={!!activeSpin}
        prizeNumber={activeSpin?.winnerIdx ?? 0}
        spinDuration={0.5}
        onStopSpinning={endSpin}
        data={(activeSpin?.wedges ?? wedges).map(x => ({
          option: x.label,
          optionSize: x.weight,
          style: {
            backgroundColor: Colors[x.color as 'red'],
            textColor: '#fff',
          },
        }))}
        backgroundColors={['#3e3e3e', '#df3428']}
        textColors={['#ffffff']}
      />
      <div style={{textAlign: 'center'}}>
        <button onClick={startSpin} type="button" disabled={!!activeSpin}>Spin</button>
      </div>
    </div>
  );
}
