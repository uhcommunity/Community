import SimpleSchema from 'simpl-schema';
import BaseCollection from '/imports/api/base/BaseCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { Tracker } from 'meteor/tracker';

/** @module Club */

/**
 * Clubs provide club data for a club.
 * @extends module:Base~BaseCollection
 */
class ClubCollection extends BaseCollection {

  /**
   * Creates the Club collection.
   */
  constructor() {
    super('Club', new SimpleSchema({
      clubName: { type: String },
      // Remainder are optional
      clubDescription: { type: String, optional: true },
      interests: { type: Array, optional: true },
      'interests.$': { type: String },
      picture: { type: SimpleSchema.RegEx.Url, optional: true },
      github: { type: SimpleSchema.RegEx.Url, optional: true },
      facebook: { type: SimpleSchema.RegEx.Url, optional: true },
      instagram: { type: SimpleSchema.RegEx.Url, optional: true },
    }, { tracker: Tracker }));
  }

  /**
   * Defines a new Club.
   * @example
   * Profiles.define({ firstName: 'Philip',
   *                   lastName: 'Johnson',
   *                   username: 'johnson',
   *                   bio: 'I have been a professor of computer science at UH since 1990.',
   *                   interests: ['Application Development', 'Software Engineering', 'Databases'],
   *                   title: 'Professor of Information and Computer Sciences',
   *                   picture: 'http://philipmjohnson.org/headshot.jpg',
   *                   github: 'https://github.com/philipmjohnson',
   *                   facebook: 'https://facebook.com/philipmjohnson',
   *                   instagram: 'https://instagram.com/philipmjohnson' });
   * @param { Object } description Object with required key username.
   * Remaining keys are optional.
   * Username must be unique for all users. It should be the UH email account.
   * Interests is an array of defined interest names.
   * @throws { Meteor.Error } If a user with the supplied username already exists, or
   * if one or more interests are not defined, or if github, facebook, and instagram are not URLs.
   * @returns The newly created docID.
   */
  define({ clubName, clubDescription = '', interests = [], picture = '', github = '',
           facebook = '', instagram = '' }) {
    // make sure required fields are OK.
    const checkPattern = { clubName: String, clubDescription: String, picture: String };
    check({ clubName, clubDescription, picture }, checkPattern);

    if (this.find({ clubName }).count() > 0) {
      throw new Meteor.Error(`${clubName} is previously defined in another Club`);
    }

    // Throw an error if any of the passed Interest names are not defined.
    Interests.assertNames(interests);

    // Throw an error if there are duplicates in the passed interest names.
    if (interests.length !== _.uniq(interests).length) {
      throw new Meteor.Error(`${interests} contains duplicates`);
    }

    return this._collection.insert({ clubName, clubDescription, interests, picture, github,
      facebook, instagram });
  }

  /**
   * Returns an object representing the Club docID in a format acceptable to define().
   * @param docID The docID of a Club.
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const clubName = doc.clubName;
    const clubDescription = doc.clubDescription;
    const interests = doc.interests;
    const picture = doc.picture;
    const github = doc.github;
    const facebook = doc.facebook;
    const instagram = doc.instagram;
    return { clubName, clubDescription, interests, picture, github, facebook, instagram };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Clubs = new ClubCollection();
