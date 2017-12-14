import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveDict } from 'meteor/reactive-dict';
import { _ } from 'meteor/underscore';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
import { Clubs } from '/imports/api/club/ClubCollection';
import { Comments } from '/imports/api/comment/CommentCollection';
import { Session } from 'meteor/session';

Template.ProfilePage_Page.onCreated(function onCreated() {
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Profiles.getPublicationName());
  this.subscribe(Clubs.getPublicationName());
  this.subscribe(Comments.getPublicationName());
});

Template.ProfilePage_Page.helpers({
  profile() {
    const profile = Profiles.findDoc(FlowRouter.getParam('profileId'));
    if (!profile.image) {
      profile.image = 'https://semantic-ui.com/images/avatar2/large/matthew.png';
    }
    return profile;
  },
  comments() {
    const comments = Comments.findAll({ author: FlowRouter.getParam('profileId') });
    return comments;
  },
  getClub(clubId) {
    const club = Clubs.findDoc(clubId);
    return club;
  },
});

Template.ProfilePage_Page.events({

});
