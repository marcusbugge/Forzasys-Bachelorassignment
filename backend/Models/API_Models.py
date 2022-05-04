class Leaderboard(object):
    def __init__(self, user_id, rank, name, club, club_logo, points, username):
        self.user_id = user_id
        self.rank = rank
        self.name = name
        self.club = club
        self.club_logo = club_logo
        self.points = points
        self.username = username

class SupporterChallenge(object):
    def __init__(self, id, club_name, club_logo, supporter_count):
        self.id = id
        self.club_name = club_name
        self.club_logo = club_logo
        self.supporter_count = supporter_count


class PersonalScore(object):
    def __init__(self, id, name, profile_pic, overall_rank, club_id, club_name,
                club_logo, club_rank, total_points, role, username, badges, age, email, videos):
        self.id = id
        self.name = name
        self.profile_pic = profile_pic
        self.overall_rank = overall_rank
        self.club_id = club_id
        self.club_name = club_name
        self.club_logo = club_logo
        self.club_rank = club_rank
        self.total_points = total_points
        self.role = role
        self.username = username
        self.badges = badges
        self.age = age
        self.email = email
        self.videos = videos


class LeaderboardClub(object):
    def __init__(self, club_id, club_name, club_logo, club_points, club_rank, top_supporter_name, username):
        self.club_id = club_id
        self.club_name = club_name
        self.club_logo = club_logo
        self.club_points = club_points
        self.club_rank = club_rank
        self.top_supporter_name = top_supporter_name
        self.username = username



class Trivia(object):
    def __init__(self, question, answers, correct):
        self.question = question
        self.answers = answers
        self.correct = correct

class Followlist(object):
    def __init__(self, id, name, profile_pic, total_points, overall_rank, club_id, club_name, club_rank, club_logo, badges, badge_count, username):
        self.id = id
        self.name = name
        self.profile_pic = profile_pic
        self.total_points = total_points
        self.overall_rank = overall_rank
        self.club_id = club_id
        self.club_name = club_name
        self.club_rank = club_rank
        self.club_logo = club_logo
        self.badges = badges
        self.badge_count = badge_count
        self.username = username
  


class QuizLeaderboard(object):
    def __init__(self, id, participations, total_quiz_points, name, club_name, club_logo, username):
        self.id = id
        self.participations = participations
        self.total_quiz_points = total_quiz_points
        self.name = name
        self.club_name = club_name
        self.club_logo = club_logo
        self.username = username
    