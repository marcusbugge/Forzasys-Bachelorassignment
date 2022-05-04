from marshmallow import Schema, fields


class LeaderboardSchema(Schema):
    user_id = fields.Integer()
    rank = fields.Integer()
    name = fields.String()
    club = fields.String()
    club_logo = fields.String()
    points = fields.Integer()
    username = fields.String()


class TriviaSchema(Schema):
    question = fields.String()
    answers = fields.List(fields.String())
    correct = fields.String()


class PersonalScoreSchema(Schema):
    id = fields.Integer()
    name = fields.String()
    profile_pic = fields.String()
    overall_rank = fields.Integer()
    club_id = fields.Integer()
    club_name = fields.String()
    club_logo = fields.String()
    club_rank = fields.Integer()
    total_points = fields.Integer()
    role = fields.String()
    username = fields.String()
    badges = fields.List(fields.String())
    age = fields.Integer()
    email = fields.String()
    videos = fields.List(fields.String())


class LeaderboardClubSchema(Schema):
    club_id = fields.Integer()
    club_name = fields.String()
    club_logo = fields.String()
    club_points = fields.Integer()
    club_rank = fields.Integer()
    top_supporter_name = fields.String()
    username = fields.String()


class FollowlistSchema(Schema):
    id = fields.Integer()
    name = fields.String()
    profile_pic = fields.String()
    total_points = fields.Integer()
    overall_rank = fields.Integer()
    club_id = fields.Integer()
    club_name = fields.String()
    club_rank = fields.Integer()
    club_logo = fields.String()
    badges = fields.List(fields.String())
    badge_count = fields.Integer()
    username = fields.String()
  

class SupporterChallengeSchema(Schema):
    id = fields.Integer()
    club_name = fields.String()
    club_logo = fields.String()
    supporter_count = fields.Integer()


class QuizLeaderboardSchema(Schema):
    id = fields.Integer()
    participations = fields.Integer()
    total_quiz_points = fields.Integer()
    name = fields.String()
    club_name = fields.String()
    club_logo = fields.String()
    username = fields.String()
    