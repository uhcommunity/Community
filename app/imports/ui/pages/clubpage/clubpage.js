import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';
import { Clubs } from '/imports/api/club/ClubCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
import { Comments } from '/imports/api/comment/CommentCollection';
import { Profiles } from '/imports/api/profile/ProfileCollection';


Template.ClubPage_Page.onCreated(function onCreated() {
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Clubs.getPublicationName());
  this.subscribe(Comments.getPublicationName());
  this.subscribe(Profiles.getPublicationName());
  this.context = Comments.getSchema().namedContext('ClubPage_Page');
  this.getProfile = function(name) {
    return Profiles._collection.findOne({username: name});
  }
  this.getImage = function (profile) {
    if (!profile.picture) {
      return 'https://semantic-ui.com/images/avatar2/large/matthew.png';
    } else {
      return profile.picture;
    }
  }
  this.getComments = function (clubId) {
    return Comments._collection.find({clubId: clubId}).fetch();
  }
});

Template.ClubPage_Page.helpers({
  club() {
    return Clubs.findDoc(Session.get('clubSelected'));
  },
  comments() {
    console.log('COMMENTS!!!');
    const comments = Template.instance().getComments(FlowRouter.getParam('clubid'));
    console.log(comments);
    return comments;
  }

});

Template.ClubPage_Page.events({
  'submit .reply'(event, instance) {
    event.preventDefault();
    const clubId = FlowRouter.getParam('clubid');
    const author = FlowRouter.getParam('username');
    const text = event.target[0].value;
    const picture = Template.instance().getImage(Template.instance().getProfile(author));
    const date = new Date().toString();

    const insertCommentData = { clubId, author, text, date, picture };

    // Clear out any old validation errors.
    instance.context.reset();
    // Invoke clean so that updatedProfileData reflects what will be inserted.
    const cleanData = Comments.getSchema().clean(insertCommentData);
    // Determine validity.
    instance.context.validate(cleanData);

    if (instance.context.isValid()) {
      Comments.insertOne(insertCommentData);
    }

  }
});
