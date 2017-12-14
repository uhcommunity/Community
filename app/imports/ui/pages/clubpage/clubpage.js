import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';
import { Clubs } from '/imports/api/club/ClubCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
import { Comments } from '/imports/api/comment/CommentCollection';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { $ } from 'meteor/jquery';


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
  Session.set('selectedPage', 1);
});

Template.ClubPage_Page.helpers({
  selectedPage() {
    return Session.get('selectedPage');
  },
  club() {
    const club = Clubs.findDoc(Session.get('clubSelected'));
    return club;
  },
  clubLiked() {
    const clubId = FlowRouter.getParam('clubid');
    const profile = Profiles.findDoc(FlowRouter.getParam('username'));
    // const club = Clubs.findDoc(clubId);
    if (profile.clubsLiked) {
      if (profile.clubsLiked.indexOf(clubId) > -1) {
        Session.set('clubLiked', true);
        return 'active';
      }
    }
    Session.set('clubLiked', false);
    return false;
  },
  comments(pageNum) {
    const comments = Template.instance().getComments(FlowRouter.getParam('clubid'));
    const selected = [];
    for (let i = (pageNum - 1) * 5; i < (pageNum * 5); i++) {
      if (comments[i] && comments[i].author == FlowRouter.getParam('username')) comments[i].owner = true;
      if (comments[i]) selected.push(comments[i]);
    }
    return selected;
  },
  pages() {
    const comments = Template.instance().getComments(FlowRouter.getParam('clubid'));
    const arr = [1];
    for (let i = 1; i < comments.length; i++) {
      if (i % 5 == 0) arr.push(arr[arr.length - 1] + 1);
    }
    if (arr.length == 1) return;
    return arr;
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
  },
  'click .paginate'(event, instance) {
    event.preventDefault();
    const paginates = $('.paginate');
    for (let item of paginates) {
      $(item).removeClass('active');
    }
    const item = $(event.target);
    item.addClass('active');
    const text = event.target.text;
    Session.set('selectedPage', parseInt(text));
  },
  'click .remove'(event, instance) {
    event.preventDefault();
    const target = $(event.target);
    Comments.removeIt(target.data().commentid);
    Session.set('selectedPage', 1);
    const paginates = $('.paginate');
    for (let item of paginates) {
      $(item).removeClass('active');
    }
    $(paginates[0]).addClass('active');
  },
  'click .floated.like'(event, instance) {
    if (!Session.get('clubLiked')) {
      const clubId = FlowRouter.getParam('clubid');
      const profile = Profiles.findDoc(FlowRouter.getParam('username'));
      if (!profile.clubsLiked) {
        Profiles.update({_id: profile._id}, {$set: {clubsLiked: []}});
        Profiles.update({_id: profile._id}, {$push: {clubsLiked: clubId}});
        const club = Clubs.findDoc(clubId);
        if (!club.likes) {
          Clubs.update({_id: club._id}, {$set: {likes: 1}});
        } else {
          Clubs.update({_id: club._id}, {$set: {likes: club.likes + 1}});
        }
      } else {
        if (!(profile.clubsLiked.indexOf(clubId) > -1)) {
          Profiles.update({_id: profile._id}, {$push: {clubsLiked: clubId}});
          const club = Clubs.findDoc(clubId);
          if (!club.likes) {
            Clubs.update({_id: club._id}, {$set: {likes: 1}});
          } else {
            Clubs.update({_id: club._id}, {$set: {likes: club.likes + 1}});
          }
        }
      }
      Session.set('clubLiked', true);
    } else {
      const clubId = FlowRouter.getParam('clubid');
      const profile = Profiles.findDoc(FlowRouter.getParam('username'));
      const club = Clubs.findDoc(clubId);
      Profiles.update({_id: profile._id},{$pull: {clubsLiked: clubId}});
      Clubs.update({_id: club._id}, {$set: {likes: club.likes - 1}});
      Session.set('clubLiked', false);
    }
  },
  'click .author'(event, instance) {
    const user = FlowRouter.getParam('username');
    FlowRouter.go("/"+ user + "/profile/" + event.currentTarget.text);
  }
});
