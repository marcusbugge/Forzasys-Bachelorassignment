from db import app
from services import LeaderboardService


@app.route('/api/leaderboard/<int:start>/<int:end>', methods=['GET'])
async def get_leaderboard(start, end):
    return LeaderboardService.get_leaderboard(start, end)


@app.route('/api/leaderboard/<int:club_id>', methods=['GET'])
async def supporter_leaderboard(club_id):
    return LeaderboardService.supporter_leaderboard(club_id)


@app.route('/api/leaderboard/sortbyclub/<int:start>/<int:end>', methods=['GET'])
async def leaderboard_clubs(start, end):
    return LeaderboardService.leaderboard_clubs(start, end)


@app.route('/api/most_supporters/<int:start>/<int:end>', methods=['GET'])
async def most_supporters(start, end):
    return LeaderboardService.most_supporters(start, end)
