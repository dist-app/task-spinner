import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { WheelsCollection } from '/imports/api/wheels.ts';
import { WedgesCollection } from '/imports/api/wedges.ts';

Meteor.publish("wheel-list", function () {
  return WheelsCollection.find();
});

Meteor.publish("wheel-wedges", function (wheelId: unknown) {
  check(wheelId, String);
  return [
    WedgesCollection.find({ wheelId }),
  ];
});
