from flask_restful import reqparse, fields


user_post_args = reqparse.RequestParser()
user_post_args.add_argument('given_name', type=str, help='Name of the user is required', required=True)
user_post_args.add_argument('family_name', type=str, help='Name of the user is required', required=True)
user_post_args.add_argument('email', type=str, help='Email of the user is required', required=True)
user_post_args.add_argument('age', type=int, help='Age of the user is required', required=True)
user_post_args.add_argument('team_id', type=int, help='Team of the user is required', required=True)

user_put_args = reqparse.RequestParser()
user_put_args.add_argument('given_name', type=str, help='Name of the user is required')
user_put_args.add_argument('family_name', type=str, help='Name of the user is required')
user_put_args.add_argument('email', type=str, help='Email of the user is required')
user_put_args.add_argument('age', type=int, help='Age of the user is required')
user_put_args.add_argument('team_id', type=int, help='Team of the user is required')

resource_fields_user = {
    'id' : fields.Integer,
    'given_name' : fields.String,
    'family_name' : fields.String,
    'email' : fields.String,
    'age' : fields.Integer,
    'team_id' : fields.Integer,
    'videos' : fields.String,
    'badges' : fields.String
}


video_post_args = reqparse.RequestParser()
video_post_args.add_argument('user_id', type=int, help='The user id is required', required=True)
video_post_args.add_argument('caption', type=str, help='This video does not have a caption')
video_post_args.add_argument('likes', type=int, help='Please put in likes on this video', required=True)
video_post_args.add_argument('views', type=int, help='Please put in views on this video', required=True)

video_put_args = reqparse.RequestParser()
video_put_args.add_argument('user_id', type=int, help='The user id is required')
video_put_args.add_argument('caption', type=str, help='This video does not have a caption')
video_put_args.add_argument('likes', type=int, help='Please put in likes on this video')
video_put_args.add_argument('views', type=int, help='Please put in views on this video')

resource_fields_video = {
    'id' : fields.Integer,
    'user_id' : fields.Integer,
    'caption' : fields.String,
    'likes' : fields.Integer,
    'views' : fields.Integer
}


badge_post_args = reqparse.RequestParser()
badge_post_args.add_argument('name', type=str, help='Name of the badge is required', required=True)
badge_post_args.add_argument('description', type=str, help='Description of the badge is required', required=True)
badge_post_args.add_argument('level', type=str, help='Level of the badge is required', required=True)
badge_post_args.add_argument('picture', type=str, help='Picture of the badge is required', required=True)
badge_post_args.add_argument('category', type=str, help='Category for the badge is required', required=True)
badge_post_args.add_argument('points_needed', type=int, help='Points needed for the badge is required', required=True)

badge_put_args = reqparse.RequestParser()
badge_put_args.add_argument('name', type=str, help='Name of the badge is required')
badge_put_args.add_argument('description', type=int, help='Decription of the badge is required')
badge_put_args.add_argument('level', type=str, help='Level of the badge is required')
badge_put_args.add_argument('picture', type=str, help='Picture of the badge is required')
badge_put_args.add_argument('category', type=str, help='Category for the badge is required')
badge_put_args.add_argument('points_needed', type=int, help='Points needed for the badge is required')

resource_fields_badge = {
    'id' : fields.Integer,
    'name' : fields.String,
    'description' : fields.String,
    'level' : fields.String,
    'picture' : fields.String,
    'category' : fields.String,
    'points_needed' : fields.Integer
}


team_post_args = reqparse.RequestParser()
team_post_args.add_argument('name', type=str, help='Name of the team is required', required=True)
team_post_args.add_argument('nickname', type=str, help='Nickname of the team is required', required=True)
team_post_args.add_argument('nationality', type=str, help='Nationality of the team is required', required=True)
team_post_args.add_argument('logo', type=str, help='Logo of the team is required', required=True)

team_put_args = reqparse.RequestParser()
team_put_args.add_argument('name', type=str, help='Name of the team is required')
team_put_args.add_argument('nickname', type=int, help='Nickname of the team is required')
team_put_args.add_argument('nationality', type=str, help='Nationality of the team is required')
team_put_args.add_argument('logo', type=str, help='Logo of the team is required')

resource_fields_team = {
    'id' : fields.Integer,
    'name' : fields.String,
    'nickname' : fields.String,
    'nationality' : fields.String,
    'logo' : fields.String,
    'supporters': fields.String
}
