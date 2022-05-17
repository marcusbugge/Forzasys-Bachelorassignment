from flask import jsonify
from models.UserModel import User
from models.ClubModel import Club
from models.API_Models import Leaderboard, LeaderboardClub, SupporterChallenge
from services._SchemasAPI import LeaderboardClubSchema, LeaderboardSchema, SupporterChallengeSchema



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
        clubs_sorted_by_points.append(LeaderboardClub(club_id=club.id,
                                                      club_name=club.name,
                                                      club_logo=club.logo,
                                                      club_points=total_points_club(club.id),
                                                      club_rank=None,
                                                      top_supporter_name=top_supporter(club.id),
                                                      username=top_supporter_username(club.id)
                                                      ))
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
        return supporters[0].given_name + " " + supporters[0].family_name
    return None

def top_supporter_username(club_id):
    supporters = Club.get_by_id(club_id).supporters
    if len(supporters) > 0:
        supporters.sort(key=lambda x: x.total_points, reverse=True)
        return supporters[0].username
    return None

def most_supporters(start, end):
    clubs = Club.get_all()
    club_challenge = []
    for club in clubs:
        club_challenge.append(SupporterChallenge(id = club.id, club_name=club.name, club_logo=club.logo, 
                                                supporter_count=len(club.supporters)))
    club_challenge.sort(key=lambda x: x.supporter_count, reverse=True)
    clubs_to_return = []
    i = start
    if end < len(club_challenge):
        while i <= end:
            clubs_to_return.append(club_challenge[i])
            i += 1
    else:
        while i < len(club_challenge):
            clubs_to_return.append(club_challenge[i])
            i += 1
    serializer = SupporterChallengeSchema(many = True)
    result = serializer.dump(clubs_to_return)
    if len(result) != 0:
        return jsonify(result), 200
    else:
        return jsonify({'message' : 'There is no more teams'}), 200
