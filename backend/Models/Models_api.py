from unicodedata import name
from marshmallow import Schema, fields

class Leaderboard(object):
    def __init__(self, user_id, rank, name, club, club_logo, points, username):
        self.user_id = user_id
        self.rank = rank
        self.name = name
        self.club = club
        self.club_logo = club_logo
        self.points = points
        self.username = username

class LeaderboardSchema(Schema):
    user_id = fields.Integer()
    rank = fields.Integer()
    name = fields.String()
    club = fields.String()
    club_logo = fields.String()
    points = fields.Integer()
    username = fields.String()


class Trivia(object):
    def __init__(self, question, answers, correct):
        self.question = question
        self.answers = answers
        self.correct = correct

class TriviaSchema(Schema):
    question = fields.String()
    answers = fields.List(fields.String())
    correct = fields.String()


class PersonalScore(object):
    def __init__(self, id, name, profile_pic, overall_rank, club_id, club_name,
                club_logo, club_rank, total_points, role, username, badges, age, email):
        self.id = id
        self.name = name
        self.profile_pic = profile_pic
        self.overall_rank = overall_rank
        self.club_id = club_id
        self.club_name = club_name
        self.club_logo = club_logo
        self.club_rank = club_rank
        self.total_points = total_points
        self.role = role
        self.username = username
        self.badges = badges
        self.age = age
        self.email = email

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


class LeaderboardClub(object):
    def __init__(self, club_id, club_name, club_logo, club_points, club_rank, top_supporter_name):
        self.club_id = club_id
        self.club_name = club_name
        self.club_logo = club_logo
        self.club_points = club_points
        self.club_rank = club_rank
        self.top_supporter_name = top_supporter_name

class LeaderboardClubSchema(Schema):
    club_id = fields.Integer()
    club_name = fields.String()
    club_logo = fields.String()
    club_points = fields.Integer()
    club_rank = fields.Integer()
    top_supporter_name = fields.String()



class Followlist(object):
    def __init__(self, id, name, profile_pic, total_points, overall_rank, club_id, club_name, club_rank, club_logo, badges, badge_count):
        self.id = id
        self.name = name
        self.profile_pic = profile_pic
        self.total_points = total_points
        self.overall_rank = overall_rank
        self.club_id = club_id
        self.club_name = club_name
        self.club_rank = club_rank
        self.club_logo = club_logo
        self.badges = badges
        self.badge_count = badge_count

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
    

class SupporterChallenge(object):
    def __init__(self, id, club_name, club_logo, supporter_count):
        self.id = id
        self.club_name = club_name
        self.club_logo = club_logo
        self.supporter_count = supporter_count


class SupporterChallengeSchema(Schema):
    id = fields.Integer()
    club_name = fields.String()
    club_logo = fields.String()
    supporter_count = fields.Integer()


class QuizLeaderboard(object):
    def __init__(self, id, participations, total_quiz_points, name, club_name, club_logo):
        self.id = id
        self.participations = participations
        self.total_quiz_points = total_quiz_points
        self.name = name
        self.club_name = club_name
        self.club_logo = club_logo


class QuizLeaderboardSchema(Schema):
    id = fields.Integer()
    participations = fields.Integer()
    total_quiz_points = fields.Integer()
    name = fields.String()
    club_name = fields.String()
    club_logo = fields.String()
        