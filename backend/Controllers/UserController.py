from db import app
from Repositories import UserRepo
from flask import request

@app.route('/api/users', methods=['GET'])
async def get_all_users():
    return UserRepo.get_all_users()

@app.route('/api/login', methods=['POST'])
async def login():
    return UserRepo.login(request.json)
    

@app.route('/api/user', methods=['POST'])
async def create_user():
    return UserRepo.create_user(request.json)


@app.route('/api/user/<int:id>', methods=['GET'])
async def get_user(id):
    return UserRepo.get_user(id)


@app.route('/api/user/<int:id>', methods=['PUT'])
async def update_user(id):
    return UserRepo.update_user(id, request.json)
    

@app.route('/api/user/<int:id>', methods=['DELETE'])
async def delete_user(id):
    return UserRepo.delete_user(id)


@app.route('/api/user/<string:username>', methods=['GET'])
async def get_user_by_username(username):
    return UserRepo.get_user_by_username(username)


@app.route('/api/user/follow/<int:id>', methods=['PUT'])
async def follow_user(id):
    return UserRepo.follow_user(id, request.json)


@app.route('/api/followers/<int:id>', methods=['GET'])
async def follow_table(id):
    return UserRepo.follow_table(id)
    

@app.route('/api/user/like_video/<int:id>', methods=['POST'])
async def like_video(id):
    return UserRepo.like_video(id, request.json)

