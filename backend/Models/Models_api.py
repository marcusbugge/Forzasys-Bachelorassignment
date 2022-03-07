from marshmallow import Schema, fields

class Leaderboard():
    def __init__(self, user_id, rank, name, club, points):
        self.user_id = user_id
        self.rank = rank
        self.name = name
        self.club = club
        self.points = points

class LeaderboardSchema(Schema):
    user_id = fields.Integer()
    rank = fields.Integer()
    name = fields.String()
    club = fields.String()
    points = fields.Integer()


class Trivia():
    def __init__(self, question, answers, correct):
        self.question = question
        self.answers = answers
        self.correct = correct

class TriviaSchema(Schema):
    question = fields.String()
    answers = fields.List(fields.String())
    correct = fields.String()