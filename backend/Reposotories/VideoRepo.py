from flask import jsonify
from Models.Models_DB import User, Video


def like_video(user_id, video_url):
    user = User.get_by_id(user_id)
    try:
        video = Video(video = video_url)
        user.like_video(video)
        return True
    except:
        video = Video.query.filter_by(video = video_url).first()
        user.like_video(video)
        return True
    return False
