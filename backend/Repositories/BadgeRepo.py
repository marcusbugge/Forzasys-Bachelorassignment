from flask import jsonify
from Models.Models_DB import Badge, BadgeSchema, User
from db import db


def get_all_badges():
    badges = Badge.get_all()
    serializer = BadgeSchema(many=True)
    result = serializer.dump(badges)
    return jsonify(result), 200

def create_badge(data):
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

def get_badge(id):
    badge = Badge.get_by_id(id)
    serializer = BadgeSchema()
    result = serializer.dump(badge)
    return jsonify(result), 200

def update_badge(id, data):
    badge_to_uptdate = Badge.get_by_id(id)

    if 'name' in data and data['name'] != "":
        badge_to_uptdate.name = data['name']
    if 'description' in data and data['description'] != "":
        badge_to_uptdate.description = data['description']
    if 'level' in data and data['level'] != "":
        badge_to_uptdate.level = data['level']
    if 'picture' in data and data['picture'] != "":
        badge_to_uptdate.picture = data['picture']
    if 'category' in data and data['category'] != "":
        badge_to_uptdate.category = data['category']
    if 'points_needed' in data and data['points_needed'] != "":
        badge_to_uptdate.points_needed = data['points_needed']

    db.session.commit()
    badges = Badge.get_all()
    serializer = BadgeSchema(many=True)
    result = serializer.dump(badges)
    return jsonify(result), 200

def delete_badge(id):
    badge_to_delete = Badge.get_by_id(id)
    badge_to_delete.delete()

    return jsonify({
        'message': 'deleted'
    }), 204

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

def give_user_badge(category, points, user_id):
    user = User.get_by_id(user_id)
    badges = Badge.get_badge_by_category(category)
    badges.sort(key=lambda x: x.points_needed, reverse=True)
    for badge in badges:
        if points >= badge.points_needed and badge not in user.badges:
            user.add_badge(badge.id, category)
            return True
    return False