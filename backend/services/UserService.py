from flask import jsonify
from models.UserModel import User
from models.ClubModel import Club
from models.VideoModel import Video
from services._SchemasDB import UserSchema
from models.API_Models import PersonalScore, Followlist
from services._SchemasAPI import PersonalScoreSchema, FollowlistSchema
from services._SchemasDB import VideoSchema
from db import db


def get_all_users():
    users = User.get_all()
    serializer = UserSchema(many=True)
    result = serializer.dump(users)
    return jsonify(result), 200

def create_user(data):
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"message" : "email"}), 409
    elif User.query.filter_by(username=data['username']).first():
        return jsonify({'message' : 'username'}), 409
    else:
        UserSchema().validate({
            'password' : data['password'],
            'given_name' : data['given_name'],
            'family_name': data['family_name'],
            'total_points' : 0,
            'age': data['age'],
            'email': data['email'],
            'club_id': data['club_id'],
            'role' : data['role'],
            'username' : data['username']
            })
        newUser = User(
            password=data['password'],
            given_name=data['given_name'],
            family_name=data['family_name'],
            total_points=0,
            age=data['age'],
            email=data['email'],
            club_id=data['club_id'],
            role = data['role'],
            username = data['username']
        )

        newUser.save()

        serializer = UserSchema()
        result = serializer.dump(newUser)

        return jsonify(result), 201

def get_user(id):
    user = User.get_by_id(id)
    users = User.get_all()
    return get_individual_score(user, users)

def update_user(id, data):
    user_to_uptdate = User.get_by_id(id)
    if 'name' in data and data['name'] != "":
        name = data['name']
        words = name.split()
        if len(words) == 2:
            user_to_uptdate.given_name = words[0]
            user_to_uptdate.family_name = words[1]
        else:
            user_to_uptdate.given_name = ""
            for i in range(len(words) - 1):
                user_to_uptdate.given_name += words[i] + " "
                user_to_uptdate.family_name = words[len(words) - 1]
    if 'password' in data and data['password'] != "":
        user_to_uptdate.password = data['password']
    if 'age' in data and data['age'] != "":
        user_to_uptdate.age = data['age']
    if 'club_id' in data and data['club_id'] != "":
        user_to_uptdate.club_id = data['club_id']
    if 'email' in data and data['email'] != "":
        user_to_uptdate.email = data['email']
    if 'username' in data and data['username'] != "":
        user_to_uptdate.username = data['username']

    db.session.commit()
    users = User.get_all()
    return get_individual_score(user_to_uptdate, users)
    

def delete_user(id):
    user_to_delete = User.get_by_id(id)
    user_to_delete.delete()

    return jsonify({
        'message': 'deleted'
    }), 204

def get_user_by_username(username):
    user = User.query.filter_by(username=username).first()
    users = User.get_all()
    return get_individual_score(user, users)

def login(data):
    email = data['email']
    password = data['password']
    users = User.get_all()
    for user in users:
        if user.is_authenticated(email, password):
            return get_individual_score(user, users)
    return jsonify({
        'error': 'Wrong email and/ or password'
    }), 404

def get_individual_score(loggedin_user, users):
    club = Club.get_by_id(loggedin_user.club_id)
    club_supporters = club.supporters
    club_supporters.sort(key=lambda x: x.total_points, reverse=True)
    users.sort(key=lambda x: x.total_points, reverse=True)
    user = PersonalScore(id = loggedin_user.id, 
                        name = loggedin_user.given_name + " " + loggedin_user.family_name,
                        profile_pic = loggedin_user.profile_pic,
                        overall_rank = users.index(loggedin_user) + 1,
                        club_id = club.id,
                        club_name = club.name, 
                        club_logo = club.logo,
                        club_rank = club_supporters.index(loggedin_user) + 1,
                        total_points = users[users.index(loggedin_user)].total_points,
                        role = loggedin_user.role,
                        username = loggedin_user.username,
                        badges=loggedin_user.badges,
                        age = loggedin_user.age,
                        email = loggedin_user.email,
                        videos = loggedin_user.videos,
                        following=loggedin_user.followed
                        )
    serializer = PersonalScoreSchema()
    result = serializer.dump(user)
    return jsonify(result), 200

def get_rank_total(user):
    users = User.get_all()
    users.sort(key=lambda x: x.total_points, reverse=True)
    return users.index(user) +1

def get_rank_club(user, club):
    supporters = club.supporters
    supporters.sort(key=lambda x: x.total_points, reverse=True)
    return supporters.index(user) + 1

def follow_user(id, data):
    user_following = User.get_by_id(data['user_id'])
    user_following.follow(id)
    return jsonify({
        'message': 'Following'
    }), 200

def unfollow_user(id, data):
    user_following = User.get_by_id(data['user_id'])
    user_to_unfollow = User.get_by_id(id)
    user_following.unfollow(user_to_unfollow)
    return jsonify({'message' : 'Unfollowed'}), 200

def follow_table(id):
    users = User.get_all()
    user_with_followers = User.get_by_id(id)
    followers = []
    for user in users:
        if user.is_following(user_with_followers):
            club = Club.get_by_id(user.club_id)
            followers.append(Followlist(id = user.id,
                                        name = user.given_name + " " + user.family_name,
                                        profile_pic=user.profile_pic,
                                        total_points = user.total_points,
                                        overall_rank = get_rank_total(user),
                                        club_rank = get_rank_club(user, club),
                                        club_logo = club.logo, 
                                        club_id = club.id, 
                                        club_name = club.name, 
                                        badges = user.badges, 
                                        badge_count = len(user.badges),
                                        username = user.username
                                        ))
    followers.sort(key=lambda x: x.total_points, reverse=True)
    serializer = FollowlistSchema(many=True)
    result = serializer.dump(followers)
    return jsonify(result), 200

def like_video(user_id, data):
    user = User.get_by_id(user_id)
    video_url = data['video_url']
    video_thumbnail = data['video_thumbnail']
    video_description = data['video_description']
    video = Video.query.filter_by(video_url = video_url).first()
    if video != None:
        user.like_video(video)
    else:
        newVideo = Video(video_url = video_url, video_thumbnail=video_thumbnail, video_description=video_description)
        newVideo.save()
        user.like_video(newVideo)

    return jsonify({'message' : 'Video liked'}), 200

def dislike_video(id, data):
    user = User.get_by_id(id)
    video = Video.query.filter_by(video_url = data['video_url']).first()
    user.dislike_video(video)
    return jsonify({'message' : 'Video disliked'}), 200


def get_liked_videos(id):
    user = User.get_by_id(id)
    videos = user.videos
    serializer = VideoSchema(many=True)
    result = serializer.dump(videos)
    return jsonify(result), 200
