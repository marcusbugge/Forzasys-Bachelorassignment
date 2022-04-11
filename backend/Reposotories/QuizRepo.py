from flask import jsonify
from Models.Models_DB import Question, SubmittedQuiz, SubmittedQuizSchema, Club, User
from Models.Models_api import Trivia, TriviaSchema, QuizLeaderboard, QuizLeaderboardSchema
from db import db
from sqlalchemy import desc
from datetime import datetime, timedelta, time
from Reposotories.BadgeRepo import give_user_badge

def get_questions(user_id):
    if weekly_quiz_ready(user_id):
        questions = Question.get_all()
        quiz = []
        for q in questions:
            for answer in q.answers:
                if answer.correct:
                    trivia = Trivia(question=q.question,
                                    answers=q.answers, correct=answer)
            quiz.append(trivia)

        serializer = TriviaSchema(many=True)
        result = serializer.dump(quiz)
    
        return jsonify(result), 200
    else:
        submitted = SubmittedQuiz.query.filter_by(user_id = user_id).order_by(desc(SubmittedQuiz.submitted_time)).first()
        serializer = SubmittedQuizSchema()
        result = serializer.dump(submitted)
        return jsonify(result), 202


def weekly_quiz_ready(user_id):
    submitted = SubmittedQuiz.query.filter_by(user_id = user_id).order_by(desc(SubmittedQuiz.submitted_time)).first()
    if not submitted:
        return True
    elif get_last_friday() > submitted.submitted_time:
        return True
    else:
        return False


#https://stackoverflow.com/questions/12686991/how-to-get-last-friday
def get_last_friday():
    this_date = datetime.now()
    closest_friday = this_date + timedelta(days=(4 - this_date.weekday()))
    result = datetime.combine(closest_friday, time(17, 59, 59))
    print(result)
    return (result if result < this_date
            else result - timedelta(days=7))


def submit_quiz(user_id, data):
    points = (data['correct']*2 + 5 
            if (data['questions'] - data['correct'] == 0) 
            else (data['questions'] - (data['questions'] - data['correct']))*2)

    user = User.get_by_id(user_id)
    user.give_points(points)
    give_user_badge('points', user.total_points, user_id)

    SubmittedQuiz(user_id=user_id,
                submitted_time=datetime.now(),
                questions = data['questions'],
                correct = data['correct'],
                points = points).save()
    
    quiz_by_user = SubmittedQuiz.get_by_user(user_id)
    top_score = 0
    for quiz in quiz_by_user:
        if quiz.questions - quiz.correct == 0:
            top_score += 1
    give_user_badge('quiz', len(quiz_by_user), user_id)
    give_user_badge('quizExpert', top_score, user_id)

    return jsonify({
        'message': 'Quiz submitted',
        'data' : data['correct']
        }), 200


def get_quiz_leaderboard_points():
    quiz_leaderboard = format_list()
    quiz_leaderboard.sort(key=lambda x: x.total_quiz_points, reverse=True)
    serializer = QuizLeaderboardSchema(many=True)
    result = serializer.dump(quiz_leaderboard)
    return jsonify(result), 200


def get_quiz_leaderboard_participations():
    quiz_leaderboard = format_list()
    quiz_leaderboard.sort(key=lambda x: x.participations, reverse=True)
    serializer = QuizLeaderboardSchema(many=True)
    result = serializer.dump(quiz_leaderboard)
    return jsonify(result), 200


def format_list():
    quiz_history = SubmittedQuiz.get_all()
    quiz_leaderboard = []
    for element in quiz_history:
        if already_in_list(quiz_leaderboard, element.user_id):
            for e in quiz_leaderboard:
                if element.user_id == e.id:
                    e.participations += 1
                    e.total_quiz_points += element.points
        else:
            user = User.get_by_id(element.user_id)
            club = Club.get_by_id(user.club_id)
            quiz_leaderboard.append(QuizLeaderboard(id = element.user_id,
            participations = 1,
            total_quiz_points=element.points,
            name = user.given_name + " " + user.family_name,
            club_name = club.name,
            club_logo= club.logo,
            username = user.username
            ))
    return quiz_leaderboard


def already_in_list(quiz_leaderboard, user_id):
    for element in quiz_leaderboard:
        if element.id == user_id:
            return True
    return False


