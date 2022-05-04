from flask import jsonify
from models.ClubModel import Club
from services._SchemasDB import ClubSchema
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
