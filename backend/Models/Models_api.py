from marshmallow import Schema, fields

class Leaderboard(object):
    def __init__(self, user_id, rank, name, club, club_logo, points):
        self.user_id = user_id
        self.rank = rank
        self.name = name
        self.club = club
        self.club_logo = club_logo
        self.points = points

class LeaderboardSchema(Schema):
    user_id = fields.Integer()
    rank = fields.Integer()
    name = fields.String()
    club = fields.String()
    club_logo = fields.String()
    points = fields.Integer()


class Trivia(object):
    def __init__(self, question, answers, correct, points, answered):
        self.question = question
        self.answers = answers
        self.correct = correct
        self.points = points
        self.answeres = answered

class TriviaSchema(Schema):
    question = fields.String()
    answers = fields.List(fields.String())
    correct = fields.String()
    points = fields.Integer()
    answered = fields.Boolean()


class PersonalScore(object):
    def __init__(self, id, name, overall_score, club_name, club_logo, club_score):
        self.id = id
        self.name = name
        self.overall_score = overall_score
        self.club_name = club_name
        self.club_logo = club_logo
        self.club_score = club_score

class PersonalScoreSchema(Schema):
    id = fields.Integer()
    name = fields.String()
    overall_score = fields.Integer()
    club_name = fields.String()
    club_logo = fields.String()
    club_score = fields.String()
