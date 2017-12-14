/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

import { Clubs } from '/imports/api/profile/ClubCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { removeAllEntities } from '/imports/api/base/BaseUtilities';

if (Meteor.isServer) {
  describe('ClubCollection', function testSuite() {
    const interestName = 'Software Engineering';
    const interestDescription = 'Tools for software development';
    const username = 'jordanoo';
    const clubName = 'johnson';
    const clubDescription = 'I have been a professor of computer science at UH since 1990.';
    const interests = [interestName];
    const picture = 'http://philipmjohnson.org/headshot.jpg';
    const github = 'http://github.com/philipjohnson';
    const facebook = 'http://github.com/philipjohnson';
    const instagram = 'http://github.com/philipjohnson';
    const defineObject = { clubName, clubDescription, username, interests, picture, github, facebook, instagram };

    before(function setup() {
      removeAllEntities();
      // Define a sample interest.
      Interests.define({ name: interestName, description: interestDescription });
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #removeIt, #dumpOne, #restoreOne', function test() {
      let docID = Clubs.define(defineObject);
      expect(Clubs.isDefined(docID)).to.be.true;
      // Check that fields are available
      const doc = Clubs.findDoc(docID);
      expect(doc.clubName).to.equal(clubName);
      expect(doc.clubDescription).to.equal(clubDescription);
      expect(doc.username).to.equal(username);
      expect(doc.interests[0]).to.equal(interestName);
      expect(doc.picture).to.equal(picture);
      expect(doc.github).to.equal(github);
      expect(doc.facebook).to.equal(facebook);
      expect(doc.instagram).to.equal(instagram);
      // Check that multiple definitions with the same email address fail
      expect(function foo() { Clubs.define(defineObject); }).to.throw(Error);
      // Check that we can dump and restore a Profile.
      const dumpObject = Clubs.dumpOne(docID);
      Clubs.removeIt(docID);
      expect(Clubs.isDefined(docID)).to.be.false;
      docID = Clubs.restoreOne(dumpObject);
      expect(Clubs.isDefined(docID)).to.be.true;
      Clubs.removeIt(docID);
    });

    it('#define (illegal interest)', function test() {
      const illegalInterests = ['foo'];
      const defineObject2 = { clubName, username, clubDescription, interests: illegalInterests, picture,
        github, facebook, instagram };
      expect(function foo() { Clubs.define(defineObject2); }).to.throw(Error);
    });

    it('#define (duplicate interests)', function test() {
      const duplicateInterests = [interestName, interestName];
      const defineObject3 = { clubName, username, clubDescription, interests: duplicateInterests, picture,
        github, facebook, instagram };
      expect(function foo() { Clubs.define(defineObject3); }).to.throw(Error);
    });
  });
}
