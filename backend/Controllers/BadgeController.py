from db import app
from Repositories import BadgeRepo
from flask import request

@app.route('/api/badges', methods=['GET'])
async def get_all_badges():
    return BadgeRepo.get_all_badges()


@app.route('/api/badge', methods=['POST'])
async def create_badge():
    return BadgeRepo(request.json)


@app.route('/api/badge/<int:id>', methods=['GET'])
async def get_badge(id):
    return BadgeRepo.get_badge(id)


@app.route('/api/badges/user/<int:id>', methods=['GET'])
def get_users_badges(id):
    return BadgeRepo.get_users_badges(id)


@app.route('/api/badge/<int:id>', methods=['PUT'])
async def update_badge(id):
    return BadgeRepo.update_badge(id, request.json)



@app.route('/api/badge/<int:id>', methods=['DELETE'])
async def delete_badge(id):
    return BadgeRepo.delete_badge(id)