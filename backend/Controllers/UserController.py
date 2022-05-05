from db import app
from services import UserService
from flask import request

@app.route('/api/users', methods=['GET'])
async def get_all_users():
    return UserService.get_all_users()

@app.route('/api/login', methods=['POST'])
async def login():
    return UserService.login(request.json)
    

@app.route('/api/user', methods=['POST'])
async def create_user():
    return UserService.create_user(request.json)


@app.route('/api/user/<int:id>', methods=['GET'])
async def get_user(id):
    return UserService.get_user(id)


@app.route('/api/user/<int:id>', methods=['PUT'])
async def update_user(id):
    return UserService.update_user(id, request.json)
    

@app.route('/api/user/<int:id>', methods=['DELETE'])
async def delete_user(id):
    return UserService.delete_user(id)


@app.route('/api/user/<string:username>', methods=['GET'])
async def get_user_by_username(username):
    return UserService.get_user_by_username(username)


@app.route('/api/user/follow/<int:id>', methods=['POST'])
async def follow_user(id):
    return UserService.follow_user(id, request.json)

@app.route('/api/user/unfollow/<int:id>', methods=['POST'])
async def unfollow_user(id):
    return UserService.unfollow_user(id, request.json)

@app.route('/api/followers/<int:id>', methods=['GET'])
async def follow_table(id):
    return UserService.follow_table(id)
    

@app.route('/api/user/like_video/<int:id>', methods=['POST'])
async def like_video(id):
    return UserService.like_video(id, request.json)

@app.route('/api/user/dislike_video/<int:id>', methods=['POST'])
async def dislike_video(id):
    return UserService.dislike_video(id, request.json)

@app.route('/api/user/liked_videos/<int:id>', methods=['GET'])
async def get_liked_videos(id):
    return UserService.get_liked_videos(id)
