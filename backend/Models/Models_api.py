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


class PersonalScore(object):
    def __init__(self, id, name, overall_rank, club_id, club_name, club_logo, club_rank, total_points):
        self.id = id
        self.name = name
        self.overall_rank = overall_rank
        self.club_id = club_id
        self.club_name = club_name
        self.club_logo = club_logo
        self.club_rank = club_rank
        self.total_points = total_points

class PersonalScoreSchema(Schema):
    id = fields.Integer()
    name = fields.String()
    overall_rank = fields.Integer()
    club_id = fields.Integer()
    club_name = fields.String()
    club_logo = fields.String()
    club_rank = fields.Integer()
    total_points = fields.Integer()


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

