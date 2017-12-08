import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
import {Clubs } from '/imports/api/club/ClubCollection';
import {Comments } from '/imports/api/comment/CommentCollection';

export function removeAllEntities() {
  Profiles.removeAll();
  Interests.removeAll();
  Clubs.removeAll();
  Comments.removeAll();
}
