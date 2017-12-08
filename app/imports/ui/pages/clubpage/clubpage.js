import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';
import { Clubs } from '/imports/api/club/ClubCollection';
import { Interests } from '/imports/api/interest/InterestCollection';

Template.ClubPage_Page.onCreated(function onCreated() {
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Clubs.getPublicationName());
});

Template.ClubPage_Page.helpers({
  club() {
    return Clubs.findDoc(Session.get('clubSelected'));
  }
});
