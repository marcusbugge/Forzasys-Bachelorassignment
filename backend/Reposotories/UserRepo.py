from flask import jsonify
from Models.Models_DB import User, Club
from Models.Models_api import PersonalScore, PersonalScoreSchema, Followlist, FollowlistSchema
from db import db


def login(data):
    email = data['email']
    password = data['password']
    users = User.get_all()
    for user in users:
        if user.is_authenticated(email, password):
            return get_idividual_score(user, users)
    return jsonify({
        'error': 'Wrong email and/ or password'
    }), 404

def get_idividual_score(loggedin_user, users):
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
                        email = loggedin_user.email
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

def follow_table(id):
    users = User.get_all()
    user_with_followers = User.get_by_id(id)
    followers = []
    for user in users:
        if user.is_following(user_with_followers):
            club = Club.get_by_id(user.club_id)
            followers.append(Followlist(id = user.id, name = user.given_name + " " + user.family_name, profile_pic=user.profile_pic,
                                        total_points = user.total_points, overall_rank = get_rank_total(user),
                                        club_rank = get_rank_club(user, club), club_logo = club.logo, club_id = club.id, 
                                        club_name = club.name, badges = user.badges, badge_count = len(user.badges)))
    followers.sort(key=lambda x: x.total_points, reverse=True)
    serializer = FollowlistSchema(many=True)
    result = serializer.dump(followers)
    return jsonify(result), 200

