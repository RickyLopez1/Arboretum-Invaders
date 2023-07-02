
# Import Flask
from flask import Flask, render_template, request
app = Flask(__name__)

# Import SQL
import sqlite3

import json

conn = sqlite3.connect('private/database/highscore.db')
cursor = conn.cursor()
cursor.execute(''' SELECT count(name) FROM sqlite_master WHERE type='table' AND name='scores' ''')
if cursor.fetchone()[0]==1 :
    conn.close()
else:
    cursor.execute('create table scores (name1 text,name2 text,score1 text, score2 text, total text)')
    for i in range (10):
        cursor.execute('insert into scores (name1,name2,score1,score2,total) values ("-----","-----","0","0","0")')
    conn.commit()
    conn.close()


global game_info
global client_info
client_info = {"players_present": 0, "game_state": "not started", "room_name": "", "my_player": 0, "prng_seed": 8675309, "name_player_1": "", "name_player_2": ""}
game_info = {"Player1": {"health": 5, "direction": 0, "score": 0, "shot": 0.0, "fly_hit": -1, "mother_fly_hit": -1, "bee_hit": -1, "leaf_hit": -1},
             "Player2": {"health": 5, "direction": 0, "score": 0, "shot": 0.0, "fly_hit": -1, "mother_fly_hit": -1, "bee_hit": -1, "leaf_hit": -1}
             }

@app.route("/")
def get_main_page():
    return render_template("MainMenu.html")

@app.route("/main_menu")
def get_main_page_2():
    return render_template("MainMenu.html")

@app.route("/test2_p1")
def get_play_page_1():
    client_info["players_present"] += 1
    return render_template("Test2.html", my_player=0)

@app.route("/test2_p2")
def get_play_page_2():
    client_info["players_present"] += 1
    return render_template("Test2.html", my_player=1)

@app.route("/test")
def get_test_page():
    return render_template("Test.html")

@app.route("/settings")
def get_settings_page():
    return render_template("Settings.html")

@app.route("/highscores")
def get_highscores_page():
    conn = sqlite3.connect('private/database/highscore.db')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM scores ORDER BY total+0 DESC')
    return render_template("HighScore.html",scores=cursor.fetchall())

@app.route("/credits")
def get_credits_page():
    return render_template("Credits.html")

@app.route("/room")
def get_room_page():
    room_name = client_info["room_name"]
    my_player = client_info["my_player"]
    client_info["my_player"] += 1
    return render_template("Room.html", room_name=room_name, my_player=my_player)

@app.route('/updateGameInfo', methods=['POST'])
def updateGameInfo():
    player_name = request.form["player_name"]
    info_key = request.form["info_key"]
    raw_info_value = request.form["info_value"]
    if info_key in ["shot"]:
        info_value = float(raw_info_value)
    else:
        info_value = int(raw_info_value)
    game_info[player_name][info_key] = info_value
    return "updated"

@app.route('/updateClientInfo', methods=['POST'])
def updateClientInfo():
    info_key = request.form["info_key"]
    info_value = request.form["info_value"]
    client_info[info_key] = info_value
    if info_key == "game_state" and info_value == "post-game":
        client_info["players_present"] = 0
        client_info["game_state"] = "not started"
        client_info["room_name"] = ""
        client_info["my_player"] = 0
        client_info["prng_seed"] = 8675309
        client_info["name_player_1"] = ""
        client_info["name_player_2"] = ""
        game_info["Player1"] = {"health": 5, "direction": 0, "score": 0, "shot": 0.0, "fly_hit": -1, "mother_fly_hit": -1, "bee_hit": -1, "leaf_hit": -1}
        game_info["Player2"] = {"health": 5, "direction": 0, "score": 0, "shot": 0.0, "fly_hit": -1, "mother_fly_hit": -1, "bee_hit": -1, "leaf_hit": -1}
    return "updated"

@app.route('/requestGameInfo', methods=['GET'])
def requestInfo():
    game_info_json = json.dumps(game_info)
    return game_info_json

@app.route('/requestClientInfo', methods=['GET'])
def requestClientInfo():
    client_info_json = json.dumps(client_info)
    return client_info_json

@app.route("/PostScore", methods=['POST'])
def get_score():
    name1 = request.form.get('name1')
    name2 = request.form.get('name2')
    score1 = request.form.get('score1')
    score2 = request.form.get('score2')
    total = int(score1)+int(score2)
    s_total = str(total)
    conn = sqlite3.connect('private/database/highscore.db')
    cursor = conn.cursor()
    action = 'insert into scores (name1,name2,score1,score2,total) values ("' + name1 + '","' + name2 + '","' + score1 + '","' + score2 + '","' + s_total + '")'
    cursor.execute(action)
    conn.commit()
    conn.close()
    return 'Posted!'

if __name__ == '__main__':
    app.run()
