
![Animation](https://github.com/user-attachments/assets/b93e33be-5a45-47ae-a09e-a48296b4ff4a)

# Sparta Dino

## 프로젝트 개요
**Sparta Dino**는 Google Chrome 브라우저의 오프라인 상태에서 제공하는 공룡 게임을 모티브로 소켓통신을 공부하기 위하여 구현한 프로젝트입니다. 사용자는 공룡 캐릭터를 조작하여 장애물을 피하고 점수를 기록할 수 있습니다. 이 게임은 JavaScript, HTML, CSS로 작성되었으며, 재미있고 도전적인 경험을 제공합니다.

## 주요 기능
- **단순한 조작**: 스페이스바를 눌러 공룡을 점프시키고 장애물을 피하는 간단한 게임 플레이.
- **실시간 점수 기록**: 플레이어의 점수를 실시간으로 기록하고 표시
- **유저 정보 기록** : 브라우저를 종료하고 다시 접속해도 점수 유지
- **재미있는 애니메이션**: 부드러운 애니메이션 효과로 게임 경험을 향상시킵니다.
- **반응형 디자인**: 다양한 화면 크기에서 원활하게 실행되는 레이아웃.

## 기술 스택
- **HTML**: 게임의 기본 구조를 정의합니다.
- **CSS**: 게임의 스타일링과 레이아웃을 관리합니다.
- **JavaScript**: 게임 로직, 사용자 입력 처리 및 점수 관리.

## 설치 방법
이 프로젝트를 로컬 환경에서 실행하려면 아래 단계를 따르세요:

1. 이 저장소를 클론합니다:
   ```bash
   git clone https://github.com/tjdcjf1996/sparta_dino.git
   ```
   
2. 클론한 디렉토리로 이동합니다:
   ```bash
   cd sparta_dino
   ```

3. redis-server를 설치합니다(LINUX 기준):
   ```bash
   sudo apt-get upgrade
   sudo apt-get install redis-server
   ```
4. node_module을 설치합니다:
   ```bash
   npm install
   ```
5. node로 실행합니다:
   ```bash
   # node 바로 실행
   node ./src/server.js
   # pm2 이용 실행
   npx pm2 start ./src/server.js
   ```


## 사용 방법
1. 노드 서버 구동.
2. http://서버주소:3000 접속
3. 스페이스바를 눌러 게임 시작
4. 게임이 시작되면 스페이스바를 눌러 공룡을 점프하며 장애물 회피 및 아이템 습득
5. 장애물을 피하며 가능한 높은 점수를 기록
6. 게임이 끝나면 화면에 표시된 점수를 확인
7. 유저간 최고 기록 갱신 시 게임창 밑 공지창에서 갱신알림
