from marshmallow import Schema, fields
from xml.dom import ValidationErr
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


class FollowerSchema(Schema):
    id = fields.Integer()


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    password = db.Column(db.String(40), nullable=False)
    given_name = db.Column(db.String(50), nullable=False)
    family_name = db.Column(db.String(50), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    email = db.Column(db.String(50), nullable=False)
    total_points = db.Column(db.Integer, nullable=False)
    team_id = db.Column(db.Integer, db.ForeignKey('team.id'), nullable=False)

    #https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-viii-followers
    followed = db.relationship(
        'User', secondary=followers,
        primaryjoin=(followers.c.follower_id == id),
        secondaryjoin=(followers.c.followed_id == id),
        backref=db.backref('followers', lazy='dynamic'), lazy='dynamic')

    videos = db.relationship('Video', backref=db.backref(
        'user', lazy='joined'), lazy='select')
    badges = db.relationship(
        'Badge', secondary=earned_badges, backref='database', lazy='select')

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

    def follow(self, user):
        if not self.is_following(user):
            self.followed.append(user)
            db.session.commit()

    def unfollow(self, user):
        if self.is_following(user):
            self.followed.remove(user)
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
    age = fields.Integer()
    email = fields.String()
    team_id = fields.Integer()
    total_points = fields.Integer()
    followed = fields.List(fields.String())
    videos = fields.List(fields.String())
    badges = fields.List(fields.String())


class Team(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30), nullable=False)
    nationality = db.Column(db.String(25), nullable=False)
    logo = db.Column(db.String(250), nullable=False)
    supporters = db.relationship('User', backref=db.backref(
        'database', lazy='joined'), lazy='select')

    def __repr__(self):
        return f'Team(name={self.name}, nationality={self.nationality} logo={self.logo})'

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


class TeamSchema(Schema):
    id = fields.Integer()
    name = fields.String()
    nationality = fields.String()
    logo = fields.String()
    supporters = fields.List(fields.String())



class Video(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    video = db.Column(db.String(500), nullable=False)
    caption = db.Column(db.String(50))
    likes = db.Column(db.Integer)
    views = db.Column(db.Integer)
    comments = db.relationship('Comment', backref=db.backref(
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


class BytesField(fields.Field):
    def _validate(self, value):
        if not isinstance(value, bytes):
            raise ValidationErr('Invalid input type.')

        if value is None or value == b'':
            raise ValidationErr('Invalid value')


class VideoSchema(Schema):
    id = fields.Integer()
    user_id = fields.String()
    video = fields.String()
    #video = BytesField(required=True)
    caption = fields.String()
    views = fields.Integer()
    likes = fields.Integer()
    comments = fields.List(fields.String())



class Badge(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), nullable=False)
    description = db.Column(db.String(150), nullable=False)
    level = db.Column(db.String(10), nullable=False)
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
    level = fields.String()
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
    answers = db.relationship('Answer', backref=db.backref(
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

class Answer(db.Model):
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

    def answer(self, comment):
        self.comments.append(comment)
        db.session.commit()

    def delete_answers(self, comment):
        self.comments.remove(comment)
        db.session.commit()

class AnswerSchema(Schema):
    id = fields.Integer()
    user_id = fields.Integer()
    comment_id = fields.Integer()
    content = fields.String()
    upvotes = fields.Integer()
    downvotes = fields.Integer()