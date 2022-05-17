from db import db

class SubmittedQuiz(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    submitted_time = db.Column(db.DateTime)
    questions = db.Column(db.Integer, nullable=False)
    correct = db.Column(db.Integer, nullable=False)
    points = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return f'{self.id}'

    @classmethod
    def get_all(cls):
        return cls.query.all()

    @classmethod
    def get_by_user(cls, user_id):
        return cls.query.filter_by(user_id=user_id).all()

    def save(self):
        db.session.add(self)
        db.session.commit()
