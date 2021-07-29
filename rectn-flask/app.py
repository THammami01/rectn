import pandas as pd
from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
import json
from datetime import datetime

numberOfItemsPerPage = 12
today = datetime.today().strftime('%Y-%m-%d')  # 2021-06-19
# i["release_date"] <= today, or i["first_air_date"] <= today
# so that it does not include upcoming movies and tv shows

with open("movies_tvshows_db_flask.json", encoding="utf8") as f:
    global moviesAndTVShowsList
    moviesAndTVShowsList = json.load(f)

    # to make sure that each item has both keys
    for item in moviesAndTVShowsList:
        try:
            test = item["release_date"]
        except:
            item["release_date"] = ""

        try:
            test = item["first_air_date"]
        except:
            item["first_air_date"] = ""


# -----
# lambda est une function i parametre w liba3d'ha t7otelha chnow t7b traja3lk
# filtre function parametre loul function w parametre thenya ta3teha list mta3 filtrage
recommendedMoviesList = list(
    filter(
        lambda i: i["media_type"] == "movie" and i["release_date"] <= today,
        moviesAndTVShowsList
    )
)

topRatedMoviesList = sorted(
    recommendedMoviesList,
    key=lambda i: i["vote_average"],
    reverse=True
)

newReleasedMoviesList = sorted(
    recommendedMoviesList,
    key=lambda i: i["release_date"],
    reverse=True
)

# -----

actionMoviesList = list(
    filter(
        lambda i: 28 in i["genre_ids"],
        recommendedMoviesList
    )
)

dramaMoviesList = list(
    filter(
        lambda i: 18 in i["genre_ids"],
        recommendedMoviesList
    )
)

horrorMoviesList = list(
    filter(
        lambda i: 27 in i["genre_ids"],
        recommendedMoviesList
    )
)

comedyMoviesList = list(
    filter(
        lambda i: 35 in i["genre_ids"],
        recommendedMoviesList
    )
)

familyMoviesList = list(
    filter(
        lambda i: 10751 in i["genre_ids"],
        recommendedMoviesList
    )
)

# -----

recommendedTVShowsList = list(
    filter(
        lambda i: i["media_type"] == "tv" and i["first_air_date"] <= today,
        moviesAndTVShowsList
    )
)

topRatedTVShowsList = sorted(
    recommendedTVShowsList,
    key=lambda i: i["vote_average"],
    reverse=True
)

newReleasedTVShowsList = sorted(
    recommendedTVShowsList,
    key=lambda i: i["release_date"],
    reverse=True
)

# -----

crimeTVShowsList = list(
    filter(
        lambda i: 80 in i["genre_ids"],
        recommendedTVShowsList
    )
)

dramaTVShowsList = list(
    filter(
        lambda i: 18 in i["genre_ids"],
        recommendedTVShowsList
    )
)

sciFiAndFantasyTVShowsList = list(
    filter(
        lambda i: 10765 in i["genre_ids"],
        recommendedTVShowsList
    )
)

actionAndAdventureTVShowsList = list(
    filter(
        lambda i: 10759 in i["genre_ids"],
        recommendedTVShowsList
    )
)

familyTVShowsList = list(
    filter(
        lambda i: 10751 in i["genre_ids"],
        recommendedTVShowsList
    )
)

# -----


def getPage(mediaList, pageNumber):
    # e.g. 0 * 12 = 0, 1 * 12 = 12, 2 * 12 = 24 (list index of the first item in the page)
    firstItem = (int(pageNumber) - 1) * numberOfItemsPerPage
    # e.g. [0:12] (returns a sublist containing 12 items)
    return mediaList[firstItem:firstItem+numberOfItemsPerPage]


# Get Media Details Object by its ID
def getMediaById(mediaId):
    mediaId = int(mediaId)
    return list(
        filter(
            lambda i: int(i["id"]) == mediaId,
            moviesAndTVShowsList
        )
    )[0]


# ====================================
# ===== RECOMMENDATION ALGORITHM =====
# ====================================


df1 = pd.read_csv('fake_users_ratings_final.csv')
df2 = pd.read_csv("movies_tvshows_db_final.csv")
df = pd.merge(df1, df2, on='item_id')

ratings = pd.DataFrame(df.groupby('item_id')['rating'].mean())

ratings['Nb of Ratings'] = pd.DataFrame(
    df.groupby('item_id')['rating'].count()
)

moviemat = df.pivot_table(index='user_id', columns='item_id', values='rating')


def getRecommendedListIds(mediaId):
    media_user_ratings = moviemat[int(mediaId)]
    similar_to_media = moviemat.corrwith(media_user_ratings)
    corr_media = pd.DataFrame(similar_to_media, columns=['Correlation'])
    corr_media.dropna(inplace=True)
    corr_media = corr_media.join(ratings['Nb of Ratings'])
    corr_media = corr_media[corr_media['Nb of Ratings'] > 100].sort_values(
        'Correlation', ascending=False).head(7)
    temp = corr_media.reset_index("item_id").values.tolist()
    return list(map(lambda x: int(x[0]), temp))[1:]


# ====================================
# ====================================
# ====================================

app = Flask(__name__)  # To Create Flask App
cors = CORS(app)
app.config["CORS_HEADERS"] = "Content-Type"
# CORS stands for Cross-Origin Resource Sharing.
# It allows you to make requests from one website to another website in the browser,
# which is normally prohibited by a browser policy
print("Server started successfully.")


@ app.route("/")  # To see if your app is running or not
@ cross_origin()
def home():
    return jsonify(
        {
            "status": "running",
            "message": "RECTN app is running successfully."
        }
    )


@app.route("/top-trending")  # To get carousel's 4 items
@cross_origin()
def topTrendingMovies():
    return jsonify(moviesAndTVShowsList[0:4]), 200


# Get the details of a movie/tv show by its ID
@app.route("/media/<mediaId>")
@cross_origin()
def getSingleMedia(mediaId):
    singleItem = getMediaById(mediaId)
    return jsonify(singleItem), 200


# ----- Recommended, Top Rated, New Relases


@app.route("/<media>/recommended/page/<pageNumber>")
@cross_origin()
def recommendedMedias(media, pageNumber):
    if(media == "movie"):
        data = getPage(recommendedMoviesList, pageNumber)
    else:
        data = getPage(recommendedTVShowsList, pageNumber)

    return jsonify(data), 200


@app.route("/<media>/top-rated/page/<pageNumber>")
@cross_origin()
def topRatedMedias(media, pageNumber):
    if(media == "movie"):
        data = getPage(topRatedMoviesList, pageNumber)
    else:
        data = getPage(topRatedTVShowsList, pageNumber)

    return jsonify(data), 200


@app.route("/<media>/new-releases/page/<pageNumber>")
@cross_origin()
def newReleasedMedias(media, pageNumber):
    if(media == "movie"):
        data = getPage(newReleasedMoviesList, pageNumber)
    else:
        data = getPage(newReleasedTVShowsList, pageNumber)

    return jsonify(data), 200


# ----- Drama, Action, Family, etc.


@app.route("/<media>/drama/page/<pageNumber>")
@cross_origin()
def dramaMedias(media, pageNumber):
    if(media == "movie"):
        data = getPage(dramaMoviesList, pageNumber)
    else:
        data = getPage(dramaTVShowsList, pageNumber)

    return jsonify(data), 200


@app.route("/<media>/family/page/<pageNumber>")
@cross_origin()
def familyMedias(media, pageNumber):
    if(media == "movie"):
        data = getPage(familyMoviesList, pageNumber)
    else:
        data = getPage(familyTVShowsList, pageNumber)

    return jsonify(data), 200


@app.route("/movie/action/page/<pageNumber>")
@cross_origin()
def actionMedias(pageNumber):
    data = getPage(actionMoviesList, pageNumber)
    return jsonify(data), 200


@app.route("/movie/horror/page/<pageNumber>")
@cross_origin()
def horrorMedias(pageNumber):
    data = getPage(horrorMoviesList, pageNumber)
    return jsonify(data), 200


@app.route("/movie/comedy/page/<pageNumber>")
@cross_origin()
def comedyMedias(pageNumber):
    data = getPage(comedyMoviesList, pageNumber)
    return jsonify(data), 200


@app.route("/tv/action-and-adventure/page/<pageNumber>")
@cross_origin()
def actionAndAdventureMedias(pageNumber):
    data = getPage(actionAndAdventureTVShowsList, pageNumber)
    return jsonify(data), 200


@app.route("/tv/crime/page/<pageNumber>")
@cross_origin()
def crimeMedias(pageNumber):
    data = getPage(crimeTVShowsList, pageNumber)
    return jsonify(data), 200


@app.route("/tv/sci-fi-and-fantasy/page/<pageNumber>")
@cross_origin()
def sciFiAndFantasyTVShowsListMedias(pageNumber):
    data = getPage(sciFiAndFantasyTVShowsList, pageNumber)
    return jsonify(data), 200


# -----


# @app.route("/search/<title>")
# @cross_origin()
# def search(title):
#     try:
#         data = list(
#             filter(
#                 lambda i: title in i["title"],
#                 moviesAndTVShowsList
#             )
#         )
#     except:
#         data = list(
#             filter(
#                 lambda i: title in i["name"],
#                 moviesAndTVShowsList
#             )
#         )

#     return jsonify(data), 200


# -----


# ID of the movie/tv show to recommend from
# To get a list that contains 6 recommended movies IDs
@app.route("/similar-medias/<mediaId>") 
@cross_origin()
def similarMedias(mediaId):
    mediaList = getRecommendedListIds(mediaId)

    mediaList = list(
        map(lambda x: getMediaById(x), mediaList)
    )
    return jsonify(mediaList), 200


# Used in Favorites page
@app.route("/medias-from-ids", methods=["POST"])
@cross_origin()
def mediasFromIds():
    mediasIds = json.loads(request.data)
    
    mediasList = list(
        map(lambda x: getMediaById(x), mediasIds)
    )
    return jsonify(mediasList), 200


app.run(debug=True, port=5000)
