from db import db

class Club(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30), nullable=False)
    nationality = db.Column(db.String(25), nullable=False)
    logo = db.Column(db.String(250), nullable=False)
    supporters = db.relationship('User', backref=db.backref(
        'database', lazy='joined'), lazy='select')

    def __repr__(self):
        return f'Club(name={self.name}, nationality={self.nationality} logo={self.logo})'

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
