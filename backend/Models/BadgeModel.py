from db import db


class Badge(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    description = db.Column(db.String(150), nullable=False)
    level = db.Column(db.Integer, nullable=False)
    picture = db.Column(db.String(250), unique=True, nullable=False)
    category = db.Column(db.String(15), nullable=False)
    points_needed = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return f'{self.id}'

    @classmethod
    def get_all(cls):
        return cls.query.all()

    @classmethod
    def get_by_id(cls, id):
        return cls.query.get_or_404(id)

    @classmethod
    def get_badge_by_category(cls, category):
        return cls.query.filter_by(category=category).all()

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()
