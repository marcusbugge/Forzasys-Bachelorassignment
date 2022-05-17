from db import db

class Video(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    video_url = db.Column(db.String(500), unique=True, nullable=False)
    video_thumbnail = db.Column(db.String(500), unique=True, nullable=False)
    video_description = db.Column(db.String(100), nullable=False)

    def __repr__(self):
        return f'{self.id}'

    @classmethod
    def get_all(cls):
        return cls.query.all()

    @classmethod
    def get_by_id(cls, id):
        return cls.query.get_or_404(id)

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()
