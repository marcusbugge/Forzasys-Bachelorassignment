from marshmallow import Schema, fields

class UserSchema(Schema):
    id = fields.Integer()
    password = fields.String()
    given_name = fields.String()
    family_name = fields.String()
    profile_pic = fields.String()
    age = fields.String()
    email = fields.String()
    club_id = fields.Integer()
    total_points = fields.Integer()
    followed = fields.List(fields.String())
    videos = fields.List(fields.String())
    badges = fields.List(fields.String())
    role = fields.String()
    username = fields.String()


class ClubSchema(Schema):
    id = fields.Integer()
    name = fields.String()
    nationality = fields.String()
    logo = fields.String()
    supporters = fields.List(fields.String())



class VideoSchema(Schema):
    id = fields.Integer()
    video_url = fields.String()
    video_thumbnail = fields.String()
    video_description = fields.String()
    video_description = fields.String()


class BadgeSchema(Schema):
    id = fields.Integer()
    name = fields.String()
    description = fields.String()
    level = fields.Integer()
    picture = fields.String()
    category = fields.String()
    points_needed = fields.String()

class QuestionSchema(Schema):
    id = fields.Integer()
    question = fields.String()
    answers = fields.List(fields.String())


class AnswerSchema(Schema):
    id = fields.Integer()
    question_id = fields.Integer()
    content = fields.String()
    correct = fields.Boolean()


class SubmittedQuizSchema(Schema):
    id = fields.Integer()
    user_id = fields.Integer()
    submitted_time = fields.Date()
    questions = fields.Integer()
    correct = fields.Integer()
    points = fields.Integer()
