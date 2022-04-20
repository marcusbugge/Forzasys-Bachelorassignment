from db import app
from Repositories import LeaderboardRepo


@app.route('/api/leaderboard/<int:start>/<int:end>', methods=['GET'])
async def get_leaderboard(start, end):
    return LeaderboardRepo.get_leaderboard(start, end)


@app.route('/api/leaderboard/<int:club_id>', methods=['GET'])
async def supporter_leaderboard(club_id):
    return LeaderboardRepo.supporter_leaderboard(club_id)


@app.route('/api/leaderboard/sortbyclub/<int:start>/<int:end>', methods=['GET'])
async def leaderboard_clubs(start, end):
    return LeaderboardRepo.leaderboard_clubs(start, end)


@app.route('/api/most_supporters/<int:start>/<int:end>', methods=['GET'])
async def most_supporters(start, end):
    return LeaderboardRepo.most_supporters(start, end)
