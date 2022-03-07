from flask import request, jsonify
from args import user_put_args, video_put_args, badge_put_args, team_put_args
from db import db, app
from Models.Models import FollowerSchema, User, UserSchema, Team, TeamSchema, Video, VideoSchema, Badge, BadgeSchema, Comment, CommentSchema, Reply, ReplySchema, Quiz, QuizSchema, Question, QuestionSchema, Answer, AnswerSchema
from flask_cors import CORS

CORS(app)

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data['email']
    password = data['password']
    users = User.get_all()
    for user in users:
        if user.is_authenticated(email, password):
            return jsonify({
                'message': 'Logging in...'
            }), 200
    return jsonify({
        'error': 'Wrong email and/ or password'
    }), 404


@app.route('/api/users', methods=['GET'])
def get_all_users():
    users = User.get_all()
    serializer = UserSchema(many=True)
    result = serializer.dump(users)
    return jsonify(result), 200


@app.route('/api/user', methods=['POST'])
def create_user():
    data = request.json
    newUser = User(
        password=data['password'],
        given_name=data['given_name'],
        family_name=data['family_name'],
        total_points=0,
        age=data['age'],
        email=data['email'],
        team_id=data['team_id']
    )

    newUser.save()

    serializer = UserSchema()
    result = serializer.dump(newUser)

    return jsonify(result), 201


@app.route('/api/user/<int:id>', methods=['GET'])
def get_user(id):
    user = User.get_by_id(id)
    serializer = UserSchema()
    result = serializer.dump(user)

    return jsonify(result), 200


@app.route('/api/user/<int:id>', methods=['PUT'])
def update_user(id):
    user_to_uptdate = User.get_by_id(id)
    data = user_put_args.parse_args()
    if data['password']:
        user_to_uptdate.password = data['password']
    if data['given_name']:
        user_to_uptdate.given_name = data['given_name']
    if data['family_name']:
        user_to_uptdate.name = data['family_name']
    if data['age']:
        user_to_uptdate.age = data['age']
    if data['team_id']:
        user_to_uptdate.team_id = data['team_id']
    if data['email']:
        user_to_uptdate.email = data['email']

    db.session.commit()

    serializer = UserSchema()
    result = serializer.dump(user_to_uptdate)
    return jsonify(result), 200


@app.route('/api/user/<int:id>', methods=['DELETE'])
def delete_user(id):
    user_to_delete = User.get_by_id(id)
    user_to_delete.delete()

    return jsonify({
        'message': 'deleted'
    }), 204


@app.route('/api/user/follow/<int:id>', methods=['PUT'])
def follow_user(id):
    user_to_follow = User.get_by_id(id)
    data = request.args
    user_following = User.get_by_id(data['user_id'])
    user_following.follow(user_to_follow)
    return jsonify({
        'message': 'Following'
    }), 200


@app.route('/api/followers/<int:id>', methods=['GET'])
def follow_table(id):
    users = User.get_all()
    user_with_followers = User.get_by_id(id)
    data = []
    for user in users:
        if user.is_following(user_with_followers):
            data.append(user)
    serializer = FollowerSchema(many=True)
    result = serializer.dump(data)
    return jsonify(result), 200


@app.route('/api/teams', methods=['GET'])
def get_all_teams():
    teams = Team.get_all()
    serializer = TeamSchema(many=True)
    result = serializer.dump(teams)
    return jsonify(result), 200


@app.route('/api/team', methods=['POST'])
def create_team():
    data = request.json
    newTeam = Team(
        name=data['name'],
        nationality=data['nationality'],
        logo=data['logo']
    )
    newTeam.save()
    serializer = TeamSchema()
    result = serializer.dump(newTeam)
    return jsonify(result), 201


@app.route('/api/team/<int:id>', methods=['GET'])
def get_one_team(id):
    team = Team.get_by_id(id)
    serializer = TeamSchema()
    result = serializer.dump(team)
    return jsonify(result), 200


@app.route('/api/team/<int:id>', methods=['PUT'])
def update_team(id):
    team_to_uptdate = Team.get_by_id(id)
    data = team_put_args.parse_args()

    if data['name']:
        team_to_uptdate.name = data['name']
    if data['nationality']:
        team_to_uptdate.nationality = data['nationality']
    if data['logo']:
        team_to_uptdate.logo = data['logo']

    db.session.commit()

    serializer = TeamSchema()
    result = serializer.dump(team_to_uptdate)
    return jsonify(result), 200


@app.route('/api/team/<int:id>', methods=['DELETE'])
def delete_team(id):
    team_to_delete = Team.get_by_id(id)
    team_to_delete.delete()

    return jsonify({
        'message': 'deleted'
    }), 204


@app.route('/api/leaderboard/<int:team_id>', methods=['GET'])
def supporter_leaderboard(team_id):
    users = User.get_all()
    users_to_return = []
    for user in users:
        if user.team_id == team_id:
            users_to_return.append(user)
    if len(users_to_return) > 0:
        users_to_return.sort(key=lambda x: x.total_points, reverse=True)
        serializer = UserSchema(many=True)
        result = serializer.dump(users_to_return)
        return jsonify(result), 200
    else:
        return jsonify({'message': 'The team with id ' + team_id + 'has no supporters'}), 404


@app.route('/api/videos', methods=['GET'])
def get_all_videos():
    videos = Video.get_all()
    serializer = VideoSchema(many=True)
    result = serializer.dump(videos)
    return jsonify(result), 200


@app.route('/api/video', methods=['POST'])
def create_video():
    data = request.json
    newVideo = Video(
        user_id=data['user_id'],
        video=data['video'],
        caption=data['caption'],
        likes=0,
        views=0
    )

    newVideo.save()

    return jsonify(success=True)


@app.route('/api/video/<int:id>', methods=['GET'])
def get_video(id):
    video = Video.get_by_id(id)
    serializer = VideoSchema()
    result = serializer.dump(video)

    return jsonify(result), 200


@app.route('/api/video/<int:id>', methods=['PUT'])
def update_video(id):
    video_to_uptdate = Video.get_by_id(id)
    data = video_put_args.parse_args()

    if data['user_id']:
        video_to_uptdate.user_id = data['user_id']
    if data['caption']:
        video_to_uptdate.caption = data['caption']
    if data['likes']:
        video_to_uptdate.likes = data['likes']
    if data['views']:
        video_to_uptdate.views = data['views']

    db.session.commit()

    serializer = VideoSchema()
    result = serializer.dump(video_to_uptdate)
    return jsonify(result), 200


@app.route('/api/video/view/<int:id>', methods=['PUT'])
def view_a_video(id):
    video_to_uptdate = Video.get_by_id(id)
    video_to_uptdate.views += 1

    db.session.commit()

    serializer = VideoSchema()
    result = serializer.dump(video_to_uptdate)
    return jsonify(result), 200


@app.route('/api/video/like/<int:id>', methods=['PUT'])
def like_a_video(id):
    video_to_uptdate = Video.get_by_id(id)
    video_to_uptdate.likes += 1

    db.session.commit()

    serializer = VideoSchema()
    result = serializer.dump(video_to_uptdate)
    return jsonify(result), 200


@app.route('/api/video/<int:id>', methods=['DELETE'])
def delete_video(id):
    video_to_delete = Video.get_by_id(id)
    video_to_delete.delete()

    return jsonify({
        'message': 'deleted'
    }), 204


@app.route('/api/badges', methods=['GET'])
def get_all_badges():
    badges = Badge.get_all()
    serializer = BadgeSchema(many=True)
    result = serializer.dump(badges)
    return jsonify(result), 200


@app.route('/api/badge', methods=['POST'])
def create_badge():
    data = request.json
    newBadge = Badge(
        name=data['name'],
        description=data['description'],
        level=data['level'],
        picture=data['picture'],
        category=data['category'],
        points_needed=data['points_needed']
    )

    newBadge.save()

    serializer = BadgeSchema()
    result = serializer.dump(newBadge)

    return jsonify(result), 201


@app.route('/api/badge/<int:id>', methods=['GET'])
def get_badge(id):
    badge = Badge.get_by_id(id)
    serializer = BadgeSchema()
    result = serializer.dump(badge)

    return jsonify(result), 200


@app.route('/api/badges/user/<int:id>', methods=['GET'])
def get_users_badges(id):
    badges = Badge.get_all()
    user = User.get_by_id(id)
    users_badges = user.badges
    array = []
    for badge in badges:
        for user_badge in users_badges:
            if badge == user_badge:
                array.append(badge)
    serializer = BadgeSchema(many=True)
    result = serializer.dump(array)
    return jsonify(result), 200


@app.route('/api/badge/<int:id>', methods=['PUT'])
def update_badge(id):
    badge_to_uptdate = Badge.get_by_id(id)
    data = badge_put_args.parse_args()

    if data['name']:
        badge_to_uptdate.name = data['name']
    if data['name']:
        badge_to_uptdate.description = data['description']
    if data['level']:
        badge_to_uptdate.level = data['level']
    if data['picture']:
        badge_to_uptdate.picture = data['picture']
    if data['category']:
        badge_to_uptdate.category = data['category']
    if data['points_needed']:
        badge_to_uptdate.points_needed = data['points_needed']

    db.session.commit()

    serializer = BadgeSchema()
    result = serializer.dump(badge_to_uptdate)
    return jsonify(result), 200


@app.route('/api/badge/<int:id>', methods=['DELETE'])
def delete_badge(id):
    badge_to_delete = Badge.get_by_id(id)
    badge_to_delete.delete()

    return jsonify({
        'message': 'deleted'
    }), 204


@app.route('/api/badge/collect/<int:id>', methods=['PUT'])
def user_badge(id):
    user = User.get_by_id(id)
    data = request.args
    badge = Badge.get_by_id(data['id'])
    user.badges.append(badge)
    db.session.commit()

    serializer = UserSchema()
    result = serializer.dump(user)
    return jsonify(result), 200


@app.route('/api/comment', methods=['GET'])
def get_all_comments():
    comments = Comment.get_all()
    serializer = CommentSchema(many=True)
    result = serializer.dump(comments)
    return jsonify(result), 200


@app.route('/api/comment/<int:video_id>', methods=['POST'])
def comment_a_video(video_id):
    data = request.args
    comment = Comment(
        user_id=data['user_id'],
        video_id=video_id,
        content=data['content'],
        upvotes=0,
        downvotes=0
    )
    comment.save()
    video = Video.get_by_id(video_id)
    serializer = VideoSchema()
    result = serializer.dump(video)
    return jsonify(result), 200


@app.route('/api/reply/comment/<int:comment_id>', methods=['POST'])
def reply_a_comment(comment_id):
    data = request.args
    reply = Reply(
        user_id=data['user_id'],
        comment_id=comment_id,
        content=data['content'],
        upvotes=0,
        downvotes=0
    )
    reply.save()
    serializer = ReplySchema()
    result = serializer.dump(reply)
    return jsonify(result), 200


@app.route('/api/quizzes', methods=['GET'])
def get_all_quizzes():
    quizzes = Quiz.get_all()
    serializer = QuizSchema(many=True)
    result = serializer.dump(quizzes)
    return jsonify(result), 200


@app.errorhandler(404)
def not_found(error):
    return jsonify({'message': 'Resource not found'}), 404


@app.errorhandler(500)
def internal_server(error):
    return jsonify({'message': 'There is a problem'}), 500


@app.cli.command("db-data")
def db_data():
    db.drop_all()
    db.create_all()
    team1 = Team(name='AIK Fotboll', nationality='Sweden', logo="AIK-Logo.png")
    team2 = Team(name='BK Häcken', nationality='Sweden',
                 logo="Hacken-Logo.png")
    team3 = Team(name='Degerfors IF', nationality='Sweden',
                 logo="Degerfors-Logo.png")
    team4 = Team(name='Djurgårdens IF Fotboll',
                 nationality='Sweden', logo="Djurgardens-Logo.png")
    team5 = Team(name='GIF Sundsvall', nationality='Sweden',
                 logo="Sundsvall-Logo.png")
    team6 = Team(name='Hammarby IF', nationality='Sweden',
                 logo="Hammarby-Logo.png")
    team7 = Team(name='Helsingborgs IF', nationality='Sweden',
                 logo="Helsingborgs-Logo.png")
    team8 = Team(name='IF Elfsborg', nationality='Sweden',
                 logo="Elfsborg-Logo.png")
    team9 = Team(name='IFK Göteborg', nationality='Sweden',
                 logo="Goteborg-Logo.png")
    team10 = Team(name='IFK Norrköping', nationality='Sweden',
                  logo="Norrkoping-Logo.png")
    team11 = Team(name='IFK Värnamo', nationality='Sweden',
                  logo="Varnamo-Logo.png")
    team12 = Team(name='IK Sirius', nationality='Sweden',
                  logo="Sirius-Logo.png")
    team13 = Team(name='Kalmar FF', nationality='Sweden',
                  logo="Kalmar-Logo.png")
    team14 = Team(name='Malmö FF', nationality='Sweden', logo="Malmo-Logo.png")
    team15 = Team(name='Mjällby AIF', nationality='Sweden',
                  logo="Mjallby-Logo.png")
    team16 = Team(name='Varbergs BoIS', nationality='Sweden',
                  logo="Varbergs-Logo.png")

    team1.save()
    team2.save()
    team3.save()
    team4.save()
    team5.save()
    team6.save()
    team7.save()
    team8.save()
    team9.save()
    team10.save()
    team11.save()
    team12.save()
    team13.save()
    team14.save()
    team15.save()
    team16.save()

    badge1 = Badge(name='Created account', description='Create an account', level='Normal',
                   picture='Setup.png', category='null', points_needed='0')
    badge2 = Badge(name='Overall bronze', description='Total points collected 100', level='Bronze',
                   picture='Bronze.png', category='totalPoints', points_needed='100')
    badge3 = Badge(name='Overall silver', description='Total points collected 500', level='Silver',
                   picture='Silver.png', category='totalPoints', points_needed='500')
    badge4 = Badge(name='Overall gold', description='Total points collected 1000', level='Gold',
                   picture='Gold.png', category='totalPoints', points_needed='1000')
    badge5 = Badge(name='Overall platinum', description='Total points collected 2500', level='Platinum',
                   picture='Platinum.png', category='totalPoints', points_needed='2500')
    badge6 = Badge(name='Overall diamond', description='Total points collected 5000', level='Diamond',
                   picture='Diamond.png', category='totalPoints', points_needed='5000')

    badge1.save()
    badge2.save()
    badge3.save()
    badge4.save()
    badge5.save()
    badge6.save()

    user1 = User(password='TestP', given_name='Forzasys',
                 family_name='Test', age=25, email='test@forzasys.no', team_id=16, total_points=0)
    user2 = User(password='TestP', given_name='Forzasys',
                 family_name='Test', age=25, email='test@forzasys.no', team_id=16, total_points=1)
    user3 = User(password='TestP', given_name='Forzasys',
                 family_name='Test', age=25, email='test@forzasys.no', team_id=16, total_points=2)
    user4 = User(password='TestP', given_name='Forzasys',
                 family_name='Test', age=25, email='test@forzasys.no', team_id=16, total_points=3)
    user1.save()
    user2.save()
    user3.save()
    user4.save()
    user1.add_badge(badge1)

    video = Video(caption='Funny video', likes=0, views=0,
                  video='Random Video', user_id=1)
    video.save()

    quiz = Quiz(max_score=1)
    quiz.save()
    question = Question(question='Hvem er eldst?', quiz_id=1)
    question.save()
    a1 = Answer(content='Henke', question_id=1, correct=True)
    a2 = Answer(content='Bugge', question_id=1, correct=False)
    a3 = Answer(content='Feppe', question_id=1, correct=False)

    a1.save()
    a2.save()
    a3.save()

    question.answers.append(a1)
    question.answers.append(a2)
    question.answers.append(a3)

    print('Added data to database')


if __name__ == '__main__':
    app.run(debug=True)
