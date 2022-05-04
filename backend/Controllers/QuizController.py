from db import app
from services import QuizService
from flask import request


@app.route('/api/trivia/data/<int:user_id>', methods=['GET'])
async def get_questions(user_id):
    return QuizService.get_questions(user_id)


@app.route('/api/quizes', methods=['GET'])
async def all_questions():
    return QuizService.all_questions()


@app.route('/api/submitQuiz/<int:user_id>', methods=['POST'])
async def submit_quiz(user_id):
    return QuizService.submit_quiz(user_id, request.json)


@app.route('/api/question', methods=['POST'])
async def create_question():
    return QuizService.create_question(request.json)


@app.route('/api/question/<int:id>', methods=['DELETE'])
async def delete_question(id):
    return QuizService.delete_question(id)


@app.route('/api/question/<int:id>', methods=['PUT'])
async def edit_question(id):
    return QuizService.edit_question(id, request.json)
    

@app.route('/api/answers', methods=['GET'])
async def get_answers():
    return QuizService.get_answers()


@app.route('/api/answers/<int:id>', methods=['PUT'])
async def edit_answers(id):
    return QuizService.edit_answers(id, request.json)


@app.route('/api/quiz/leaderboard/points', methods=['GET'])
async def get_quiz_leaderboard_points():
    return QuizService.get_quiz_leaderboard_points()


@app.route('/api/quiz/leaderboard/participations', methods=['GET'])
async def get_quiz_leaderboard_participations():
    return QuizService.get_quiz_leaderboard_participations()