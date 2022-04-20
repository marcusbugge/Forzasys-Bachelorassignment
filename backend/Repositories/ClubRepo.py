from flask import jsonify
from Models.Models_DB import Club, ClubSchema, User
from Models.Models_api import Leaderboard, LeaderboardSchema, LeaderboardClub, LeaderboardClubSchema, SupporterChallenge, SupporterChallengeSchema
from db import db


def get_all_clubs():
    clubs = Club.get_all()
    serializer = ClubSchema(many=True)
    result = serializer.dump(clubs)
    return jsonify(result), 200

def create_club(data):
    newClub = Club(
        name=data['name'],
        nationality=data['nationality'],
        logo=data['logo']
    )
    newClub.save()
    serializer = ClubSchema()
    result = serializer.dump(newClub)
    return jsonify(result), 201

def get_one_club(id):
    club = Club.get_by_id(id)
    serializer = ClubSchema()
    result = serializer.dump(club)
    return jsonify(result), 200

def update_club(id, data):
    club_to_uptdate = Club.get_by_id(id)

    if 'name' in data and data['name'] != "":
        club_to_uptdate.name = data['name']
    if 'nationality' in data and data['nationality'] != "":
        club_to_uptdate.nationality = data['nationality']
    if 'logo' in data and data['logo'] != "":
        club_to_uptdate.logo = data['logo']

    db.session.commit()

    serializer = ClubSchema()
    result = serializer.dump(club_to_uptdate)
    return jsonify(result), 200

def delete_club(id):
    club_to_delete = Club.get_by_id(id)
    club_to_delete.delete()

    return jsonify({
        'message': 'deleted'
    }), 204

def get_leaderboard(start, end):
    users = User.get_all()
    users.sort(key=lambda x: x.total_points, reverse=True)
    users_to_return = []
    i = start
    if(end < len(users)):
        while i <= end:
            club = Club.get_by_id(users[i].club_id)
            user = Leaderboard(user_id=users[i].id,
                               rank=i+1,
                               name=users[i].given_name + " " + users[i].family_name,
                               club=club.name,
                               club_logo=club.logo,
                               points=users[i].total_points,
                               username=users[i].username
                               )
            users_to_return.append(user)
            i += 1
    else:
        while i < len(users):
            club = Club.get_by_id(users[i].club_id)
            user = Leaderboard(user_id=users[i].id,
                               rank=i+1,
                               name=users[i].given_name + " " + users[i].family_name,
                               club=club.name,
                               club_logo=club.logo,
                               points=users[i].total_points,
                               username=users[i].username
                               )
            users_to_return.append(user)
            i += 1
    if len(users_to_return) != 0:
        serializer = LeaderboardSchema(many=True)
        result = serializer.dump(users_to_return)
        return jsonify(result), 200
    else:
        return jsonify({'message' : 'Users do not exist'}), 404

def supporter_leaderboard(club_id):
    users = User.get_all()
    users.sort(key=lambda x: x.total_points, reverse=True)
    club = Club.get_by_id(club_id)
    users_to_return = []
    i=1
    for user in users:
        if user.club_id == club_id:
            leaderboard_user = Leaderboard(user_id=user.id, rank=i, name=user.given_name + " " + user.family_name, 
                                            club = club.name, club_logo=club.logo, points=user.total_points, username=user.username)
            users_to_return.append(leaderboard_user)
            i += 1
    if len(users_to_return) > 0:
        users_to_return.sort(key=lambda x: x.points, reverse=True)
        serializer = LeaderboardSchema(many=True)
        result = serializer.dump(users_to_return)
        return jsonify(result), 200
    else:
        return jsonify({'message': 'The club with id ' + club_id + 'has no supporters'}), 404

def leaderboard_clubs(start, end):
    clubs = Club.get_all()
    clubs_sorted_by_points = []
    for club in clubs:
        clubs_sorted_by_points.append(LeaderboardClub(club_id=club.id,club_name=club.name,club_logo=club.logo,
                            club_points=total_points_club(club.id),club_rank=None,top_supporter_name=top_supporter(club.id)))
    clubs_sorted_by_points.sort(key=lambda x: x.club_points, reverse=True)
    i = 1
    for club in clubs_sorted_by_points:
        club.club_rank = i
        i += 1
    clubs_to_return = []
    i = start
    if end < len(clubs_sorted_by_points):
        while i <= end:
            clubs_to_return.append(clubs_sorted_by_points[i])
            i += 1
    else:
        while i < len(clubs_sorted_by_points):
            clubs_to_return.append(clubs_sorted_by_points[i])
            i += 1

    serializer = LeaderboardClubSchema(many=True)
    result = serializer.dump(clubs_to_return)
    if len(result) != 0:
        return jsonify(result), 200
    else:
        return jsonify({'message' : 'There is no more teams'}), 200

def total_points_club(club_id):
    club = Club.get_by_id(club_id)
    total_points = 0
    for supporter in club.supporters:
        total_points += supporter.total_points
    return total_points

def top_supporter(club_id):
    supporters = Club.get_by_id(club_id).supporters
    if len(supporters) > 0:
        supporters.sort(key=lambda x: x.total_points, reverse=True)
        return supporters[0]
    return None

def most_supporters():
    clubs = Club.get_all()
    club_challenge = []
    for club in clubs:
        club_challenge.append(SupporterChallenge(id = club.id, club_name=club.name, club_logo=club.logo, 
                                                supporter_count=len(club.supporters)))
    club_challenge.sort(key=lambda x: x.supporter_count, reverse=True)
    serializer = SupporterChallengeSchema(many = True)
    result = serializer.dump(club_challenge)
    return jsonify(result), 200
