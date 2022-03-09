from datetime import datetime, timedelta
from flask import request, jsonify
from flask_cors import CORS
from db import db, app
from Models.Models_DB import FollowerSchema, User, UserSchema, Club, ClubSchema, Video, VideoSchema, Badge, BadgeSchema, Comment, CommentSchema, Reply, ReplySchema, Question, Answer, SubmittedQuiz, SubmittedQuizSchema
from Models.Models_api import Leaderboard, LeaderboardSchema, Trivia, TriviaSchema, PersonalScore, PersonalScoreSchema
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
            return get_idividual_score(user, users)
    return jsonify({
        'error': 'Wrong email and/ or password'
    }), 404


def get_idividual_score(loggedin_user, users):
    club = Club.get_by_id(loggedin_user.club_id)
    club_supporters = club.supporters
    club_supporters.sort(key=lambda x: x.total_points, reverse=True)
    users.sort(key=lambda x: x.total_points, reverse=True)
    user = PersonalScore(id = loggedin_user.id, 
                        name = loggedin_user.given_name + " " + loggedin_user.family_name,
                        overall_rank = users.index(loggedin_user) + 1, 
                        club_name = club.name, 
                        club_logo = club.logo,
                        club_rank = club_supporters.index(loggedin_user) + 1,
                        total_points = users[users.index(loggedin_user)].total_points
                        )
    serializer = PersonalScoreSchema()
    result = serializer.dump(user)
    return jsonify(result), 200


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
        club_id=data['club_id']
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
    data = request.json
    name = data['name']
    words = name.split()
    if data['password']:
        user_to_uptdate.password = data['password']
    if len(words) == 2:
        user_to_uptdate.given_name = words[0]
        user_to_uptdate.family_name = words[1]
    else:
        user_to_uptdate.given_name = ""
        for i in range(len(words) - 1):
            user_to_uptdate.given_name += words[i]
        user_to_uptdate.family_name = words[len(words) - 1]
    if data['age']:
        user_to_uptdate.age = data['age']
    if data['club_id']:
        user_to_uptdate.club_id = data['club_id']
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
    data = request.json
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


@app.route('/api/clubs', methods=['GET'])
def get_all_clubs():
    clubs = Club.get_all()
    serializer = ClubSchema(many=True)
    result = serializer.dump(clubs)
    return jsonify(result), 200


@app.route('/api/club', methods=['POST'])
def create_club():
    data = request.json
    newClub = Club(
        name=data['name'],
        nationality=data['nationality'],
        logo=data['logo']
    )
    newClub.save()
    serializer = ClubSchema()
    result = serializer.dump(newClub)
    return jsonify(result), 201


@app.route('/api/club/<int:id>', methods=['GET'])
def get_one_club(id):
    club = Club.get_by_id(id)
    serializer = ClubSchema()
    result = serializer.dump(club)
    return jsonify(result), 200


@app.route('/api/club/<int:id>', methods=['PUT'])
def update_club(id):
    club_to_uptdate = Club.get_by_id(id)
    data = request.json

    if data['name']:
        club_to_uptdate.name = data['name']
    if data['nationality']:
        club_to_uptdate.nationality = data['nationality']
    if data['logo']:
        club_to_uptdate.logo = data['logo']

    db.session.commit()

    serializer = ClubSchema()
    result = serializer.dump(club_to_uptdate)
    return jsonify(result), 200


@app.route('/api/club/<int:id>', methods=['DELETE'])
def delete_club(id):
    club_to_delete = Club.get_by_id(id)
    club_to_delete.delete()

    return jsonify({
        'message': 'deleted'
    }), 204

#user_id, name, club, points


@app.route('/api/leaderboard/<int:start>/<int:end>')
def get_leaderboard(start, end):
    users = User.get_all()
    users.sort(key=lambda x: x.total_points, reverse=True)
    users_to_return = []
    i = start
    while i <= end:
        club = Club.get_by_id(users[i].club_id)
        user = Leaderboard(user_id=users[i].id, rank=i+1, name=users[i].given_name + " " +
                           users[i].family_name, club=club.name, club_logo=club.logo, points=users[i].total_points)
        users_to_return.append(user)
        i += 1
    serializer = LeaderboardSchema(many=True)
    result = serializer.dump(users_to_return)
    return jsonify(result), 200


@app.route('/api/leaderboard/<int:club_id>', methods=['GET'])
def supporter_leaderboard(club_id):
    users = User.get_all()
    users_to_return = []
    for user in users:
        if user.club_id == club_id:
            users_to_return.append(user)
    if len(users_to_return) > 0:
        users_to_return.sort(key=lambda x: x.total_points, reverse=True)
        serializer = UserSchema(many=True)
        result = serializer.dump(users_to_return)
        return jsonify(result), 200
    else:
        return jsonify({'message': 'The club with id ' + club_id + 'has no supporters'}), 404


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
    data = request.json

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
    data = request.json

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
    data = request.json
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
    data = request.json
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


@app.route('/api/trivia/data/<int:user_id>', methods=['GET'])
def get_questions(user_id):
    if user_already_submitted_quiz:
        questions = Question.get_all()
        quiz = []
        for q in questions:
            for answer in q.answers:
                if answer.correct:
                    trivia = Trivia(question=q.question,
                                    answers=q.answers, correct=answer, points=25)
            quiz.append(trivia)

        serializer = TriviaSchema(many=True)
        result = serializer.dump(quiz)
    
        return jsonify(result), 200
    else:
        return False

def user_already_submitted_quiz(user_id):
    try:
        submitted = SubmittedQuiz.query.filter_by(user_id = user_id).first()
        time_now = datetime.now() - timedelta(days=7)
        if not submitted.submitted and time_now < submitted.submitted_time:
            return True
    except:
        return False
    return False

@app.route('/api/submitQuiz/<int:user_id>', methods=['POST'])
def submit_quiz(user_id):
    try:
        submitted = SubmittedQuiz.query.filter_by(user_id=user_id).first()
        submitted.delete()
    except:
        ""
    quiz = SubmittedQuiz(user_id=user_id, submitted=True,
                         submitted_time=datetime.datetime.now())
    quiz.save()
    return jsonify({'message': 'Quiz submitted'}), 200


@app.route('/api/')
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
    club1 = Club(name='AIK Fotboll', nationality='Sweden', logo="AIK-Logo.png")
    club2 = Club(name='BK Häcken', nationality='Sweden',
                 logo="Hacken-Logo.png")
    club3 = Club(name='Degerfors IF', nationality='Sweden',
                 logo="Degerfors-Logo.png")
    club4 = Club(name='Djurgårdens IF Fotboll',
                 nationality='Sweden', logo="Djurgardens-Logo.png")
    club5 = Club(name='GIF Sundsvall', nationality='Sweden',
                 logo="Sundsvall-Logo.png")
    club6 = Club(name='Hammarby IF', nationality='Sweden',
                 logo="Hammarby-Logo.png")
    club7 = Club(name='Helsingborgs IF', nationality='Sweden',
                 logo="Helsingborgs-Logo.png")
    club8 = Club(name='IF Elfsborg', nationality='Sweden',
                 logo="Elfsborg-Logo.png")
    club9 = Club(name='IFK Göteborg', nationality='Sweden',
                 logo="Goteborg-Logo.png")
    club10 = Club(name='IFK Norrköping', nationality='Sweden',
                  logo="Norrkoping-Logo.png")
    club11 = Club(name='IFK Värnamo', nationality='Sweden',
                  logo="Varnamo-Logo.png")
    club12 = Club(name='IK Sirius', nationality='Sweden',
                  logo="Sirius-Logo.png")
    club13 = Club(name='Kalmar FF', nationality='Sweden',
                  logo="Kalmar-Logo.png")
    club14 = Club(name='Malmö FF', nationality='Sweden', logo="Malmo-Logo.png")
    club15 = Club(name='Mjällby AIF', nationality='Sweden',
                  logo="Mjallby-Logo.png")
    club16 = Club(name='Varbergs BoIS', nationality='Sweden',
                  logo="Varbergs-Logo.png")

    club1.save()
    club2.save()
    club3.save()
    club4.save()
    club5.save()
    club6.save()
    club7.save()
    club8.save()
    club9.save()
    club10.save()
    club11.save()
    club12.save()
    club13.save()
    club14.save()
    club15.save()
    club16.save()

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
                 family_name='User1', age=25, email='test1@forzasys.no', club_id=16, total_points=0)
    user2 = User(password='TestP', given_name='Forzasys',
                 family_name='User2', age=25, email='test2@forzasys.no', club_id=16, total_points=1)
    user3 = User(password='TestP', given_name='Forzasys',
                 family_name='User3', age=25, email='test3@forzasys.no', club_id=16, total_points=2)
    user4 = User(password='TestP', given_name='Forzasys',
                 family_name='User4', age=25, email='test4@forzasys.no', club_id=16, total_points=3)
    user5 = User(password='TestP', given_name='Forzasys',
                 family_name='User5', age=25, email='test5@forzasys.no', club_id=2, total_points=6)
    user6 = User(password='TestP', given_name='piss',
                 family_name='bruker', age=25, email='piss.bruker@mail.com', club_id=16, total_points=0)
    user1.save()
    user2.save()
    user3.save()
    user4.save()
    user5.save()
    user6.save()
    user1.add_badge(badge1)
    user1.add_badge(badge6)

    video = Video(caption='Funny video', likes=0, views=0,
                  video='Random Video', user_id=1)
    video.save()

    question = Question(question='Hvem er eldst?', points=50)
    question.save()
    a1 = Answer(content='Henke', question_id=1, correct=True)
    a2 = Answer(content='Bugge', question_id=1, correct=False)
    a3 = Answer(content='Feppe', question_id=1, correct=False)
    a1.save()
    a2.save()
    a3.save()

    question = Question(
        question='Hvor mange lag er det i allsvenskan?', points=20)
    question.save()
    a1 = Answer(content='14', question_id=2, correct=False)
    a2 = Answer(content='15', question_id=2, correct=False)
    a3 = Answer(content='16', question_id=2, correct=True)
    a1.save()
    a2.save()
    a3.save()

    print('Added data to database')


if __name__ == '__main__':
    app.run(debug=True)
