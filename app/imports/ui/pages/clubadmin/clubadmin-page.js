import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';
import { Clubs } from '/imports/api/club/ClubCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
import { Comments } from '/imports/api/comment/CommentCollection';
import { Session } from 'meteor/session';

const displaySuccessMessage = 'displaySuccessMessage';
const displayErrorMessages = 'displayErrorMessages';

Template.ClubAdmin_Page.onCreated(function onCreated() {
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Clubs.getPublicationName());
  this.subscribe(Comments.getPublicationName());
  this.messageFlags = new ReactiveDict();
  this.messageFlags.set(displaySuccessMessage, false);
  this.messageFlags.set(displayErrorMessages, false);
  this.context = Clubs.getSchema().namedContext('ClubAdmin_Page');
  Session.set('currentView', 'club');
});

Template.ClubAdmin_Page.helpers({
  successClass() {
    return Template.instance().messageFlags.get(displaySuccessMessage) ? 'success' : '';
  },
  displaySuccessMessage() {
    return Template.instance().messageFlags.get(displaySuccessMessage);
  },
  errorClass() {
    return Template.instance().messageFlags.get(displayErrorMessages) ? 'error' : '';
  },
  club() {
    return Clubs.findDoc(FlowRouter.getParam('username'));
  },
  interests() {
    const club = Clubs.findDoc(FlowRouter.getParam('username'));
    const selectedInterests = club.interests;
    return club && _.map(Interests.findAll(),
        function makeInterestObject(interest) {
          return { label: interest.name, selected: _.contains(selectedInterests, interest.name) };
        });
  },
  currentView(text) {
    if (Session.get('currentView') === text) {
      return 'active';
    }
    return false;
  },
  comments(text) {
    const club = Clubs.findDoc(FlowRouter.getParam('username'));
    const comments = Comments.find({ id: club._id });
    comments.forEach((e) => e.owner = true);
    if (text === 'length') return comments.length;
    return comments;
  },
});

Template.ClubAdmin_Page.events({
  'submit .clubadmin-data-form'(event, instance) {
    event.preventDefault();
    console.log(event.target);
    const clubName = event.target.Name.value;
    const username = FlowRouter.getParam('username'); // schema requires username.
    const picture = event.target.Picture.value;
    const twitter = event.target.Twitter.value;
    const facebook = event.target.Facebook.value;
    const instagram = event.target.Instagram.value;
    const clubDescription = event.target.Description.value;
    const selectedInterests = _.filter(event.target.Interests.selectedOptions, (option) => option.selected);
    const interests = _.map(selectedInterests, (option) => option.value);

    const updatedClubData = { clubName, picture, twitter, facebook, instagram, clubDescription, interests,
      username };

    // Clear out any old validation errors.
    instance.context.reset();
    // Invoke clean so that updatedProfileData reflects what will be inserted.
    const cleanData = Clubs.getSchema().clean(updatedClubData);
    // Determine validity.
    instance.context.validate(cleanData);

    if (instance.context.isValid()) {
      const docID = Clubs.findDoc(FlowRouter.getParam('username'))._id;
      const id = Clubs.update(docID, { $set: cleanData });
      instance.messageFlags.set(displaySuccessMessage, id);
      instance.messageFlags.set(displayErrorMessages, false);
    } else {
      instance.messageFlags.set(displaySuccessMessage, false);
      instance.messageFlags.set(displayErrorMessages, true);
    }
  },
  'click .change'(event, instance) {
    event.preventDefault();
    Session.set('currentView', event.target.id);
  },
  'click .remove'(event, instance) {
    event.preventDefault();
    const target = $(event.target);
    Comments.removeIt(target.data().commentid);
  },
  'click .profileId'(event, instance) {
    const user = FlowRouter.getParam('username');
    FlowRouter.go("/"+ user + "/profile/" + event.currentTarget.text);
  }
});
