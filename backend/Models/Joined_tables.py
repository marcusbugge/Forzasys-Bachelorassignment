from db import db

earned_badges = db.Table('earned_badges',
                         db.Column('user_id', db.Integer, db.ForeignKey('user.id')),
                         db.Column('badge_id', db.Integer, db.ForeignKey('badge.id'))
                         )

followers = db.Table('followers',
                     db.Column('follower_id', db.Integer,
                               db.ForeignKey('user.id')),
                     db.Column('followed_id', db.Integer,
                               db.ForeignKey('user.id'))
                     )
            
saved_videos = db.Table('liked_videos',
                        db.Column('user_id', db.Integer, db.ForeignKey('user.id')),
                        db.Column('video_id', db.Integer, db.ForeignKey('video.id'))
                        )