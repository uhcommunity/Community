import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
import {Clubs } from '/imports/api/club/ClubCollection';

export function removeAllEntities() {
  Profiles.removeAll();
  Interests.removeAll();
  Clubs.removeAll();
}
