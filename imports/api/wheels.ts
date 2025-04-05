import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export interface Wheel {
  _id: string;
  createdAt: Date;
  label: string;
}

export const WheelsCollection = new Mongo.Collection<Wheel>('Wheels');

Meteor.methods({

  async 'wheels/create'(label: unknown) {
    check(label, String);

    return await WheelsCollection.insertAsync({
      createdAt: new Date(),
      label,
    });
  },

})
