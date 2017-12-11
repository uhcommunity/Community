import { Interests } from '/imports/api/interest/InterestCollection';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Clubs } from '/imports/api/club/ClubCollection';
import { Comments } from '/imports/api/comment/CommentCollection';

Interests.publish();
Profiles.publish();
Clubs.publish();
Comments.publish();
