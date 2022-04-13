from flask import jsonify
from Models.Models_DB import Badge, BadgeSchema, User

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