import base64
from sre_constants import SUCCESS
from xml.dom import ValidationErr
from flask import Flask, request, jsonify, g
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api
from sqlalchemy import Integer, String, ForeignKey, LargeBinary
from marshmallow import Schema, fields
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask_cors import CORS
from PIL import Image
from args import user_put_args, video_put_args, badge_put_args, team_put_args

#https://medium.com/@ns2586/sqlalchemys-relationship-and-lazy-parameter-4a553257d9ef

app = Flask(__name__)
api = Api(app)
CORS(app)
#app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:123456@localhost/database'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///buggeDB.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)



#-----------------------------------------START OF MODELS ----------------------------------
earned_badges = db.Table('earned_badges',
    db.Column('user_id', Integer, ForeignKey('user.id')),
    db.Column('badge_id', Integer, ForeignKey('badge.id'))
)

followers = db.Table('followers',
    db.Column('follower_id', db.Integer, db.ForeignKey('user.id')),
    db.Column('followed_id', db.Integer, db.ForeignKey('user.id'))
)

class FollowerSchema(Schema):
    id = fields.Integer()

class User(UserMixin, db.Model):
    id = db.Column(Integer, primary_key=True)
    username = db.Column(String(30), unique=True, nullable=True)
    password = db.Column(String(40), nullable=False)
    given_name = db.Column(String(50), nullable=False)
    family_name = db.Column(String(50), nullable=False)
    age = db.Column(Integer, nullable=False)
    email = db.Column(String(50), nullable=False)
    team_id = db.Column(Integer, ForeignKey('team.id'), nullable=False)

    #https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-viii-followers
    followed = db.relationship(
        'User', secondary=followers,
        primaryjoin=(followers.c.follower_id == id),
        secondaryjoin=(followers.c.followed_id == id),
        backref=db.backref('followers', lazy='dynamic'), lazy='dynamic')
    
    videos = db.relationship('Video', backref=db.backref('user', lazy='joined'), lazy='select')
    badges = db.relationship('Badge', secondary=earned_badges, backref='database', lazy='select')

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
    username = fields.String()
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
    nickname = db.Column(String(6), nullable=False)
    nationality = db.Column(String(25), nullable=False)
    logo = db.Column(String(250), nullable=False)
    supporters = db.relationship('User', backref=db.backref('database', lazy='joined'), lazy='select')
    def __repr__(self):
        return f'Team(name={self.name}, nickname={self.nickname}, nationality={self.nationality} logo={self.logo})'

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
    nickname = fields.String()
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
    picture = db.Column(LargeBinary, nullable=False)
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
    picture = BytesField(required=True)
    category = fields.String()
    points_needed = fields.String()

#--------------------------------------- END OF MODELS ----------------------------------

@login_manager.user_loader
def load_user(id):
    return User.get_by_id(id)

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.args
        user_to_login = User.is_authenticated(data['username'], data['password'])
        login_user(user_to_login)
        return jsonify({
            'message' : 'Logging in...'
        }), 200
    except:
        return jsonify({
            'error' : 'Wrong username and/ or password'
        }), 404

@app.route('/api/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({
        'message' : 'Logging out...'
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
    print('Data from frontend: ',data)
    newUser = User(
        username = data['username'],
        password = data['password'],
        given_name = data['given_name'],
        family_name = data['family_name'],
        age = data['age'],
        email = data['email'],
        team_id = data['team_id']
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
        nickname = data['nickname'],
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
    if data['nickname']:
        team_to_uptdate.nickname = data['nickname']
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
        user_id = data['user_id'],
        video = data['video'],
        caption = data['caption'],
        likes = 0,
        views = 0
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
        name = data['name'],
        description = data['description'],
        level = data['level'],
        picture = data['picture'],
        category = data['category'],
        points_needed = data['points_needed']
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

@app.route('/api/userBadges', methods=['PUT'])
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
    return jsonify({'message' : 'Resource not found'}), 404

@app.errorhandler(500)
def internal_server(error):
    return jsonify({'message' : 'There is a problem'}), 500

@app.cli.command("db-data")
def bootstrap_data():
    db.drop_all()
    db.create_all()
    team1 = Team(name = 'Aalesund Fotballklubb', nickname = 'AaFK', nationality = 'Norway', logo = 'https://divisjonsforeningen.no/wp-content/uploads/2015/03/aalesund_logo_512.png')
    team2 = Team(name = 'Fotballklubben Bodø/Glimt', nickname= 'B/Ø', nationality = 'Norway', logo = 'https://divisjonsforeningen.no/wp-content/uploads/2019/01/glimt.png')
    team3 = Team(name = 'Hamarkameratene', nickname= 'HamKam', nationality = 'Norway', logo = 'https://www.fotballnerd.no/wp-content/uploads/2018/08/73F74FB6-E83E-4773-BE46-0A4D12A2F5CC.png')
    team4 = Team(name = 'Fotballklubben Haugesund', nickname= 'FKH', nationality = 'Norway', logo = 'https://seeklogo.com/images/F/fk-haugesund-logo-A0F2A7E062-seeklogo.com.png')
    team5 = Team(name = 'Fotballklubben Jerv', nickname= 'FKJ', nationality = 'Norway', logo = 'https://www.fkjerv.no/ffo/_/image/af79704d-b782-4c83-95ae-2fb5d4b1ad72:9a68176dc8e024252ddb98acc9b51342e2c79b4e/wide-72-72/jer-logo-fra-ai.svg')
    team6 = Team(name = 'Kristiansund Ballklubb', nickname= 'KBK', nationality = 'Norway', logo = 'https://www.kristiansundbk.no/_/asset/no.seeds.app.football:1631535449/img/logo/kri/logo.png')
    team7 = Team(name = 'Lillestrøm Sportsklubb', nickname= 'LSK', nationality = 'Norway', logo = 'https://www.h-a.no/wp-content/uploads/2020/06/lsklogo.png')
    team8 = Team(name = 'Model Fotballklubb', nickname= 'MFK', nationality = 'Norway', logo = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Molde_Fotball_Logo.svg/1200px-Molde_Fotball_Logo.svg.png')
    team9 = Team(name = 'Odds Ballklubb', nickname= 'Odd', nationality = 'Norway', logo = 'https://cdn.freebiesupply.com/logos/large/2x/odd-grenland-logo-png-transparent.png')
    team10 = Team(name = 'Rosenborg Ballklubb', nickname= 'RBK', nationality = 'Norway', logo = 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Rosenborg_Trondheim_logo.svg/1280px-Rosenborg_Trondheim_logo.svg.png')
    team11 = Team(name = 'Sandefjord Fotball', nickname= 'SF', nationality = 'Norway', logo = 'https://seeklogo.com/images/S/sandefjord-fotball-1998-logo-93446812B5-seeklogo.com.png')
    team12 = Team(name = 'Sarpsborg 08', nickname= 'S08', nationality = 'Norway', logo = 'https://www.logofootball.net/wp-content/uploads/Sarpsborg-08-Logo.png')
    team13 = Team(name = 'Strømsgodset Idrettsforening', nickname = 'SIF', nationality = 'Norway', logo = 'https://www.logofootball.net/wp-content/uploads/Stromsgodset-IF-Logo.png')
    team14 = Team(name = 'Tromsø Idrettslag', nickname= 'TIL', nationality = 'Norway', logo = 'https://www.logofootball.net/wp-content/uploads/Tromso-IL-HD-Logo.png')
    team15 = Team(name = 'Viking Fotballklubb', nickname= 'VFK', nationality = 'Norway', logo = 'https://www.vikingfotball.no/_/image/309088f1-0c15-443b-82de-2b92398cb259:2ff456063dec6faba9ad418cff12ac8ae3902665/wide-72-72/vik-logo_20200309.svg')
    team16 = Team(name = 'Vålrenga Idrettsforening', nickname= 'VIF', nationality = 'Norway', logo = 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/V%C3%A5lerenga_Oslo_logo.svg/2560px-V%C3%A5lerenga_Oslo_logo.svg.png')
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

    #badge = Badge(name = 'Like king', description = 'Get 100 likes on a video', level = 'Bronze', picture = Image.open('./badgeIcons/bronze-like.png'), category = 'Likes', points_needed = '100')
    #badge.save()



    print('Added data to database')

if __name__ == '__main__':
    app.run(debug=True)
