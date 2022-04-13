import asyncio
from flask import request, jsonify
from flask_cors import CORS
from db import db, app
from Models.Models_DB import User, UserSchema, Club, ClubSchema, Video, VideoSchema, Badge, BadgeSchema, Comment, CommentSchema, Reply, ReplySchema, Question, QuestionSchema, Answer, AnswerSchema
from Reposotories import UserRepo, BadgeRepo, ClubRepo, QuizRepo, VideoRepo

CORS(app)

#<------------------------------ USERS ------------------------------>

@app.route('/api/login', methods=['POST'])
async def login():
    return UserRepo.login(request.json)
    

@app.route('/api/users', methods=['GET'])
async def get_all_users():
    users = User.get_all()
    serializer = UserSchema(many=True)
    result = serializer.dump(users)
    return jsonify(result), 200


@app.route('/api/user', methods=['POST'])
async def create_user():
    data = request.json
    newUser = User(
        password=data['password'],
        given_name=data['given_name'],
        family_name=data['family_name'],
        total_points=0,
        age=data['age'],
        email=data['email'],
        club_id=data['club_id'],
        role = data['role'],
        username = data['username']
    )

    newUser.save()

    serializer = UserSchema()
    result = serializer.dump(newUser)

    return jsonify(result), 201


@app.route('/api/user/<int:id>', methods=['GET'])
async def get_user(id):
    user = User.get_by_id(id)
    serializer = UserSchema()
    result = serializer.dump(user)

    return jsonify(result), 200


@app.route('/api/user/<int:id>', methods=['PUT'])
async def update_user(id):
    data = request.json
    user_to_uptdate = User.get_by_id(id)
    if 'name' in data:
        name = data['name']
        words = name.split()
        if len(words) == 2:
            user_to_uptdate.given_name = words[0]
            user_to_uptdate.family_name = words[1]
        else:
            user_to_uptdate.given_name = ""
            for i in range(len(words) - 1):
                user_to_uptdate.given_name += words[i] + " "
                user_to_uptdate.family_name = words[len(words) - 1]
    if 'password' in data:
        user_to_uptdate.password = data['password']
    if 'age' in data:
        user_to_uptdate.age = data['age']
    if 'club_id' in data:
        user_to_uptdate.club_id = data['club_id']
    if 'email' in data:
        user_to_uptdate.email = data['email']

    db.session.commit()

    serializer = UserSchema()
    result = serializer.dump(user_to_uptdate)
    return jsonify(result), 200
    

@app.route('/api/user/<int:id>', methods=['DELETE'])
async def delete_user(id):
    user_to_delete = User.get_by_id(id)
    user_to_delete.delete()

    return jsonify({
        'message': 'deleted'
    }), 204


@app.route('/api/user/<string:username>', methods=['GET'])
async def get_user_by_username(username):
    user = User.query.filter_by(username=username).first()
    users = User.get_all()
    return UserRepo.get_idividual_score(user, users)


@app.route('/api/user/follow/<int:id>', methods=['PUT'])
async def follow_user(id):
    user_to_follow = User.get_by_id(id)
    data = request.json
    user_following = User.get_by_id(data['user_id'])
    user_following.follow(user_to_follow)
    return jsonify({
        'message': 'Following'
    }), 200


@app.route('/api/followers/<int:id>', methods=['GET'])
async def follow_table(id):
    return UserRepo.follow_table(id)
    

@app.route('/api/user/like_video/<int:user_id>', methods=['POST'])
async def like_video(user_id):
    data = request.json
    if VideoRepo.like_video(user_id, data['video_url']):
        return jsonify({'message' : 'Video liked'}), 200
    else:
        return jsonify({'message' : 'There is a problem'}), 500


#<------------------------------ CLUBS ------------------------------>


@app.route('/api/clubs', methods=['GET'])
async def get_all_clubs():
    clubs = Club.get_all()
    serializer = ClubSchema(many=True)
    result = serializer.dump(clubs)
    return jsonify(result), 200


@app.route('/api/club', methods=['POST'])
async def create_club():
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
async def get_one_club(id):
    club = Club.get_by_id(id)
    serializer = ClubSchema()
    result = serializer.dump(club)
    return jsonify(result), 200


@app.route('/api/club/<int:id>', methods=['PUT'])
async def update_club(id):
    club_to_uptdate = Club.get_by_id(id)
    data = request.json

    if 'name' in data and data['name'] != "":
        club_to_uptdate.name = data['name']
    if 'nationality' in data and data['nationality'] != "":
        club_to_uptdate.nationality = data['nationality']
    if 'logo' in data and data['logo'] != "":
        club_to_uptdate.logo = data['logo']

    db.session.commit()

    serializer = ClubSchema()
    result = serializer.dump(club_to_uptdate)
    return jsonify(result), 200


@app.route('/api/club/<int:id>', methods=['DELETE'])
async def delete_club(id):
    club_to_delete = Club.get_by_id(id)
    club_to_delete.delete()

    return jsonify({
        'message': 'deleted'
    }), 204


@app.route('/api/leaderboard/<int:start>/<int:end>')
async def get_leaderboard(start, end):
    return ClubRepo.get_leaderboard(start, end)


@app.route('/api/leaderboard/<int:club_id>', methods=['GET'])
async def supporter_leaderboard(club_id):
    return ClubRepo.supporter_leaderboard(club_id)


@app.route('/api/leaderboard/sortbyclub/<int:start>/<int:end>', methods=['GET'])
async def leaderboard_clubs(start, end):
    return ClubRepo.leaderboard_clubs(start, end)


@app.route('/api/most_supporters', methods=['GET'])
async def most_supporters():
    return ClubRepo.most_supporters()



#<------------------------------ VIDEOS ------------------------------>


@app.route('/api/videos', methods=['GET'])
def get_all_videos():
    videos = Video.get_all()
    serializer = VideoSchema(many=True)
    result = serializer.dump(videos)
    return jsonify(result), 200


@app.route('/api/video', methods=['POST'])
async def create_video():
    data = request.json
    newVideo = Video(
        video=data['video']
    )

    newVideo.save()

    return jsonify(success=True), 201


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

    if 'user_id' in data and data['user_id'] != "":
        video_to_uptdate.user_id = data['user_id']
    if 'caption' in data and data['caption'] != "":
        video_to_uptdate.caption = data['caption']
    if 'likes' in data and data['likes'] != "":
        video_to_uptdate.likes = data['likes']
    if 'views' in data and data['views'] != "":
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


@app.route('/api/video/like/<int:user_id>/<int:video_id>', methods=['PUT'])
def like_a_video(user_id, video_id):
    video_to_uptdate = Video.get_by_id(video_id)
    video_to_uptdate.likes += 1
    user = User.get_by_id(user_id)
    user.like_video(video_to_uptdate)
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


@app.route('/api/videos/user/<int:user_id>', methods=['GET'])
async def get_users_videos(user_id):
    user = User.get_by_id(user_id)
    serializer = VideoSchema(many=True)
    result = serializer.dump(user.videos)
    return jsonify(result), 200


#<------------------------------ BADGES ------------------------------>


@app.route('/api/badges', methods=['GET'])
async def get_all_badges():
    badges = Badge.get_all()
    serializer = BadgeSchema(many=True)
    result = serializer.dump(badges)
    return jsonify(result), 200


@app.route('/api/badge', methods=['POST'])
async def create_badge():
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
async def get_badge(id):
    badge = Badge.get_by_id(id)
    serializer = BadgeSchema()
    result = serializer.dump(badge)

    return jsonify(result), 200


@app.route('/api/badges/user/<int:id>', methods=['GET'])
def get_users_badges(id):
    return BadgeRepo.get_users_badges(id)


@app.route('/api/badge/<int:id>', methods=['PUT'])
def update_badge(id):
    badge_to_uptdate = Badge.get_by_id(id)
    data = request.json

    if 'name' in data and data['name'] != "":
        badge_to_uptdate.name = data['name']
    if 'description' in data and data['description'] != "":
        badge_to_uptdate.description = data['description']
    if 'level' in data and data['level'] != "":
        badge_to_uptdate.level = data['level']
    if 'picture' in data and data['picture'] != "":
        badge_to_uptdate.picture = data['picture']
    if 'category' in data and data['category'] != "":
        badge_to_uptdate.category = data['category']
    if 'points_needed' in data and data['points_needed'] != "":
        badge_to_uptdate.points_needed = data['points_needed']

    db.session.commit()
    badges = Badge.get_all()
    serializer = BadgeSchema(many=True)
    result = serializer.dump(badges)
    return jsonify(result), 200


@app.route('/api/badge/<int:id>', methods=['DELETE'])
def delete_badge(id):
    badge_to_delete = Badge.get_by_id(id)
    badge_to_delete.delete()

    return jsonify({
        'message': 'deleted'
    }), 204



#<------------------------------ COMMENTS? ------------------------------>

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



#<------------------------------ QUIZ/ TRIVIA ------------------------------>

@app.route('/api/trivia/data/<int:user_id>', methods=['GET'])
def get_questions(user_id):
    return QuizRepo.get_questions(user_id)


@app.route('/api/quizes', methods=['GET'])
def all_questions():
    questions = Question.get_all()
    serializer = QuestionSchema(many=True)
    result = serializer.dump(questions)

    return  jsonify(result), 200


@app.route('/api/submitQuiz/<int:user_id>', methods=['POST'])
def submit_quiz(user_id):
    return QuizRepo.submit_quiz(user_id, request.json)


@app.route('/api/question', methods=['POST'])
def create_question():
    data = request.json
    newQuestion = Question(
        question=data['question'],
    )
    newQuestion.save()

    for answer in data['answers']:
        newAnswer = Answer(
            question_id = newQuestion.id,
            content = answer['content'],
            correct = answer['correct']
        )
        newAnswer.save()

    return jsonify({'message': 'Question made'}), 200


@app.route('/api/question/<int:id>', methods=['DELETE'])
def delete_question(id):
    question = Question.get_by_id(id)
    question.delete()

    return jsonify({
        'message': 'deleted'
    }), 204


@app.route('/api/question/<int:id>', methods=['PUT'])
def edit_question(id):
    question_to_update = Question.get_by_id(id)
    data = request.json

    if 'question' in data and data['question'] != "":
        question_to_update.question = data['question']
    db.session.commit()

    questions = Question.get_all()
    serializer = QuestionSchema(many=True)
    result = serializer.dump(questions)

    return jsonify(result), 201
    

@app.route('/api/answers', methods=['GET'])
def get_answers():
    answers = Answer.get_all()
    serializer = AnswerSchema(many=True)
    result = serializer.dump(answers)
    return jsonify(result), 200

@app.route('/api/answers/<int:question_id>', methods=['PUT'])
def edit_answers(question_id):
    data = request.json
    question = Question.get_by_id(question_id)
    answers = question.answers
    i = 0
    while i < 4:
        answer = Answer.get_by_id(answers[i].id)
        if data[i]['content'] != "":
            answer.content = data[i]['content']
        answer.correct = data[i]['correct']
        db.session.commit()
        i+=1

    return jsonify({'message': 'Answers updated'}), 201


@app.route('/api/quiz/leaderboard/points', methods=['GET'])
def get_quiz_leaderboard_points():
    return QuizRepo.get_quiz_leaderboard_points()


@app.route('/api/quiz/leaderboard/participations', methods=['GET'])
def get_quiz_leaderboard_participations():
    return QuizRepo.get_quiz_leaderboard_participations()


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

    Club(name='AIK Fotboll', nationality='Sweden', logo="AIK-Logo.png").save()
    Club(name='BK Häcken', nationality='Sweden', logo="Hacken-Logo.png").save()
    Club(name='Degerfors IF', nationality='Sweden', logo="Degerfors-Logo.png").save()
    Club(name='Djurgårdens IF Fotboll', nationality='Sweden', logo="Djurgardens-Logo.png").save()
    Club(name='GIF Sundsvall', nationality='Sweden', logo="Sundsvall-Logo.png").save()
    Club(name='Hammarby IF', nationality='Sweden', logo="Hammarby-Logo.png").save()
    Club(name='Helsingborgs IF', nationality='Sweden', logo="Helsingborgs-Logo.png").save()
    Club(name='IF Elfsborg', nationality='Sweden', logo="Elfsborg-Logo.png").save()
    Club(name='IFK Göteborg', nationality='Sweden', logo="Goteborg-Logo.png").save()
    Club(name='IFK Norrköping', nationality='Sweden', logo="Norrkoping-Logo.png").save()
    Club(name='IFK Värnamo', nationality='Sweden', logo="Varnamo-Logo.png").save()
    Club(name='IK Sirius', nationality='Sweden', logo="Sirius-Logo.png").save()
    Club(name='Kalmar FF', nationality='Sweden', logo="Kalmar-Logo.png").save()
    Club(name='Malmö FF', nationality='Sweden', logo="Malmo-Logo.png").save()
    Club(name='Mjällby AIF', nationality='Sweden', logo="Mjallby-Logo.png").save()
    Club(name='Varbergs BoIS', nationality='Sweden', logo="Varbergs-Logo.png").save()


    Badge(name='Lage bruker', description='Lag en bruker hos forzasys', level=0,
                   picture='Setup.png', category='null', points_needed=0).save()
    Badge(name='Medlem', description='Samle ditt første poeng', level=0,
                    picture='normal.png', category='points', points_needed=1).save()
    Badge(name='Bronse medlem', description='Samle 100 poeng', level=1,
                   picture='Bronze.png', category='points', points_needed=100).save()
    Badge(name='Sølv medlem', description='Samle 500 poeng', level=2,
                   picture='Silver.png', category='points', points_needed=500).save()
    Badge(name='Gull medlem', description='Samle 1000 poeng', level=3,
                   picture='Gold.png', category='points', points_needed=1000).save()
    Badge(name='Platinum medlem', description='Samle 2500 poeng', level=4,
                   picture='Platinum.png', category='points', points_needed=2500).save()
    Badge(name='Diamant medlem', description='Samle 5000 poeng', level=5,
                   picture='Diamond.png', category='points', points_needed=5000).save()
    Badge(name='Første quiz', description='Delta på en quiz', level=0,
                    picture='quiz-normal.png', category='quiz', points_needed=1).save()
    Badge(name='Første quiz', description='Delta på quiz 5 ganger', level=1,
                    picture='quiz-bronze.png', category='quiz', points_needed=5).save()
    Badge(name='Quiz-deltakelse sølv', description='Delta på quiz 25 ganger', level=2,
                    picture='quiz-silver.png', category='quiz', points_needed=25).save()
    Badge(name='Quiz-deltakelse gull', description='Delta på quiz 50 ganger', level=3,
                    picture='quiz-gold.png', category='quiz', points_needed=50).save()
    Badge(name='Quiz-deltakelse platinum', description='Delta på quiz 100 ganger', level=4,
                    picture='quiz-plat.png', category='quiz', points_needed=100).save()
    Badge(name='Quiz-deltakelse Diamant', description='Delta på quiz 250 ganger', level=5,
                    picture='quiz-diamond.png', category='quiz', points_needed=250).save()
    Badge(name='Full pott', description='Få alt riktig på en quiz', level=0,
                    picture='quizExpert-normal.png', category='quizExpert', points_needed=1).save()
    Badge(name='Full pott Bronse', description='Få alt riktig på quiz 5 ganger', level=1,
                    picture='quizExpert-bronze.png', category='quizExpert', points_needed=5).save()
    Badge(name='Full pott Sølv', description='Få alt riktig på quiz 10 ganger', level=2,
                    picture='quizExpert-silver.png', category='quizExpert', points_needed=10).save()
    Badge(name='Full pott Gull', description='Få alt riktig på quiz 25 ganger', level=3,
                    picture='quizExpert-gold.png', category='quizExpert', points_needed=25).save()
    Badge(name='Full pott Platinum', description='Få alt riktig på quiz 50 ganger', level=4,
                    picture='quizExpert-plat.png', category='quizExpert', points_needed=50).save()
    Badge(name='Full pott Diamant', description='Få alt riktig på quiz 100 ganger', level=5,
                    picture='quizExpert-diamond.png', category='quizExpert', points_needed=100).save()


    user1 = User(password='TestP', given_name='Forzasys', family_name='Admin', age=25, 
                email='admin@forzasys.no', club_id=1, total_points=0, role="admin", username="adminUser")
    user2 = User(password='TestP', given_name='Forzasys', family_name='User2', age=25, 
                email='test2@forzasys.no', club_id=13, total_points=11, role="user", username="test2")
    user3 = User(password='TestP', given_name='Forzasys', family_name='User3', age=25, 
                email='test3@forzasys.no', club_id=1, total_points=25, role="user",username="test3")
    user4 = User(password='TestP', given_name='Forzasys', family_name='User4', age=25, 
                email='test4@forzasys.no', club_id=9, total_points=37, role="user",username="test4")
    user5 = User(password='TestP', given_name='Forzasys', family_name='User5', age=25, 
                email='test5@forzasys.no', club_id=2, total_points=69, role="user", username="test5")
    user6 = User(password='TestP', given_name='Harry', family_name='Potter', age=20, 
                email='harry.potter@trollmann.com', club_id=14, total_points=40, profile_pic='potter-pic.png', role="user", username="GuttenSomOverlevde")
    user8 = User(password='TestP', given_name='Ronny', family_name='Wiltersen', age=20, 
                email='ronny.wiltersen@trollmann.com', club_id=2, total_points=13, profile_pic='ronny-pic.png', role="user", username="Drømmeprinsen69")
    user7 = User(password='TestP', given_name='Nilus', family_name='Langballe', age=20, 
                email='nilus.langballe@trollmann.com', club_id=7, total_points=6, profile_pic='langballe-pic.png', role="user",username="Langballe.N")
    user9 = User(password='TestP', given_name='Frodo', family_name='Baggins', age=20, 
                email='frodo.baggins@LOTR.com', club_id=7, total_points=100, profile_pic='frodo-pic.png', role="user",username="HobbitKing")
    user10 = User(password='TestP', given_name='Bilbo', family_name='Baggins', age=20, 
                email='bilbo.baggins@LOTR.com', club_id=11, total_points=1, profile_pic='bilbo-pic.png', role="user",username="LoveTheRing")
    user11 = User(password='TestP', given_name='Tony', family_name='Stark', age=20, 
                email='iron.man@marvel.com', club_id=2, total_points=400, profile_pic='ironman-pic.png', role="user",username="IronMan")
    user12 = User(password='TestP', given_name='Jon', family_name='Snow', age=20, 
                email='jon.snow@bastard.com', club_id=3, total_points=1, profile_pic='snow-pic.png', role="user",username="JonSnow")
    user13 = User(password='TestP', given_name='Ned', family_name='Stark', age=20, 
                email='ned.stark@winterfell.com', club_id=8, total_points=70, profile_pic='nedstark-pic.png', role="user",username="WinterIsComing")
    user14 = User(password='TestP', given_name='Henke', family_name='Madsen', age=20, 
                email='henkem@DNB.no', club_id=12, total_points=65, role="user",username="HenkeFraTønsberg")
    user15 = User(password='TestP', given_name='Peter', family_name='Parker', age=20, 
                email='peter.parker@spiderman.com', club_id=15, total_points=14, profile_pic='peterparker-pic.png', role="user",username="NotSpiderman")
    user16 = User(password='TestP', given_name='Cristiano', family_name='Ronaldo', age=37, 
                email='cristiano.ronaldo7@sui.com', club_id=1, total_points=50, profile_pic='cr7-pic.png', role="user",username="CristoRonaldoSui")
    user17 = User(password='TestP', given_name='Lionel', family_name='Messi', age=36, 
                email='messi10@PSG.com', club_id=6, total_points=51, profile_pic='messi-pic.png', role="user",username="LeoMessi10")
    user18 = User(password='TestP', given_name='Marcus', family_name='Bugge', age=22, 
                email='buggemann@TAE.no', club_id=4, total_points=47, role="user",username="TaeBugge")
    user19 = User(password='TestP', given_name='Fredrik', family_name='Brinch', age=18, 
                email='feppe@TAE.no', club_id=11, total_points=49, role="user",username="TaeFeppe")
    user19 = User(password='TestP', given_name='Neymar', family_name='Jr', age=28, 
                email='jr.Neymar@PSG.com', club_id=7, total_points=32, profile_pic='neymar-pic.png', role="user",username="NeyNeyBrazil")
    user20 = User(password='TestP', given_name='Gandalf', family_name='The White', age=104, 
                email='gandalf@LOTR.com', club_id=8, total_points=932, profile_pic = 'gandalf-pic.png', role="user",username="GandalfTheWhite")
    user21 = User(password='TestP', given_name='Joe', family_name='Biden', age=103, 
                email='biden@whitehouse.com', club_id=3, total_points=1, profile_pic='biden-pic.png', role="user",username="SleepyJoe")
    user22 = User(password='TestP', given_name='Bat', family_name='Man', age=20, 
                email='batman@penger.no', club_id=11, total_points=12, profile_pic='batman-pic.png', role="user",username="I'mBatman")

    user1.save()
    user2.save()
    user3.save()
    user4.save()
    user5.save()
    user6.save()
    user7.save()
    user8.save()
    user9.save()
    user10.save()
    user11.save()
    user12.save()
    user13.save()
    user14.save()
    user15.save()
    user16.save()
    user18.save()
    user17.save()
    user19.save()
    user20.save()
    user21.save()
    user22.save()
    user8.follow(20)
    user13.follow(20)
    user15.follow(20)
    user6.follow(20)
    user17.follow(20)
    user21.follow(20)



    Question(question='Hvem vant Allsvenskan i år 2000?').save()
    Answer(content='Halmstad', question_id=1, correct=True).save()
    Answer(content='Malmö FF', question_id=1, correct=False).save()
    Answer(content='AIK', question_id=1, correct=False).save()
    Answer(content='Varbergs Bois', question_id=1, correct=False).save()

    Question(question='Hvor mange lag er det i allsvenskan?').save()
    Answer(content='14', question_id=2, correct=False).save()
    Answer(content='15', question_id=2, correct=False).save()
    Answer(content='16', question_id=2, correct=True).save()
    Answer(content='17', question_id=2, correct=False).save()

    Question(question='Når ble Allsvenskan grunnlagt?').save()
    Answer(content='1921', question_id=3, correct=False).save()
    Answer(content='1922', question_id=3, correct=False).save()
    Answer(content='1923', question_id=3, correct=False).save()
    Answer(content='1924', question_id=3, correct=True).save()

    Question(question='Hvilket år scoret Zlatan sitt første mål på elitenivå?').save()
    Answer(content='1997', question_id=4, correct=False).save()
    Answer(content='1998', question_id=4, correct=False).save()
    Answer(content='1999', question_id=4, correct=True).save()
    Answer(content='2000', question_id=4, correct=False).save()
    
    Question(question='I 1925 satte Filip Johansson en utrolig målrekord, hvor mange mål scoret han den sessongen?').save()
    Answer(content='38', question_id=5, correct=False).save()
    Answer(content='39', question_id=5, correct=True).save()
    Answer(content='40', question_id=5, correct=False).save()
    Answer(content='41', question_id=5, correct=False).save()

    Question(question='Hvilket lag har flest titler i Allsvenskan?').save()
    Answer(content='Malmø FF', question_id=6, correct=True).save()
    Answer(content='Halmstad', question_id=6, correct=False).save()
    Answer(content='AIK', question_id=6, correct=False).save()
    Answer(content='IFK Göteborg', question_id=6, correct=False).save()


    users = User.get_all()
    for user in users:
        BadgeRepo.give_user_badge("points", user.total_points, user.id)

    print('Added data to database')


if __name__ == '__main__':
    app.run(debug=True)
    loop = asyncio.get_event_loop()
    loop.run_until_complete(login())
    loop.run_until_complete(get_all_users())
    loop.run_until_complete(get_user())
    loop.run_until_complete(update_user())
    loop.run_until_complete(create_user())
    loop.run_until_complete(get_user_by_username())
    loop.run_until_complete(delete_user())
    loop.run_until_complete(follow_user())
    loop.run_until_complete(follow_table())
    loop.run_until_complete(like_video())
    loop.run_until_complete(get_all_clubs())
    loop.run_until_complete(create_club())
    loop.run_until_complete(get_one_club())
    loop.run_until_complete(update_club())
    loop.run_until_complete(delete_club())
    loop.run_until_complete(get_leaderboard())
    loop.run_until_complete(supporter_leaderboard())
    loop.run_until_complete(leaderboard_clubs())
    loop.run_until_complete(most_supporters())
    loop.run_until_complete(create_video())
    loop.run_until_complete(get_users_videos())
    loop.run_until_complete(get_all_badges())
    loop.run_until_complete(create_badge())
    loop.run_until_complete(get_badge())
    loop.close()
