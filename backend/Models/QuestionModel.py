from db import db

class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    question = db.Column(db.String(150), unique=True, nullable=False)
    answers = db.relationship('Answer', backref=db.backref(
        'database', lazy='joined'), lazy='select')

    def __repr__(self):
        return f'Question=(id = {self.id}, question={self.question}, answers={self.answers})'

    @classmethod
    def get_all(cls):
        return cls.query.all()

    @classmethod
    def get_by_id(cls, id):
        return cls.query.get_or_404(id)

    def save(self):
        db.session.add(self)
        for answer in self.answers:
            answer.save()
        db.session.commit()

    def delete(self):
        for answer in self.answers:
            answer.delete()
        db.session.delete(self)
        db.session.commit()

    def add_answer(self, answer):
        self.answers.append(answer)
        db.session.commit()

    def delete_question(self, answer):
        self.answers.remove(answer)
        db.session.commit()

