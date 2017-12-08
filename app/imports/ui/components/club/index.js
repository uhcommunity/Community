import './club.html';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';
import { Clubs } from '/imports/api/club/ClubCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
import { Comments } from '/imports/api/comment/CommentCollection';
import { Profiles } from '/imports/api/profile/ProfileCollection';

Template.Club.onCreated(function onCreated() {
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Clubs.getPublicationName());
  this.subscribe(Comments.getPublicationName());
  this.subscribe(Profiles.getPublicationName());
  this.getProfile = function(name) {
    console.log(name);
    console.log(Profiles._collection.findOne({username: name}));
    return Profiles._collection.findOne({username: name});
  }
  this.getImage = function (profile) {
    if (!profile.picture) {
      return 'https://semantic-ui.com/images/avatar2/large/matthew.png';
    } else {
      return profile.picture;
    }
  }
});

Template.Club.helpers({
  comments() {
    const comments = Comments.findAll();
    console.log(comments);
    return _.filter(comments, {'clubId': FlowRouter.getParam('clubid')});
  }
});

Template.Club.events({
  'submit .reply'(event, instance) {
    event.preventDefault();
    const clubId = FlowRouter.getParam('clubid');
    const author = FlowRouter.getParam('username');
    const text = event.target[0].value;
    const picture = Template.instance().getImage(Template.instance().getProfile(author));
    const date = new Date().toString();

    const insertCommentData = { clubId, author, text, date, picture };

    Comments.insertOne(insertCommentData);
  }
});
