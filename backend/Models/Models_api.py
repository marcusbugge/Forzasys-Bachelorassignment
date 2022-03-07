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
    def __init__(self, question, answers, correct, points):
        self.question = question
        self.answers = answers
        self.correct = correct
        self.points = points

class TriviaSchema(Schema):
    question = fields.String()
    answers = fields.List(fields.String())
    correct = fields.String()
    points = fields.Integer()