import SimpleSchema from 'simpl-schema';
import BaseCollection from '/imports/api/base/BaseCollection';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { Tracker } from 'meteor/tracker';

/** @module Comments */

/**
 * Comments provide comment data for a comment.
 * @extends module:Base~BaseCollection
 */
class CommentCollection extends BaseCollection {

  /**
   * Creates the Comment collection.
   */
  constructor() {
    super('Comment', new SimpleSchema({
      clubId: { type: String },
      author: { type: String },
      text: { type: String },
      date: { type: String },
      picture: { type: String },
    }, { tracker: Tracker }));
  }

  define({ clubId, author, text, date, picture }) {
    // make sure required fields are OK.
    const checkPattern = { clubId: String, author: String, text: String, date: String, picture: String };
    check({ clubId, author, text, date, picture }, checkPattern);

    return this._collection.insert({ clubId, author, text, date, picture });
  }

  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const clubId = doc.clubId;
    const author = doc.author;
    const text = doc.text;
    const date = doc.date;
    const picture = doc.picture;
    return { clubId, author, text, date, picture };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Comments = new CommentCollection();
