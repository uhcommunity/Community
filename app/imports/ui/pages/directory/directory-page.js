import { Template } from 'meteor/templating';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Clubs } from '/imports/api/club/ClubCollection';

Template.Directory_Page.onCreated(function onCreated() {
  this.subscribe(Profiles.getPublicationName());
  this.subscribe(Clubs.getPublicationName());
});

Template.Directory_Page.helpers({
  clubs() {
    return Clubs.find({}, { sort: { clubName: 1}});
  },
  profiles() {
    return Profiles.find({}, { sort: { lastName: 1 } });
  },
});
