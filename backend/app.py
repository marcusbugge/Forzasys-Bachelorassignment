import asyncio
from flask import jsonify
from db import db, app
from models.UserModel import User
from models.ClubModel import Club
from models.BadgeModel import Badge
from models.QuestionModel import Question
from models.AnswerModel import Answer
from services import BadgeService
from controllers import UserController, ClubController, BadgeController, QuizController, LeaderboardController


#<------------------------------ COMMENTS? ------------------------------>
"""
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
"""

@app.route('/api/')
@app.errorhandler(404)
def not_found(error):
    return jsonify({'message': 'Resource not found'}), 404

@app.route('/api/')
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
        BadgeService.give_user_badge("points", user.total_points, user.id)

    print('Added data to database')


if __name__ == '__main__':
    app.run(debug=True)
    loop = asyncio.get_event_loop()
    loop.run_until_complete(UserController.login())
    loop.run_until_complete(UserController.get_all_users())
    loop.run_until_complete(UserController.get_user())
    loop.run_until_complete(UserController.update_user())
    loop.run_until_complete(UserController.create_user())
    loop.run_until_complete(UserController.get_user_by_username())
    loop.run_until_complete(UserController.delete_user())
    loop.run_until_complete(UserController.follow_user())
    loop.run_until_complete(UserController.follow_table())
    loop.run_until_complete(UserController.like_video())
    loop.run_until_complete(ClubController.get_all_clubs())
    loop.run_until_complete(ClubController.create_club())
    loop.run_until_complete(ClubController.get_one_club())
    loop.run_until_complete(ClubController.update_club())
    loop.run_until_complete(ClubController.delete_club())
    loop.run_until_complete(LeaderboardController.get_leaderboard())
    loop.run_until_complete(LeaderboardController.supporter_leaderboard())
    loop.run_until_complete(LeaderboardController.leaderboard_clubs())
    loop.run_until_complete(LeaderboardController.most_supporters())
    loop.run_until_complete(BadgeController.get_all_badges())
    loop.run_until_complete(BadgeController.create_badge())
    loop.run_until_complete(BadgeController.get_badge())
    loop.run_until_complete(BadgeController.update_badge())
    loop.run_until_complete(BadgeController.delete_badge())
    loop.run_until_complete(QuizController.get_questions())
    loop.run_until_complete(QuizController.all_questions())
    loop.run_until_complete(QuizController.submit_quiz())
    loop.run_until_complete(QuizController.create_question())
    loop.run_until_complete(QuizController.delete_question())
    loop.run_until_complete(QuizController.edit_question())
    loop.run_until_complete(QuizController.get_answers())
    loop.run_until_complete(QuizController.edit_answers())
    loop.run_until_complete(QuizController.get_quiz_leaderboard_points())
    loop.run_until_complete(QuizController.get_quiz_leaderboard_participations())
    loop.close()
