from db import app
from Repositories import QuizRepo
from flask import request


@app.route('/api/trivia/data/<int:user_id>', methods=['GET'])
async def get_questions(user_id):
    return QuizRepo.get_questions(user_id)


@app.route('/api/quizes', methods=['GET'])
async def all_questions():
    return QuizRepo.all_questions()


@app.route('/api/submitQuiz/<int:user_id>', methods=['POST'])
async def submit_quiz(user_id):
    return QuizRepo.submit_quiz(user_id, request.json)


@app.route('/api/question', methods=['POST'])
async def create_question():
    return QuizRepo.create_question(request.json)


@app.route('/api/question/<int:id>', methods=['DELETE'])
async def delete_question(id):
    return QuizRepo.delete_question(id)


@app.route('/api/question/<int:id>', methods=['PUT'])
async def edit_question(id):
    return QuizRepo.edit_question(id, request.json)
    

@app.route('/api/answers', methods=['GET'])
async def get_answers():
    return QuizRepo.get_answers()


@app.route('/api/answers/<int:id>', methods=['PUT'])
async def edit_answers(id):
    return QuizRepo.edit_answers(id, request.json)


@app.route('/api/quiz/leaderboard/points', methods=['GET'])
async def get_quiz_leaderboard_points():
    return QuizRepo.get_quiz_leaderboard_points()


@app.route('/api/quiz/leaderboard/participations', methods=['GET'])
async def get_quiz_leaderboard_participations():
    return QuizRepo.get_quiz_leaderboard_participations()