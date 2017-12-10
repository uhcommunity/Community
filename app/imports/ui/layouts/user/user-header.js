import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Session } from 'meteor/session';
import { Profiles } from '/imports/api/profile/ProfileCollection';


let user;
let club;

Template.User_Header.onCreated(function onCreated() {
  this.subscribe(Profiles.getPublicationName());
  this.getProfile = function(name) {
    return Profiles._collection.findOne({username: name});
  }
  this.username = FlowRouter.getParam('username');
});

Template.User_Header.helpers({
  routeUserName() {
    user = FlowRouter.getParam('username');
    return user;
  },
  getImage() {
    if (!Template.instance().getProfile(Template.instance().username)) {
      return 'https://semantic-ui.com/images/avatar2/large/matthew.png';
    } else {
      return Template.instance().getProfile(Template.instance().username).picture;
    }
  }
});

Template.User_Header.events({
  'keyup .input-text'(event, instance) {
    const input = event.target.value;
    FlowRouter.go("/"+user+"/filter");
    Session.set('clubSearched', input);
  },
});
