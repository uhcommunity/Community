import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Session } from 'meteor/session'

let user;

Template.User_Header.helpers({
  routeUserName() {
    user = FlowRouter.getParam('username');
    return user;
  },
});

Template.User_Header.events({
  'keyup .input-text'(event, instance) {
    const input = event.target.value;
    if(event.keyCode === 13)
    {
      FlowRouter.go("/"+user+"/filter");
      Session.set('clubSearched', input);
      console.log(Session.get('clubSearched'));
    }
  },
});