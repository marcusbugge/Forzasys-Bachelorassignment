from db import app
from services import ClubService
from flask import request

@app.route('/api/clubs', methods=['GET'])
async def get_all_clubs():
    return ClubService.get_all_clubs()


@app.route('/api/club', methods=['POST'])
async def create_club():
    return ClubService.create_club(request.json)


@app.route('/api/club/<int:id>', methods=['GET'])
async def get_one_club(id):
    return ClubService.get_one_club(id)


@app.route('/api/club/<int:id>', methods=['PUT'])
async def update_club(id):
    return ClubService.update_club(id, request.json)


@app.route('/api/club/<int:id>', methods=['DELETE'])
async def delete_club(id):
    return ClubService.delete_club(id)

