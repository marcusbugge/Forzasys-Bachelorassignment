from db import db
from models.Joined_tables import followers, saved_videos, earned_badges
from models.BadgeModel import Badge

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    given_name = db.Column(db.String(50), nullable=False)
    family_name = db.Column(db.String(50), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    email = db.Column(db.String(50), unique=True, nullable=False)
    username = db.Column(db.String(20), unique=True, nullable=False)
    password = db.Column(db.String(40), nullable=False)
    total_points = db.Column(db.Integer, nullable=False)
    club_id = db.Column(db.Integer, db.ForeignKey('club.id'), nullable=False)
    profile_pic = db.Column(db.String(30), nullable=False, default='default-profilepic.png')
    role = db.Column(db.String(10), nullable=False)

    #attribute for other users one instance of userobject is following
    #https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-viii-followers
    followed = db.relationship(
        'User', secondary=followers,
        primaryjoin=(followers.c.follower_id == id),
        secondaryjoin=(followers.c.followed_id == id),
        backref=db.backref('followers', lazy='dynamic'), lazy='dynamic')

    #attribute for videos an instance of userobject has liked
    videos = db.relationship(
        'Video', secondary=saved_videos, backref='database', lazy='select')
    
    #attribute for badges earned by an instance of userobject
    badges = db.relationship(
        'Badge', secondary=earned_badges, backref='database', lazy='select')


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