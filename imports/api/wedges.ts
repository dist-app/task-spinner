import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export interface Wedge {
  _id: string;
  wheelId: string;
  createdAt: Date;
  drawnAt?: Date | null;
  doneAt?: Date | null;
  lifecycle: 'live' | 'icebox' | 'drawn' | 'done' | 'dropped';
  label: string;
  weight: number;
  color: string;
}

export const WedgesCollection = new Mongo.Collection<Wedge>('Wedges');

Meteor.methods({

  async 'wedges/create'(wheelId: unknown, label: unknown, weight: unknown, color: unknown) {
    check(wheelId, String);
    check(label, String);
    check(weight, Number);
    check(color, String);
    if (weight < 1 || parseInt(`${weight}`, 10) !== weight) {
      throw new Meteor.Error(`invalid-weight`, `Weight must be an integer, 1 or greater`);
    }

    return await WedgesCollection.insertAsync({
      wheelId,
      createdAt: new Date(),
      lifecycle: 'live',
      label,
      weight,
      color,
    });
  },

  async 'wedges/draw'(wedgeId: unknown) {
    check(wedgeId, String);
    await WedgesCollection.updateAsync({
      _id: wedgeId,
      lifecycle: 'live',
    }, {
      $set: {
        lifecycle: 'drawn',
        drawnAt: new Date,
      },
    });
  },

  async 'wedges/complete'(wedgeId: unknown) {
    check(wedgeId, String);
    await WedgesCollection.updateAsync({
      _id: wedgeId,
      lifecycle: 'drawn',
    }, {
      $set: {
        lifecycle: 'done',
        drawnAt: new Date,
      },
    });
  },

  async 'wedges/kickback'(wedgeId: unknown) {
    check(wedgeId, String);
    await WedgesCollection.updateAsync({
      _id: wedgeId,
      lifecycle: 'drawn',
    }, {
      $set: {
        lifecycle: 'live',
        drawnAt: null,
      },
    });
  },

  async 'wedges/icebox'(wedgeId: unknown) {
    check(wedgeId, String);
    await WedgesCollection.updateAsync({
      _id: wedgeId,
      lifecycle: 'live',
    }, {
      $set: {
        lifecycle: 'icebox',
      },
    });
  },

  async 'wedges/thaw'(wedgeId: unknown) {
    check(wedgeId, String);
    await WedgesCollection.updateAsync({
      _id: wedgeId,
      lifecycle: 'icebox',
    }, {
      $set: {
        lifecycle: 'live',
      },
    });
  },

  async 'wedges/drop'(wedgeId: unknown) {
    check(wedgeId, String);
    await WedgesCollection.updateAsync({
      _id: wedgeId,
    }, {
      $set: {
        lifecycle: 'dropped',
      },
    });
  },

  async 'wedges/reweight'(wedgeId: unknown, weight: number) {
    check(wedgeId, String);
    check(weight, Number);
    if (weight < 1) throw new Meteor.Error(`invalid-weight`, `Must be 1+`);
    if (weight !== parseInt(`${weight}`, 10)) throw new Meteor.Error(`invalid-weight`, `Must be integer`);
    await WedgesCollection.updateAsync({
      _id: wedgeId,
      lifecycle: 'live',
    }, {
      $set: {
        weight,
      },
    });
  },

})
