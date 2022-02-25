from xml.dom import ValidationErr
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api
from sqlalchemy import Integer, String, ForeignKey, Text
from marshmallow import Schema, fields
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask_cors import CORS
from werkzeug.utils import secure_filename
from PIL import Image
from args import user_put_args, video_put_args, badge_put_args, team_put_args

# https://medium.com/@ns2586/sqlalchemys-relationship-and-lazy-parameter-4a553257d9ef

app = Flask(__name__)
api = Api(app)
CORS(app)
#app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:123456@localhost/database'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///buggeDB.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)


# -----------------------------------------START OF MODELS ----------------------------------
earned_badges = db.Table('earned_badges',
                         db.Column('user_id', Integer, ForeignKey('user.id')),
                         db.Column('badge_id', Integer, ForeignKey('badge.id'))
                         )

followers = db.Table('followers',
                     db.Column('follower_id', db.Integer,
                               db.ForeignKey('user.id')),
                     db.Column('followed_id', db.Integer,
                               db.ForeignKey('user.id'))
                     )


class FollowerSchema(Schema):
    id = fields.Integer()


class User(UserMixin, db.Model):
    id = db.Column(Integer, primary_key=True)
    password = db.Column(String(40), nullable=False)
    given_name = db.Column(String(50), nullable=False)
    family_name = db.Column(String(50), nullable=False)
    age = db.Column(Integer, nullable=False)
    email = db.Column(String(50), nullable=False)
    team_id = db.Column(Integer, ForeignKey('team.id'), nullable=False)

    # https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-viii-followers
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

    def is_authenticated(self, username, password):
        users = User.get_all()
        for user in users:
            if username.lower() == user.username.lower() and password == user.password:
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
    followed = fields.List(fields.String())
    videos = fields.List(fields.String())
    badges = fields.List(fields.String())


class Team(db.Model):
    id = db.Column(Integer, primary_key=True)
    name = db.Column(String(30), nullable=False)
    nationality = db.Column(String(25), nullable=False)
    logo = db.Column(String(250), nullable=False)
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
    id = db.Column(Integer, primary_key=True)
    user_id = db.Column(Integer, ForeignKey('user.id'), nullable=False)
    video = db.Column(String(500), nullable=False)
    caption = db.Column(String(50))
    likes = db.Column(Integer)
    views = db.Column(Integer)

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


class Badge(db.Model):
    id = db.Column(Integer, primary_key=True)
    name = db.Column(String(20), nullable=False)
    description = db.Column(String(150), nullable=False)
    level = db.Column(String(10), nullable=False)
    picture = db.Column(String(250), unique=True, nullable=False)
    category = db.Column(String(15), nullable=False)
    points_needed = db.Column(Integer, nullable=False)

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

# --------------------------------------- END OF MODELS ----------------------------------


@login_manager.user_loader
def load_user(id):
    return User.get_by_id(id)


@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.args
        user_to_login = User.is_authenticated(
            data['username'], data['password'])
        login_user(user_to_login)
        return jsonify({
            'message': 'Logging in...'
        }), 200
    except:
        return jsonify({
            'error': 'Wrong username and/ or password'
        }), 404


@app.route('/api/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({
        'message': 'Logging out...'
    }), 200


@app.route('/api/loggedInUser', methods=['GET'])
@login_required
def loggedInUser():
    serializer = UserSchema()
    result = serializer.dump(current_user)

    return jsonify(result), 200


@app.route('/api/users', methods=['GET'])
def get_all_users():
    users = User.get_all()
    serializer = UserSchema(many=True)
    result = serializer.dump(users)
    return jsonify(result), 200


@app.route('/api/user', methods=['POST'])
def create_user():
    data = request.json
    newUser = User(
        password=data['password'],
        given_name=data['given_name'],
        family_name=data['family_name'],
        age=data['age'],
        email=data['email'],
        team_id=data['team_id']
    )

    newUser.save()

    serializer = UserSchema()
    result = serializer.dump(newUser)

    return jsonify(result), 201


@app.route('/api/user/<int:id>', methods=['GET'])
def get_user(id):
    user = User.get_by_id(id)
    serializer = UserSchema()
    result = serializer.dump(user)

    return jsonify(result), 200


@app.route('/api/user/<int:id>', methods=['PUT'])
def update_user(id):
    user_to_uptdate = User.get_by_id(id)
    data = user_put_args.parse_args()
    if data['password']:
        user_to_uptdate.password = data['password']
    if data['given_name']:
        user_to_uptdate.given_name = data['given_name']
    if data['family_name']:
        user_to_uptdate.name = data['family_name']
    if data['age']:
        user_to_uptdate.age = data['age']
    if data['team_id']:
        user_to_uptdate.team_id = data['team_id']
    if data['email']:
        user_to_uptdate.email = data['email']

    db.session.commit()

    serializer = UserSchema()
    result = serializer.dump(user_to_uptdate)
    return jsonify(result), 200


@app.route('/api/user/<int:id>', methods=['DELETE'])
def delete_user(id):
    user_to_delete = User.get_by_id(id)
    user_to_delete.delete()

    return jsonify({
        'message': 'deleted'
    }), 204


@app.route('/api/user/follow/<int:id>', methods=['PUT'])
def follow_user(id):
    user_to_follow = User.get_by_id(id)
    data = request.args
    user_following = User.get_by_id(data['user_id'])
    user_following.follow(user_to_follow)
    return jsonify({
        'message': 'Following'
    }), 200


@app.route('/api/followers/<int:id>', methods=['GET'])
def follow_table(id):
    users = User.get_all()
    user_with_followers = User.get_by_id(id)
    data = []
    for user in users:
        if user.is_following(user_with_followers):
            data.append(user)
    serializer = FollowerSchema(many=True)
    result = serializer.dump(data)
    return jsonify(result), 200


@app.route('/api/teams', methods=['GET'])
def get_all_teams():
    teams = Team.get_all()
    serializer = TeamSchema(many=True)
    result = serializer.dump(teams)
    return jsonify(result), 200


@app.route('/api/team', methods=['POST'])
def create_team():
    data = request.args
    newTeam = Team(
        name = data['name'],
        nationality = data['nationality'],            
        logo = data['logo']
    )
    newTeam.save()
    serializer = TeamSchema()
    result = serializer.dump(newTeam)
    return jsonify(result), 201


@app.route('/api/team/<int:id>', methods=['GET'])
def get_one_team(id):
    team = Team.get_by_id(id)
    serializer = TeamSchema()
    result = serializer.dump(team)
    return jsonify(result), 200


@app.route('/api/team/<int:id>', methods=['PUT'])
def update_team(id):
    team_to_uptdate = Team.get_by_id(id)
    data = team_put_args.parse_args()

    if data['name']:
        team_to_uptdate.name = data['name']
    if data['nationality']:
        team_to_uptdate.nationality = data['nationality']
    if data['logo']:
        team_to_uptdate.logo = data['logo']

    db.session.commit()

    serializer = TeamSchema()
    result = serializer.dump(team_to_uptdate)
    return jsonify(result), 200


@app.route('/api/team/<int:id>', methods=['DELETE'])
def delete_team(id):
    team_to_delete = Team.get_by_id(id)
    team_to_delete.delete()

    return jsonify({
        'message': 'deleted'
    }), 204


@app.route('/api/videos', methods=['GET'])
def get_all_videos():
    videos = Video.get_all()
    serializer = VideoSchema(many=True)
    result = serializer.dump(videos)
    return jsonify(result), 200


@app.route('/api/video', methods=['POST'])
def create_video():
    data = request.json
    newVideo = Video(
        user_id=data['user_id'],
        video=data['video'],
        caption=data['caption'],
        likes=0,
        views=0
    )

    newVideo.save()

    return jsonify(success=True)


@app.route('/api/video/<int:id>', methods=['GET'])
def get_video(id):
    video = Video.get_by_id(id)
    serializer = VideoSchema()
    result = serializer.dump(video)

    return jsonify(result), 200


@app.route('/api/video/<int:id>', methods=['PUT'])
def update_video(id):
    video_to_uptdate = Video.get_by_id(id)
    data = video_put_args.parse_args()

    if data['user_id']:
        video_to_uptdate.user_id = data['user_id']
    if data['caption']:
        video_to_uptdate.caption = data['caption']
    if data['likes']:
        video_to_uptdate.likes = data['likes']
    if data['views']:
        video_to_uptdate.views = data['views']

    db.session.commit()

    serializer = VideoSchema()
    result = serializer.dump(video_to_uptdate)
    return jsonify(result), 200


@app.route('/api/video/<int:id>', methods=['DELETE'])
def delete_video(id):
    video_to_delete = Video.get_by_id(id)
    video_to_delete.delete()

    return jsonify({
        'message': 'deleted'
    }), 204


@app.route('/api/badges', methods=['GET'])
def get_all_badges():
    badges = Badge.get_all()
    serializer = BadgeSchema(many=True)
    result = serializer.dump(badges)
    return jsonify(result), 200


@app.route('/api/badge', methods=['POST'])
def create_badge():
    data = request.args
    newBadge = Badge(
        name=data['name'],
        description=data['description'],
        level=data['level'],
        picture=data['picture'],
        category=data['category'],
        points_needed=data['points_needed']
    )

    newBadge.save()

    serializer = BadgeSchema()
    result = serializer.dump(newBadge)

    return jsonify(result), 201


@app.route('/api/badge/<int:id>', methods=['GET'])
def get_badge(id):
    badge = Badge.get_by_id(id)
    serializer = BadgeSchema()
    result = serializer.dump(badge)

    return jsonify(result), 200


@app.route('/api/badges/user/<int:id>', methods=['GET'])
def get_users_badges(id):
    badges = Badge.get_all()
    user = User.get_by_id(id)
    users_badges = user.badges
    array = []
    for badge in badges:
        for user_badge in users_badges:
            if badge == user_badge:
                array.append(badge)
    serializer = BadgeSchema(many=True)
    result = serializer.dump(array)
    return jsonify(result), 200


@app.route('/api/badge/<int:id>', methods=['PUT'])
def update_badge(id):
    badge_to_uptdate = Badge.get_by_id(id)
    data = badge_put_args.parse_args()

    if data['name']:
        badge_to_uptdate.name = data['name']
    if data['name']:
        badge_to_uptdate.description = data['description']
    if data['level']:
        badge_to_uptdate.level = data['level']
    if data['picture']:
        badge_to_uptdate.picture = data['picture']
    if data['category']:
        badge_to_uptdate.category = data['category']
    if data['points_needed']:
        badge_to_uptdate.points_needed = data['points_needed']

    db.session.commit()

    serializer = BadgeSchema()
    result = serializer.dump(badge_to_uptdate)
    return jsonify(result), 200


@app.route('/api/badge/<int:id>', methods=['DELETE'])
def delete_badge(id):
    badge_to_delete = Badge.get_by_id(id)
    badge_to_delete.delete()

    return jsonify({
        'message': 'deleted'
    }), 204


@app.route('/api/badge/collect', methods=['PUT'])
def user_badge():
    users = User.get_all()
    badges = Badge.get_all()
    for user in users:
        for badge in badges:
            if calculateBadges(badge, user):
                user.badges.append(badge)
    db.session.commit()

    serializer = UserSchema()
    result = serializer.dump(users)
    return jsonify(result), 200


def calculateBadges(badge, user):
    for video in user.videos:
        if badge.category == 'Likes' and video.likes >= badge.points_needed:
            return True
        elif badge.category == 'Views' and video.views >= badge.points_needed:
            return True
    return False


@app.errorhandler(404)
def not_found(error):
    return jsonify({'message': 'Resource not found'}), 404


@app.errorhandler(500)
def internal_server(error):
    return jsonify({'message': 'There is a problem'}), 500


@app.cli.command("db-data")
def bootstrap_data():
    db.drop_all()
    db.create_all()
    team1 = Team(name = 'AIK Fotboll', nationality = 'Sweden', logo = '../../../assets/teamLogos/AIK-logo.png')
    team2 = Team(name = 'BK Häcken', nationality = 'Sweden', logo = '../../../assets/teamLogos/Hacken-logo.png')
    team3 = Team(name = 'Degerfors IF', nationality = 'Sweden', logo = '../../../assets/teamLogos/Degerfors-logo.png')
    team4 = Team(name = 'Djurgårdens IF Fotboll', nationality = 'Sweden', logo = '../../../assets/teamLogos/Djurgardens-logo.png')
    team5 = Team(name = 'GIF Sundsvall', nationality = 'Sweden', logo = '../../../assets/teamLogos/Sundsvall-logo.png')
    team6 = Team(name = 'Hammarby IF', nationality = 'Sweden', logo = '../../../assets/teamLogos/Hammarby-logo.png')
    team7 = Team(name = 'Helsingborgs IF', nationality = 'Sweden', logo = '../../../assets/teamLogos/Helsingborgs-logo.png')
    team8 = Team(name = 'IF Elfsborg', nationality = 'Sweden', logo = '../../../assets/teamLogos/Ekfsborg-logo.png')
    team9 = Team(name = 'IFK Göteborg', nationality = 'Sweden', logo = '../../../assets/teamLogos/Goteborg-logo.png')
    team10 = Team(name = 'IFK Norrköping', nationality = 'Sweden', logo = '../../../assets/teamLogos/Norrkoping-logo.png')
    team11 = Team(name = 'IFK Värnamo', nationality = 'Sweden', logo = '../../../assets/teamLogos/Varnamo-logo.png')
    team12 = Team(name = 'IK Sirius', nationality = 'Sweden', logo = '../../../assets/teamLogos/Sirius-logo.png')
    team13 = Team(name = 'Kalmar FF', nationality = 'Sweden', logo = '../../../assets/teamLogos/Kalmar-logo.png')
    team14 = Team(name = 'Malmö FF', nationality = 'Sweden', logo = '../../../assets/teamLogos/Malmo-logo.png')
    team15 = Team(name = 'Mjällby AIF', nationality = 'Sweden', logo = '../../../assets/teamLogos/Mjallby-logo.png')
    team16 = Team(name = 'Varbergs BoIS', nationality = 'Sweden', logo = '../../../assets/teamLogos/Varbergs-logo.png')

    team1.save()
    team2.save()
    team3.save()
    team4.save()
    team5.save()
    team6.save()
    team7.save()
    team8.save()
    team9.save()
    team10.save()
    team11.save()
    team12.save()
    team13.save()
    team14.save()
    team15.save()
    team16.save()

    badge1 = Badge(name='Created account', description='Create an account', level='Normal',
                   picture='../../assets/badgeIcons/Setup.png', category='null', points_needed='0')
    badge2 = Badge(name='Overall bronze', description='Total points collected 100', level='Bronze',
                   picture='../../assets/badgeIcons/Bronze.png', category='totalPoints', points_needed='100')
    badge3 = Badge(name='Overall silver', description='Total points collected 500', level='Silver',
                   picture='../../assets/badgeIcons/Silver.png', category='totalPoints', points_needed='500')
    badge4 = Badge(name='Overall gold', description='Total points collected 1000', level='Gold',
                   picture='../../assets/badgeIcons/Gold.png', category='totalPoints', points_needed='1000')
    badge5 = Badge(name='Overall platinum', description='Total points collected 2500', level='Platinum',
                   picture='../../assets/badgeIcons/Platinum.png', category='totalPoints', points_needed='2500')
    badge6 = Badge(name='Overall diamond', description='Total points collected 5000', level='Diamond',
                   picture='../../assets/badgeIcons/Diamond.png', category='totalPoints', points_needed='5000')

    badge1.save()
    badge2.save()
    badge3.save()
    badge4.save()
    badge5.save()
    badge6.save()

    user1 = User(username='Forzasys-test', password='TestP', given_name='Forzasys',
                 family_name='Test', age=25, email='test@forzasys.no', team_id=16)
    user1.save()
    user1.badges.append(badge1)
    db.session.commit()

    print('Added data to database')


if __name__ == '__main__':
    app.run(debug=True)
