from flask import Flask, jsonify, make_response, session, json
from flask_restful import Api, Resource, abort, marshal_with
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Integer, LargeBinary, String, ForeignKey
from args import user_put_args, user_post_args, resource_fields_user, video_put_args, video_post_args, resource_fields_video, badge_put_args, badge_post_args, resource_fields_badge, team_put_args, team_post_args, resource_fields_team
import base64
from flask_cors import CORS, cross_origin


app = Flask(__name__)
api = Api(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:123456@localhost/forzasys'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
cors = CORS(app, resources={r"/*": {"origins": "*"}})


earned_badges = db.Table('earned_badges',
    db.Column('user_id', Integer, ForeignKey('user_model.id')),
    db.Column('badge_id', Integer, ForeignKey('badge_model.id'))
)


class UserModel(db.Model):
    id = db.Column(Integer, primary_key=True)
    given_name = db.Column(String(50), nullable=False)
    family_name = db.Column(String(50), nullable=False)
    age = db.Column(Integer, nullable=False)
    email = db.Column(String(50), nullable=False)
    team_id = db.Column(Integer, ForeignKey('team_model.id'), nullable=False)
    videos = db.relationship('VideoModel', backref=db.backref('user_model', lazy='joined'), lazy='select')
    badges = db.relationship('BadgeModel', secondary=earned_badges, backref='database', lazy='select')
    def __repr__(self):
        return f'{self.id}'


class TeamModel(db.Model):
    id = db.Column(Integer, primary_key=True)
    name = db.Column(String(30), nullable=False)
    nickname = db.Column(String(5), nullable=False)
    nationality = db.Column(String(25), nullable=False)
    logo = db.Column(String(250), nullable=False)
    supporters = db.relationship('UserModel', backref=db.backref('database', lazy='joined'), lazy='select')
    def __repr__(self):
        return f'TeamModel(name={self.name}, nickname={self.nickname}, nationality={self.nationality} logo={self.logo})'

class VideoModel(db.Model):
    id = db.Column(Integer, primary_key=True)
    user_id = db.Column(Integer, ForeignKey('user_model.id'), nullable=False)
    video = db.Column(LargeBinary, nullable=False)
    caption = db.Column(String(50))
    likes = db.Column(Integer, nullable=False)
    views = db.Column(Integer, nullable=False)
    def __repr__(self):
        return f'{self.id}'


class BadgeModel(db.Model):
    id = db.Column(Integer, primary_key=True)
    name = db.Column(String(20), nullable=False)
    description = db.Column(String(150), nullable=False)
    level = db.Column(String(10), nullable=False)
    picture = db.Column(String(250), nullable=False)
    category = db.Column(String(15), nullable=False)
    points_needed = db.Column(Integer, nullable=False)

    def __repr__(self):
        return f'{self.id}'


class getUsers(Resource):
    @marshal_with(resource_fields_user)
    def get(self):
        result = UserModel.query.all()
        if not result:
            abort(404, message='Cant find any users')
        else:
            return result, 200
api.add_resource(getUsers, '/getUsers')

class createUser(Resource):
    @marshal_with(resource_fields_user)
    def post(self):
        args = user_post_args.parse_args()
        user = UserModel(
            given_name=args['given_name'],
            family_name=args['family_name'],
            email = args['email'],
            age=args['age'],
            team_id=args['team_id']
            )
        db.session.add(user)
        db.session.commit()
        return user, 201
api.add_resource(createUser, '/createUser')


class User(Resource):
    @marshal_with(resource_fields_user)
    def get(self, user_id):
        result = UserModel.query.filter_by(id=user_id).first()
        if not result:
            abort(404, message='Could not find user with that id...')
        return make_response(jsonify(result), 200)


    @marshal_with(resource_fields_user)
    def put(self, user_id):
        args = user_put_args.parse_args()
        result = UserModel.query.filter_by(id=user_id).first()
        if not result:
            abort(404, message='Could not find user with that id, can not update...')
        if args['given_name']:
            result.given_name = args['given_name']
        if args['family_name']:
            result.name = args['family_name']
        if args['age']:
            result.age = args['age']
        if args['team_id']:
            result.team_id = args['team_id']
        
        db.session.commit()
        return result, 200


    @marshal_with(resource_fields_video)
    def delete(self, user_id):
        result = UserModel.query.filter_by(id=user_id).first()
        db.session.delete(result)
        db.session.commit()
        return 'Deleted', 204
api.add_resource(User, '/user/<int:user_id>')


class getUsersVideos(Resource):
    @marshal_with(resource_fields_video)
    def get(self, user_id):
        list = VideoModel.query.all()
        result = []
        for i in list:
            if i.user_id == user_id:
                result.append(i)
        if len(result) == 0:
            abort(404, message='Could not find videos for user with that id...')
        return result
api.add_resource(getUsersVideos, '/usersVideos/<int:user_id>')


class createVideo(Resource):
    @marshal_with(resource_fields_video)
    def post(self):
        args = video_post_args.parse_args()
        with open('test1.mp4', 'rb') as videoFile:
            binary = base64.b64encode(videoFile.read())
        video = VideoModel(
            user_id=args['user_id'],
            caption=args['caption'],
            video= binary,
            likes=args['likes'],
            views=args['views']
            )
        db.session.add(video)
        db.session.commit()
        return video, 201
api.add_resource(createVideo, '/createVideo')


class Video(Resource):
    @marshal_with(resource_fields_video)
    def get(self, video_id):
        result = VideoModel.query.filter_by(id=video_id).first()
        if not result:
            abort(404, message='Could not find a video with that id...')
        result.headers.add("Access-Control-Allow-Origin", "*")
        return result


    @marshal_with(resource_fields_video)
    def put(self, video_id):
        args = video_put_args.parse_args()
        result = VideoModel.query.filter_by(id=video_id).first()
        if not result:
            abort(404, message='Could not find user with that id, can not update...')
        if args['user_id']:
            result.user_id = args['user_id']
        if args['caption']:
            result.caption = args['caption']
        if args['likes']:
            result.likes = args['likes']
        if args['views']:
            result.views = args['views']
        
        db.session.commit()
        return result, 200
    
    @marshal_with(resource_fields_video)
    def delete(self, video_id):
        result = VideoModel.query.filter_by(id=video_id).first()
        db.session.delete(result)
        db.session.commit()
        return 'Deleted', 204
api.add_resource(Video, '/video/<int:video_id>')

class Badges(Resource):
    @marshal_with(resource_fields_badge)
    def get(self):
        result = BadgeModel.query.all()
        if not result:
            abort(404, message='Cant find any badges')
        else:
            return result

    @marshal_with(resource_fields_badge)
    def post(self):
        args = badge_post_args.parse_args()
        badge = BadgeModel(
            name=args['name'],
            description=args['description'],
            level=args['level'],
            picture=args['picture'],
            category=args['category'],
            points_needed=args['points_needed'])
        db.session.add(badge)
        db.session.commit()
        return badge, 201
api.add_resource(Badges, '/badges')

class editBadges(Resource):
    @marshal_with(resource_fields_badge)
    def put(self, badge_id):
        args = badge_put_args.parse_args()
        result = BadgeModel.query.filter_by(id=badge_id).first()
        if not result:
            abort(404, message='Could not find badge with that id, can not update...')
        if args['name']:
            result.name = args['name']
        if args['name']:
            result.description = args['description']
        if args['level']:
            result.level = args['level']
        if args['picture']:
            result.picture = args['picture']
        if args['category']:
            result.category = args['category']
        if args['points_needed']:
            result.points_needed = args['points_needed']
        
        db.session.commit()
        return result, 200
    
    @marshal_with(resource_fields_badge)
    def delete(self, badge_id):
        result = BadgeModel.query.filter_by(id=badge_id).first()
        db.session.delete(result)
        db.session.commit()
        return 'Deleted', 204
api.add_resource(editBadges, '/badges/<int:badge_id>')

def calculateBadges(badge, user):
    for video in user.videos:
        if badge.category == 'likes' and video.likes > badge.points_needed:
            return True
        elif badge.category == 'views' and video.views > badge.points_needed:
            return True
    return False

class userBadges(Resource):
    @marshal_with(resource_fields_user)
    def put(self):
        badges = BadgeModel.query.all()
        users = UserModel.query.all()
        for user in users:
            for badge in badges:
                if calculateBadges(badge, user):
                    user.badges.append(badge)
        db.session.commit()
        return users, 200
api.add_resource(userBadges, '/userBadges')
                

class team(Resource):
    @marshal_with(resource_fields_team)
    def get(self):
        teams = TeamModel.query.all()
        if not teams:
            abort(404, message="Cant find the teams")
        else:
            return teams

    @marshal_with(resource_fields_team)
    def post(self):
        args = team_post_args.parse_args()
        team = TeamModel(
            name=args['name'],
            nickname=args['nickname'],
            nationality=args['nationality'],
            logo=args['logo'])
        db.session.add(team)
        db.session.commit()
        return team, 201
api.add_resource(team, '/team')
 


if __name__ == '__main__':
    app.run(debug=True)
