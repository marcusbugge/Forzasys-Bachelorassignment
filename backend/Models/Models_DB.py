from marshmallow import Schema, fields
from db import db

earned_badges = db.Table('earned_badges',
                         db.Column('user_id', db.Integer, db.ForeignKey('user.id')),
                         db.Column('badge_id', db.Integer, db.ForeignKey('badge.id'))
                         )

followers = db.Table('followers',
                     db.Column('follower_id', db.Integer,
                               db.ForeignKey('user.id')),
                     db.Column('followed_id', db.Integer,
                               db.ForeignKey('user.id'))
                     )
            
saved_videos = db.Table('liked_videos',
                        db.Column('user_id', db.Integer, db.ForeignKey('user.id')),
                        db.Column('video_id', db.Integer, db.ForeignKey('video.id'))
                        )


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    password = db.Column(db.String(40), nullable=False)
    given_name = db.Column(db.String(50), nullable=False)
    family_name = db.Column(db.String(50), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    email = db.Column(db.String(50), unique=True, nullable=False)
    total_points = db.Column(db.Integer, nullable=False)
    club_id = db.Column(db.Integer, db.ForeignKey('club.id'), nullable=False)
    profile_pic = db.Column(db.String(30), nullable=False, default='default-profilepic.png')

    #https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-viii-followers
    followed = db.relationship(
        'User', secondary=followers,
        primaryjoin=(followers.c.follower_id == id),
        secondaryjoin=(followers.c.followed_id == id),
        backref=db.backref('followers', lazy='dynamic'), lazy='dynamic')

    videos = db.relationship(
        'Video', secondary=saved_videos, backref='database', lazy='select')
    badges = db.relationship(
        'Badge', secondary=earned_badges, backref='database', lazy='select')
    role = db.Column(db.String(10), nullable=False)
    username = db.Column(db.String(20), unique=True, nullable=False)

    def __repr__(self):
        return f'id={self.id}, score={self.total_points}'

    @classmethod
    def get_all(cls):
        return cls.query.all()

    @classmethod
    def get_by_id(cls, id):
        return cls.query.get_or_404(id)

    def save(self):
        self.badges.append(Badge.get_by_id(1))
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()
    
    def give_points(self, points):
        self.total_points += points
        db.session.commit()

    def follow(self, user_id):
        user_to_follow = User.get_by_id(user_id)
        if not self.is_following(user_to_follow):
            self.followed.append(user_to_follow)
            db.session.commit()

    def unfollow(self, user):
        if self.is_following(user):
            self.followed.remove(user)
            db.session.commit()

    def add_badge(self, badge_id, category):
        new_badge = Badge.get_by_id(badge_id)
        new_category = True
        for badge in self.badges:
            if badge.category == category:
                new_category = False
                if badge.level < new_badge.level:
                    self.badges.remove(badge)
                    self.badges.append(new_badge)
        if new_category:
            self.badges.append(new_badge)
        
        db.session.commit()

    def like_video(self, video):
        self.videos.append(video)
        db.session.commit()

    def is_following(self, user):
        return self.followed.filter(
            followers.c.followed_id == user.id).count() > 0

    def is_authenticated(self, email, password):
        if email.lower() == self.email.lower() and password == self.password:
            return True
        return False


class UserSchema(Schema):
    id = fields.Integer()
    password = fields.String()
    given_name = fields.String()
    family_name = fields.String()
    profile_pic = fields.String()
    age = fields.Integer()
    email = fields.String()
    club_id = fields.Integer()
    total_points = fields.Integer()
    followed = fields.List(fields.String())
    saved_videos = fields.List(fields.String())
    badges = fields.List(fields.String())
    role = fields.String()
    username = fields.String()


class Club(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30), nullable=False)
    nationality = db.Column(db.String(25), nullable=False)
    logo = db.Column(db.String(250), nullable=False)
    supporters = db.relationship('User', backref=db.backref(
        'database', lazy='joined'), lazy='select')

    def __repr__(self):
        return f'Club(name={self.name}, nationality={self.nationality} logo={self.logo})'

    @classmethod
    def get_all(cls):
        return cls.query.all()

    @classmethod
    def get_by_id(cls, id):
        return cls.query.get_or_404(id)

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()


class ClubSchema(Schema):
    id = fields.Integer()
    name = fields.String()
    nationality = fields.String()
    logo = fields.String()
    supporters = fields.List(fields.String())


class Video(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    video = db.Column(db.String(500), nullable=False, unique=True)

    def __repr__(self):
        return f'{self.id}'

    @classmethod
    def get_all(cls):
        return cls.query.all()

    @classmethod
    def get_by_id(cls, id):
        return cls.query.get_or_404(id)

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()



class VideoSchema(Schema):
    id = fields.Integer()
    video = fields.String()


class Badge(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    description = db.Column(db.String(150), nullable=False)
    level = db.Column(db.Integer, nullable=False)
    picture = db.Column(db.String(250), unique=True, nullable=False)
    category = db.Column(db.String(15), nullable=False)
    points_needed = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return f'{self.id}'

    @classmethod
    def get_all(cls):
        return cls.query.all()

    @classmethod
    def get_by_id(cls, id):
        return cls.query.get_or_404(id)

    @classmethod
    def get_badge_by_category(cls, category):
        return cls.query.filter_by(category=category).all()

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()


class BadgeSchema(Schema):
    id = fields.Integer()
    name = fields.String()
    description = fields.String()
    level = fields.Integer()
    picture = fields.String()
    category = fields.String()
    points_needed = fields.String()


class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    video_id = db.Column(db.Integer, db.ForeignKey('video.id'), nullable=False)
    content = db.Column(db.String(150), nullable=False)
    upvotes = db.Column(db.Integer)
    downvotes = db.Column(db.Integer)
    reply = db.relationship('Reply', backref=db.backref(
        'database', lazy='joined'), lazy='select')

    def __repr__(self):
        return f'{self.id}'

    @classmethod
    def get_all(cls):
        return cls.query.all()

    @classmethod
    def get_by_id(cls, id):
        return cls.query.get_or_404(id)

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def comment(self, comment):
        self.comments.append(comment)
        db.session.commit()

    def delete_comment(self, comment):
        self.comments.remove(comment)
        db.session.commit()

class CommentSchema(Schema):
    id = fields.Integer()
    user_id = fields.Integer()
    video_id = fields.String()
    content = fields.String()
    upvotes = fields.Integer()
    downvotes = fields.Integer()
    answers = fields.List(fields.String())

class Reply(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    comment_id = db.Column(db.Integer, db.ForeignKey('comment.id'), nullable=False)
    content = db.Column(db.String(150), nullable=False)
    upvotes = db.Column(db.Integer)
    downvotes = db.Column(db.Integer)

    def __repr__(self):
        return f'{self.id}'

    @classmethod
    def get_all(cls):
        return cls.query.all()

    @classmethod
    def get_by_id(cls, id):
        return cls.query.get_or_404(id)

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def reply(self, comment):
        self.comments.append(comment)
        db.session.commit()

    def delete_answers(self, comment):
        self.comments.remove(comment)
        db.session.commit()

class ReplySchema(Schema):
    id = fields.Integer()
    user_id = fields.Integer()
    comment_id = fields.Integer()
    content = fields.String()
    upvotes = fields.Integer()
    downvotes = fields.Integer()


class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    question = db.Column(db.String(150), unique=True, nullable=False)
    answers = db.relationship('Answer', backref=db.backref(
        'database', lazy='joined'), lazy='select')

    def __repr__(self):
        return f'Question=(id = {self.id}, question={self.question}, answers={self.answers})'

    @classmethod
    def get_all(cls):
        return cls.query.all()

    @classmethod
    def get_by_id(cls, id):
        return cls.query.get_or_404(id)

    def save(self):
        db.session.add(self)
        for answer in self.answers:
            answer.save()
        db.session.commit()

    def delete(self):
        for answer in self.answers:
            answer.delete()
        db.session.delete(self)
        db.session.commit()

    def add_answer(self, answer):
        self.answers.append(answer)
        db.session.commit()

    def delete_question(self, answer):
        self.answers.remove(answer)
        db.session.commit()

class QuestionSchema(Schema):
    id = fields.Integer()
    question = fields.String()
    answers = fields.List(fields.String())

class Answer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    question_id = db.Column(db.Integer, db.ForeignKey('question.id'), nullable=False)
    content = db.Column(db.String, nullable=False)
    correct = db.Column(db.Boolean, nullable=False)

    def __repr__(self):
        return f'{self.content}, {self.correct}'
    
    @classmethod
    def get_all(cls):
        return cls.query.all()

    @classmethod
    def get_by_id(cls, id):
        return cls.query.get_or_404(id)

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()
    
class AnswerSchema(Schema):
    id = fields.Integer()
    question_id = fields.Integer()
    content = fields.String()
    correct = fields.Boolean()


class SubmittedQuiz(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    submitted_time = db.Column(db.DateTime)
    questions = db.Column(db.Integer, nullable=False)
    correct = db.Column(db.Integer, nullable=False)
    points = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return f'{self.correct}'

    @classmethod
    def get_all(cls):
        return cls.query.all()

    @classmethod
    def get_by_user(cls, user_id):
        return cls.query.filter_by(user_id=user_id).all()

    def save(self):
        db.session.add(self)
        db.session.commit()

class SubmittedQuizSchema(Schema):
    id = fields.Integer()
    user_id = fields.Integer()
    submitted_time = fields.Date()
    questions = fields.Integer()
    correct = fields.Integer()
    points = fields.Integer()
