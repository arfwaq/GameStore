import secrets  # secrets 모듈 임포트
from flask import Flask, request, jsonify,session
from flask_sqlalchemy import SQLAlchemy
from flask_session import Session
from flask_cors import CORS
from datetime import timedelta
import random

app = Flask(__name__)

app.secret_key = secrets.token_hex(24)  # 24바이트 랜덤 키를 16진수로 변환

# Flask-Session 설정
app.config["SESSION_TYPE"] = "filesystem"  # 세션 데이터를 파일로 저장
app.config["SESSION_FILE_DIR"] = "./flask_session_data"  # 세션 데이터를 저장할 디렉토리
app.config["SESSION_PERMANENT"] = False  # 세션을 영구적으로 유지하지 않음
app.config["SESSION_USE_SIGNER"] = True  # 세션 쿠키를 서명하여 보안 강화
app.config["SESSION_COOKIE_SECURE"] = True  # HTTPS가 아닌 경우에도 쿠키를 허용
app.config["SESSION_COOKIE_SAMESITE"] = "None"  # CORS를 허용하기 위해 None 설정
app.config["PERMANENT_SESSION_LIFETIME"] = timedelta(hours=1)  # 세션 유효 시간 1시간
Session(app)  # Flask-Session 초기화

CORS(app,supports_credentials=True)  # CORS 설정

# SQLite 데이터베이스 설정
app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+pymysql://webuser:webuser@localhost:3306/gamedb"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)

# 데이터베이스 모델 정의
class Game(db.Model):
    __tablename__ = "game"  # 테이블 이름 지정
    id = db.Column("app_id",db.Integer, primary_key=True)
    title = db.Column("game_name",db.String(100), nullable=False)
    genre = db.Column("genre",db.String(50), nullable=False)
    price = db.Column("price",db.Float, nullable=False)
    recommendations = db.Column("recommendations",db.Integer, nullable=False)

# 게임 검색 API
@app.route("/top_games", methods=["GET"])
def top_games():
    
    #게임 전체에서 추천수가 가장 높은 게임 상위 5개를 반환
    
    top_games = Game.query.order_by(Game.recommendations.desc()).limit(5).all()

    # 데이터가 없으면 에러 메시지 반환
    if not top_games:
        return jsonify([{"message": "현재 추천된 게임 데이터가 없습니다."}]), 404
    
    response = []
    for idx, game in enumerate(top_games, start=1):
        response.append({ 
            "text": f"{idx}위: {game.title} (추천 수: {game.recommendations})",
            "link": f"/games/{game.id}"
            })

    response.append({"text": "게임을 클릭하면 상세 페이지로 이동합니다. 다른 주제를 이용하고 싶으시면 어디서든 각 주제를 입력하면 됩니다!"})
    return jsonify(response)

@app.route("/random_genre_game", methods=["GET"])
def random_genre_game():
    # 클라이언트에서 전달된 genre 값을 가져옵니다.
    genre = request.args.get("genre", "").strip().lower()  # 공백 제거 및 소문자로 변환

    # 디버깅을 위해 genre 값을 출력
    print(f"Received genre: {genre}")

    # 수동으로 '전체' 값을 설정 (디버깅용)
    if not genre or genre == "":
        genre = "전체"  # genre 값이 비어있으면 "전체"로 설정
        print(f"Genre set to default: {genre}")

    # 장르가 전체인지 확인
    if genre == "전체":
        all_games = Game.query.all()
        if not all_games:
            return jsonify({"message": "현재 랜덤 추천할 수 있는 게임 데이터가 없습니다."}), 404
        random_game = random.choice(all_games)
    else:
        # 매핑된 장르가 유효한지 확인
        available_genres = {
            "액션": "액션",
            "전략": "전략",
            "캐주얼": "캐주얼",
            "인디": "인디",
            "시뮬레이션": "시뮬레이션",
            "RPG": "RPG",
            "어드벤처": "어드벤처",
            "레이싱": "레이싱",
            "스포츠": "스포츠",
            "애니메이션": "애니메이션",
            "유틸리티": "유틸리티",
        }

        if genre not in available_genres:
            return jsonify({"message": f"'{genre}'는 유효한 장르가 아닙니다. 지원되는 장르는 다음과 같습니다: {list(available_genres.keys())}"}), 400

        genre_games = Game.query.filter(Game.genre.ilike(f"%{genre}%")).all()
        if not genre_games:
            return jsonify({"message": f"장르 '{genre}'에 해당하는 게임이 없습니다."}), 404

        random_game = random.choice(genre_games)

    # 선택된 게임 반환
    return jsonify({
        "id": random_game.id,
        "title": random_game.title,
        "genre": random_game.genre,
        "price": random_game.price,
        "recommendations": random_game.recommendations,
        "link" : f"/games/{random_game.id}"
    })

# 초기 상태 설정
DEFAULT_STATE = {
    "topic": None,  # 현재 주제
    "step": 0,     # 대화 단계
    "context" : {},
}

def reset_state():
    """상태 초기화 함수"""
    session["state"] = DEFAULT_STATE.copy()

def generate_response(state, user_message):
    """주제에 따른 응답 생성"""
    topic = state["topic"]
    step = state["step"]
    
# 사용자가 다른 주제를 선택할 경우 상태 초기화 및 주제 변경
    if any(keyword in user_message for keyword in ["게임", "커뮤니티", "문의", "뉴스"]):
        reset_state()
        if "게임" in user_message :
            state["topic"] = "게임"
            state["step"] = 1
            return f"{state['topic']} 주제를 선택하셨습니다. 어떤 정보를 원하시나요?", "인기", "장르", "랜덤"
        elif "커뮤니티"  in user_message:
            state["topic"] = "커뮤니티"
            state["step"] = 1
            return f"{state['topic']} 주제를 선택하셨습니다. 저희 사이트의 커뮤니티를 이용해주셔서 감사합니다. 혹시 문제가 있으실까요? 현재는 이용 방법과 비매너(욕 또는 욕설 등)에 대한 답변만 있습니다."
        elif "문의" in user_message :
            state["topic"] = "문의"
            state["step"] = 1
            return f"{state['topic']} 주제를 선택하셨습니다. 문의에 대한 얘기군요! 문의에 대한 문제가 있나요?","방법","답변","지연","중 하나가 들어간 문장이면 답변을 드릴게요!"
        elif "뉴스" in user_message :
            state["topic"] = "뉴스"
            state["step"] = 1
            return f"{state['topic']} 주제를 선택하셨습니다. 뉴스군요! 저희의 뉴스에는 주제,종류,최신,추천,비추천,댓글순으로 구성되어 있습니다. 궁금하신게 있나요?"
        

    # 단계별 응답 처리
    if step == 0:
        return "어떤 주제에 대해 이야기하고 싶으신가요? (예: 게임, 커뮤니티, 문의, 뉴스)"
            

        # 2단계: 게임 주제에 대해 추가 응답
    if step == 1:
        if topic == "게임" :
            if "인기" in user_message or "ㅇㄱ" in user_message:
                state["topic"] = "game_all_recommendations"
                state["step"] = 2
                return  "현재 저희 사이트에서 가장 인기 있는 게임 5개를 알려드립니다. 보시겠습니까?" #추천순으로 장르 불문 제일 높은거 5개를 고정정으로 보여주기
            elif "장르" in user_message or "ㅈㄹ" in user_message:
                state["topic"] = "game_genre"
                state["step"] = 2
                return  "원하시는 장르를 입력해주세요!","액션","전략","캐주얼","인디","시뮬레이션","RPG","어드벤처","레이싱","스포츠","애니메이션","유틸리티"
            #인기순,가격,언어,나이로 필터 적용하게 해주기: 각 장르에서 인기순은 5개 이하로,가격은 각 가격내에서 인기순으로 5개 이하로
            elif "랜덤" in user_message or "렌덤" in user_message or "ㄹㄷ" in user_message:
                state["topic"] = "game_random"
                state["step"] = 2
                return ["랜덤 게임 추천 기능에 입장하셨습니다 :) 각 카테고리중에서 정하시면 랜덤으로 픽해서 고객님에게 추천드리는 곳입니다. 원하시는 카테고리를 선택하여 입력해주세요.","전체","액션","전략","캐주얼","인디","시뮬레이션","RPG","어드벤처","레이싱","스포츠","애니메이션","유틸리티"]
            #각 카테고리를 불러와서 랜덤 로직으로 게임 하나 추천하기. 전체는 무리라면 패스.
            else:
                return  "게임에 대한 추가 질문을 해주세요.혹시 다른 기능을 보고싶으시다면 어느 단계에서든 게임, 커뮤니티, 문의, 뉴스를 입력하시면 이동됩니다!"
        
        elif topic =="커뮤니티": 
            if step == 1:    
                if "욕설" in user_message or "욕" in user_message:
                    state["topic"] = "비매너"
                    state["step"] = 2
                    return "다른 유저가 고객님에게 욕설을 했다면 문의하기를 통해 신고해주시면 바로 신속 조치를 하겠습니다. 욕설을 한 유저의 정보를 입력하여 문의를 보내주세요! 이용에 불편을 드려 죄송합니다. 혹시 문의하기로 이동하는 링크를 드릴까요?"
                elif "이용" in user_message or "방법" in user_message or "사용" in user_message:
                    state['topic'] = "이용"
                    state["step"] = 2
                    return "현재 커뮤니티는 주로 다양한 주제를 가지고 유저분들이 쓰고 계시며 굳이 게임이 메인이 아니어도 사용이 가능한 컨텐츠입니다. 매일 매일 유저분들이 작성하시는 다양한 게시글을 환영하며 혹시 커뮤니티가 궁금하시다면 이동하는 링크를 드릴까요?"
                else:
                    return "! 커뮤니티에 대한 추가 질문을 입력해주세요.혹시 다른 기능을 보고싶으시다면 어느 단계에서든 게임, 커뮤니티, 문의, 뉴스를 입력하시면 이동됩니다!"

        elif topic == "문의" :
            if step == 1:
                if "방법" in user_message:
                    state["topic"] = "방법"
                    state["step"] = 2
                    return  "문의하기의 방법 말씀이시군요! 문의하기는 현재 회원이 아니시면 사용이 불가능합니다. 먼저 회원으로 가입을 한 후 지원 카테고리의 문의하기를 이용해주세요! 혹시 문의하기로 이동하는 링크를 드릴까요?"
                elif "답변" in user_message or "대답" in user_message:
                    return  "답변은 운영자가 처리하며, 보통 2~3일 정도 걸릴 수 있습니다."
                elif "안와" in user_message or "지연" in user_message or "느려" in user_message:
                    state["topic"] = "지연"
                    state["step"] = 2
                    return  "답변이 지연되고 있다면 조금만 기다려 주세요. 추가 문제가 있다면 문의하기로 문의해 주세요! 혹시 문의하기로 이동하는 링크를 드릴까요?"
                else:
                    return "문의 관련 추가 질문을 입력해 주세요.혹시 다른 기능을 보고싶으시다면 어느 단계에서든 게임, 커뮤니티, 문의, 뉴스를 입력하시면 이동됩니다!"      
          
        elif topic == "뉴스" :
            if step == 1:
                if "주제" in user_message:
                    return "현재 저희 게임스토어의 뉴스는 게임과 조금이라도 관련이 있는 것만 다룹니다. 다른 주제를 원하신다면 타 사이트를 검색해 주세요."
                elif "종류" in user_message:
                    return "현재 서비스중인 뉴스에서 종류는 다양합니다. 개발중인 게임,게임 이벤트 등등이 있습니다."    
                elif "최신" in user_message:
                    state["topic"] = "최신"
                    state["step"] = 2
                    return "최신 뉴스는 하루 기준으로 업데이트됩니다. 혹시 최신순 뉴스로 이동을 원하시나요?"  
                elif "추천" in user_message:
                    state["topic"] = "추천"
                    state["step"] = 2
                    return "추천은 유저의 선택에 따라 결정됩니다. 혹시 추천순 뉴스로 이동을 원하시나요?"
                elif "비추천" in user_message:
                    state["topic"] = "비추천"
                    state["step"] = 2
                    return "비추천은 유저의 선택에 따라 결정됩니다. 혹시 비추천 뉴스로 이동을 원하시나요?"    
                elif "댓글" in user_message:
                    state["topic"] = "댓글"
                    state["step"] = 2
                    return "댓글은 자유롭게 작성 가능합니다. 비매너 댓글은 법적 문제가 될 수 있습니다.혹시 댓글순 뉴스로 이동을 원하시나요?"    
                else:
                    return "뉴스 관련 추가 질문을 입력해 주세요.혹시 다른 기능을 보고싶으시다면 어느 단계에서든 게임, 커뮤니티, 문의, 뉴스를 입력하시면 이동됩니다!"
    #3단계 부분적 추가 응답
    if step == 2: 
        
        user_message = user_message.strip().lower()

        #각 장르를 선택해서 보여주려 했지만 시간 부족일듯
        if topic == "game_genre" :
            if "액션" in user_message or "ㅇㅅ" in user_message:
                return "액션을 선택하셨습니다! 제공하는 기능은 인기순,가격,언어,나이입니다! 4개중에서 하나를 선택하시면 제가 보여드릴게요!하지만 현재 여러 선택을 하는 복합적 필터링은 카테고리의 필터 기능을 이용하여주시기 바랍니다."
            elif "전략" in user_message or "ㅈㄹ" in user_message:
                return "전략을 선택하셨습니다! 제공하는 기능은 인기순,가격,언어,나이! 4개중에서 하나를 선택하시면 제가 보여드릴게요!하지만 현재 여러 선택을 하는 복합적 필터링은 카테고리의 필터 기능을 이용하여주시기 바랍니다."
            elif "캐주얼" in user_message or "ㅋㅈㅇ" in user_message:
                return "캐주얼을 선택하셨습니다! 제공하는 기능은 인기순,가격,언어,나이! 4개중에서 하나를 선택하시면 제가 보여드릴게요!하지만 현재 여러 선택을 하는 복합적 필터링은 카테고리의 필터 기능을 이용하여주시기 바랍니다."
            elif "인디" in user_message or "ㅇㄷ" in user_message:
                return "인디를 선택하셨습니다! 제공하는 기능은 인기순,가격,언어,나이! 4개중에서 하나를 선택하시면 제가 보여드릴게요!하지만 현재 여러 선택을 하는 복합적 필터링은 카테고리의 필터 기능을 이용하여주시기 바랍니다."
            elif "시뮬레이션" in user_message or  "시뮬" in user_message or "ㅅㅁ" in user_message:
                return "시뮬레이션을 선택하셨습니다! 제공하는 기능은 인기순,가격,언어,나이! 4개중에서 하나를 선택하시면 제가 보여드릴게요!하지만 현재 여러 선택을 하는 복합적 필터링은 카테고리의 필터 기능을 이용하여주시기 바랍니다."
            elif "RPG" in user_message or "알피지" in user_message or "ㅇㅍㅈ" in user_message or "ㄹㅍㄹㅇ" in user_message:
                return "RPG를 선택하셨습니다! 제공하는 기능은 인기순,가격,언어,나이! 4개중에서 하나를 선택하시면 제가 보여드릴게요!하지만 현재 여러 선택을 하는 복합적 필터링은 카테고리의 필터 기능을 이용하여주시기 바랍니다."
            elif "어드벤처" in user_message or "어드벤쳐" in user_message or "어드밴처" in user_message or "어드밴쳐" in user_message or "ㅇㄷㅂㅊ" in user_message:
                return "어드벤처를 선택하셨습니다! 제공하는 기능은 인기순,가격,언어,나이! 4개중에서 하나를 선택하시면 제가 보여드릴게요!하지만 현재 여러 선택을 하는 복합적 필터링은 카테고리의 필터 기능을 이용하여주시기 바랍니다."
            elif "레이싱" in user_message or "ㄹㅇㅅ" in user_message:
                return "레이싱을 선택하셨습니다! 제공하는 기능은 인기순,가격,언어,나이! 4개중에서 하나를 선택하시면 제가 보여드릴게요!하지만 현재 여러 선택을 하는 복합적 필터링은 카테고리의 필터 기능을 이용하여주시기 바랍니다."
            elif "스포츠" in user_message or "ㅅㅍㅊ" in user_message:
                return "스포츠를 선택하셨습니다! 제공하는 기능은 인기순,가격,언어,나이! 4개중에서 하나를 선택하시면 제가 보여드릴게요!하지만 현재 여러 선택을 하는 복합적 필터링은 카테고리의 필터 기능을 이용하여주시기 바랍니다."
            elif "애니메이션" in user_message or "애니" in user_message or "애니메" in user_message or "애니매" in user_message or "ㅇㄴㅁㅇㅅ" in user_message or "ㅇㄴ" in user_message:
                return "애니메이션을 선택하셨습니다! 제공하는 기능은 인기순,가격,언어,나이! 4개중에서 하나를 선택하시면 제가 보여드릴게요!하지만 현재 여러 선택을 하는 복합적 필터링은 카테고리의 필터 기능을 이용하여주시기 바랍니다."
            elif "유틸리티" in user_message or "유틸" in user_message or "ㅇㅌㄹㅌ" in user_message or "ㅇㅌ" in user_message:
                return "유틸리티를 선택하셨습니다! 제공하는 기능은 인기순,가격,언어,나이! 4개중에서 하나를 선택하시면 제가 보여드릴게요!하지만 현재 여러 선택을 하는 복합적 필터링은 카테고리의 필터 기능을 이용하여주시기 바랍니다."
            else:
                return "장르는 하나만 선택할 수 있습니다. 정확히 들어가는 내용을 입력하여 선택해주세요!!."
        #게임에서 전체 및 각 장르 선택해서 랜덤으로 추천받기
        elif topic == "game_random" :
            if "전체" in user_message :
                
                all_games = Game.query.all()

                if not all_games:
                    return "현재 랜덤 추천할 수 있는 게임 데이터가 없습니다.나중에 다시 시도해주세요"
                
                random_game = random.choice(all_games)
                

                response = [
                            "저희 사이트에서 유통중인 게임 전체에서 하나를 추천하겠습니다!",
                            "3...",
                            "2...",
                            "1!",
                            {
                                "text": f"게임 타이틀: {random_game.title} (장르: {random_game.genre}) (가격: {random_game.price}원) (추천수: {random_game.recommendations})",
                                "link": f"/games/{random_game.id}"  # 링크 포함
                           },
                            "혹시 다른 기능을 보고싶으시다면 어느 단계에서든 게임, 커뮤니티, 문의, 뉴스를 입력하시면 이동됩니다!"
                ]
                return response
            
            else:
             # 장르 매핑 설정
                available_genres = {
                    "액션": "액션",
                    "전략": "전략",
                    "캐주얼": "캐주얼",
                    "인디": "인디",
                    "시뮬레이션": "시뮬레이션",
                    "RPG": "알피쥐",
                    "어드벤처": "어드벤처",
                    "레이싱": "레이싱",
                    "스포츠": "스포츠",
                    "애니메이션": "애니메이션",
                    "유틸리티": "유틸리티",
                }

                # 사용자 메시지에서 장르 추출
                genre = None
                for key, value in available_genres.items():
                    if key in user_message:
                        genre = value
                        break
                
                if not genre:
                    return "유효하지 않은 장르입니다. 지원되는 장르는 다음과 같습니다: "+", ".join(available_genres.keys())
                
                #선택한 장르에서 랜덤 게임 추천
                genre_games = Game.query.filter(Game.genre.ilike(f"%{genre}%")).all()

                if not genre_games:
                    return f"장르 '{genre}'에 해당하는 게임 데이터가 없습니다. 다른 장르를 선택해주세요."
                
                random_game = random.choice(genre_games)

                response = [
                    f"저희 사이트에서 '{key}' 장르의 게임을 랜덤 추천합니다!",
                    "3...",
                    "2...",
                    "1!",
                    {
                        "text": f"게임 타이틀: {random_game.title} (장르: {random_game.genre}) (가격: {random_game.price}원) (추천수: {random_game.recommendations})",
                        "link": f"/games/{random_game.id}"  # 링크 포함
                    },
                    "혹시 다른 기능을 보고 싶으시다면, 게임, 커뮤니티, 문의, 뉴스를 입력하시면 이동됩니다!"
                ]
                return response
        #문의
        elif topic == "방법" :
            if user_message in ["네", "어", "응", "보여줘", "ㅇㅇ", "ㅇ"]:
                return {
                    "text":"문의하기로 이동하기",
                    "link":"/support/inquire"
                }
            else: 
                return {
                "text": "문의로 이동을 원하신다면 네 또는 어 또는 응 또는 보여줘 또는 ㅇㅇ 을 입력하시면 링크를 보내드려요! 다른 주제를 원하신다면 게임,문의,뉴스,커뮤니티를 입력하시면 됩니다!"
            }
        elif topic == "지연" :
            if user_message in ["네", "어", "응", "보여줘", "ㅇㅇ", "ㅇ"]:
                return {
                   "text":"문의하기로 이동하기",
                    "link":"/support/inquire" 
                }
            else: 
                return {
                "text": "문의로 이동을 원하신다면 네 또는 어 또는 응 또는 보여줘 또는 ㅇㅇ 을 입력하시면 링크를 보내드려요! 다른 주제를 원하신다면 게임,문의,뉴스,커뮤니티를 입력하시면 됩니다!"
            }
        #커뮤니티
        elif topic == "비매너" :
            if user_message in ["네", "어", "응", "보여줘", "ㅇㅇ", "ㅇ"]:
                return {
                    "text":"문의하기로 이동하기",
                    "link":"/support/inquire"
                }
            else:
                return {
                    "text": "문의로 이동을 원하신다면 네 또는 어 또는 응 또는 보여줘 또는 ㅇㅇ 을 입력하시면 링크를 보내드려요! 다른 주제를 원하신다면 게임,문의,뉴스,커뮤니티를 입력하시면 됩니다!"
            }
        elif topic == "이용" :
            if user_message in ["네", "어", "응", "보여줘", "ㅇㅇ", "ㅇ"]:
                return {
                    "text":"커뮤니티로 이동하기",
                    "link":"/community/list"
                }
            else:
                return {
                    "text": "커뮤니티로 이동을 원하신다면 네 또는 어 또는 응 또는 보여줘 또는 ㅇㅇ 을 입력하시면 링크를 보내드려요! 다른 주제를 원하신다면 게임,문의,뉴스,커뮤니티를 입력하시면 됩니다!"
            }
        #뉴스
        elif topic == "최신" :
            if user_message in ["네", "어", "응", "보여줘", "ㅇㅇ", "ㅇ"]:
                return {
                    "text": "최신 뉴스로 이동하기",
                    "link": "/news?sort=createdAt"
                }
            else:
                return {
                "text": "최신 뉴스로 이동을 원하신다면 네 또는 어 또는 응 또는 보여줘 또는 ㅇㅇ 을 입력하시면 링크를 보내드려요! 다른 주제를 원하신다면 게임,문의,뉴스,커뮤니티를 입력하시면 됩니다!"
            }
        elif topic == "추천" :
            if user_message in ["네", "어", "응", "보여줘", "ㅇㅇ", "ㅇ"]:
                return {
                    "text": "추천 뉴스로 이동하기",
                    "link": "/news?sort=recommends"
                }
            else:
                return {
                "text": "최신 뉴스로 이동을 원하신다면 네 또는 어 또는 응 또는 보여줘 또는 ㅇㅇ 을 입력하시면 링크를 보내드려요! 다른 주제를 원하신다면 게임,문의,뉴스,커뮤니티를 입력하시면 됩니다!"
            }
        elif topic == "비추천" :
            if user_message in ["네", "어", "응", "보여줘", "ㅇㅇ", "ㅇ"]:
                return {
                    "text": "비추천 뉴스로 이동하기",
                    "link": "/news?sort=downvotes"
                }
            else:
                return {
                "text": "최신 뉴스로 이동을 원하신다면 네 또는 어 또는 응 또는 보여줘 또는 ㅇㅇ 을 입력하시면 링크를 보내드려요! 다른 주제를 원하신다면 게임,문의,뉴스,커뮤니티를 입력하시면 됩니다!"
            }
        elif topic == "댓글" :
            if user_message in ["네", "어", "응", "보여줘", "ㅇㅇ", "ㅇ"]:
                return {
                    "text": "댓글 뉴스로 이동하기",
                    "link": "/news?sort=commentCount"
                }
                    
        #게임 전체 중 인기 TOP5
        elif topic == "game_all_recommendations" :
            if user_message in ["네", "어", "응", "보여줘", "ㅇㅇ", "ㅇ"]:
                # 추천순으로 상위 5개 게임 가져오기
                top_games = Game.query.order_by(Game.recommendations.desc()).limit(5).all()

                if not top_games:
                    return [{"text": "현재 추천된 게임 데이터가 없습니다. 나중에 다시 시도해주세요."}]

                response = []
                for idx,game in enumerate(top_games,start=1):
                    response.append({
                        "text": f"{idx}위: {game.title} (추천 수: {game.recommendations})",
                        "link": f"/games/{game.id}"
                    })

                response.append({"text": "게임을 클릭하면 상세 페이지로 이동합니다. 다른 주제를 이용하고 싶으시면 어디서든 각 주제를 입력하면 됩니다!"})
                return response
            else:
                return [{"text": "보시겠다면 네 or 응 or 보여줘 or ㅇㅇ or ㅇ 를 입력하시면 보여드립니다!"},
                {"text": "혹시 다른 기능을 보고 싶으시다면, 게임, 커뮤니티, 문의, 뉴스를 입력하시면 이동됩니다!"}]
                     
    
    return "죄송하지만 요청을 처리할 수 없습니다. 다른 질문을 입력해주세요."         
               
# 세션 초기화 API
@app.route("/start_session", methods=["POST"])
def start_session():
    """새로운 유저 세션 초기화"""
    reset_state()
    return jsonify({"message": "새로운 세션이 생성되었습니다.", "state": session["state"]})

@app.route("/chat", methods=["POST"])
def chat():
    """대화 처리 API"""
    if "state" not in session:
        reset_state()

    state = session["state"]
    user_message = request.json.get("message", "").lower()

    print(f"State before handling: {state}")
    print(f"User Message: {user_message}")

    # "문의하기" 처리 로직
    if "문의하기" in user_message:
        return jsonify({
            "response": {
                "text": "문의하기로 이동하기",
                "link": "/support/inquire"  # 문의하기 페이지로 이동할 링크
            },
            "state": state
        })

    # 일반 대화 처리
    response = generate_response(state, user_message)
    session["state"] = state  # 상태 저장

    print(f"Updated state: {state}")
    return jsonify({"response": response, "state": state})


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5001)