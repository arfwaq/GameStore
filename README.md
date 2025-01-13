# FullStack_Team_Project_GameStore
SpringBoot, React, Python, AWS를 이용한 게임,장비 판매 사이트

## 프로젝트 소개
게임 상품과 게임을 하기 위해 필요한 상품들을 판매 할 수 있는 사이트를 구현한 프로젝트입니다.

## 개발 기간

- 24.11.25(월) ~ 25.01.10(금)

---
### 맴버
<table>
  <tr>
    <td align="center"><a href="https://github.com/SonSeongHan"><img src="https://avatars.githubusercontent.com/SonSeongHan" width="100px;" alt=""/><br /><sub><b>SonSeongHan</b></sub></a></td>
    <td align="center"><a href="https://github.com/arfwaq"><img src="https://avatars.githubusercontent.com/arfwaq" width="100px;" alt=""/><br /><sub><b>arfwaq</b></sub></a></td>
    <td align="center"><a href="https://github.com/sau2120"><img src="https://avatars.githubusercontent.com/sau2120" width="100px;" alt=""/><br /><sub><b>sau2120</b></sub></a></td>
    <td align="simjoungmin"><a href="https://github.com/simjoungmin"><img src="https://avatars.githubusercontent.com/simjoungmin" width="100px;" alt=""/><br /><sub><b>simjoungmin</b></sub></a></td>
  </tr>
</table>

- 팀장 : 손성한
- 팀원 : 신승훈, 심정민, 유재혁

### 개발환경
- 언어 : <img src="https://img.shields.io/badge/java-007396?style=for-the-badge&logo=java&logoColor=white"> 
- 개발 도구 :  <img src="https://img.shields.io/badge/springboot-6DB33F?style=for-the-badge&logo=spring&logoColor=white">, <img src="https://img.shields.io/badge/springsecurity-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white">, <img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black"> , <img src="https://img.shields.io/badge/redux-764ABC?style=for-the-badge&logo=redux&logoColor=black"> , <img src="https://img.shields.io/badge/python-3776AB?style=for-the-badge&logo=python&logoColor=white"> , <img src="https://img.shields.io/badge/amazonwebservices-232F3E?style=for-the-badge&logo=amazonwebservices&logoColor=black">
<img src="https://img.shields.io/badge/html5-E34F26?style=for-the-badge&logo=html5&logoColor=white">, <img src="https://img.shields.io/badge/css-1572B6?style=for-the-badge&logo=css3&logoColor=white">
- IDE : <img src="https://img.shields.io/badge/intellijidea-000000?style=for-the-badge&logo=intellijidea&logoColor=black">
- 운영 체제 : Windows
- Java SDK : Oracle JDK 17

---
## ERD
![image](https://github.com/user-attachments/assets/b33cd873-f4ce-4d42-9b7f-eabcd0c5db22)

---
## 계층 구조
![image](https://github.com/user-attachments/assets/b08fe72f-5415-4ef6-b36a-87b3b851189f)


---
## 주요 기능

#### 반응형
- 사이트에 각 버전에 맞춰 크기 조정
- PC
  
  ![image](https://github.com/user-attachments/assets/282ed6bb-a7b2-4dd7-b188-98ed3fd88b87)
- 테블릿
  
  ![image](https://github.com/user-attachments/assets/bf44f4e7-40a6-4c79-b580-708d595dbfb1)
- 모바일
  
  ![image](https://github.com/user-attachments/assets/bc35e60b-49b5-449f-9ce3-4cc05250bf05)  
#


#### 회원가입과 로그인
- 회원 가입 후 로그인 시 쿠키에 accesstoken값이 저장
- 해당 token값으로 권한을 인정받아 필터에서 통과

![image](https://github.com/user-attachments/assets/9ef64dd1-3a13-4959-b242-7dfe95cf956b)
![image](https://github.com/user-attachments/assets/08b4fdeb-c491-4fe3-ba5a-0c0bc4515669)
![가입,로그인](https://github.com/user-attachments/assets/af74b473-702f-4214-a826-fccbb341821e)
#


#### 장바구니
- 회원이 장바구니에 상품을 담을 시 DB 테이블에 해당 상품이 저장


![image](https://github.com/user-attachments/assets/d4b354b9-882a-4a11-bc6d-01e57cb6eb68)
![image](https://github.com/user-attachments/assets/a895ac96-d16a-4279-bf8c-028a6f32bbc3)
![장바구니](https://github.com/user-attachments/assets/7e9933d2-226e-4349-9ee4-ac4502040a19)

#


#### 결제
- PortOne API를 활용하여 카카오 결제를 통해 결제 기능을 구현


![image](https://github.com/user-attachments/assets/97bda89c-3311-4afd-b401-269cf2ea836c)
![image](https://github.com/user-attachments/assets/bb6ebc14-bca5-4530-b330-4d9af924fd04)
![구매](https://github.com/user-attachments/assets/837e564e-cb76-450b-84cd-ab818a8a61c9)


#


#### 환불
- 사용자가 환불 요청 시 관리자 권한을 가진 회원이 승인, 거절 선택
- 승인 선택 시 주문 테이블에 해당 사용자의 게임이 삭제


![image](https://github.com/user-attachments/assets/76265f19-9dbf-4ebd-bbe1-b3da3aa3a1fa)
![image](https://github.com/user-attachments/assets/ee86708a-da64-4f96-afcb-199b54bb4472)
![환불](https://github.com/user-attachments/assets/259c4252-45c8-4342-84ac-02cd1e11d682)
#


#### 문의
- JWT Decoding을 통해 email 값만 추출
  - 그 값을 이용하여 해당 사용자가 자신의 문의만 따로 조회 가능
- 관리자는 자주묻는 질문 카테고리 수정 + 전체 사용자의 문의 조회 가능

![image](https://github.com/user-attachments/assets/ee72cce2-053f-4495-8d51-60ba15f45d82)
![image](https://github.com/user-attachments/assets/7bb4ba75-4e0b-4401-a309-1cc73eedd66e)
![문의](https://github.com/user-attachments/assets/cbe10699-fde1-4110-bf46-d7432ec472a5)

---
## 배포

#### AWS를 활용한 배포
1. IAM을 통한 권한과 역할 생성
2. EC2 가상 서버로 애플리케이션 실행
3. RDS를 활용한 데이터베이스 설정 수정
4. Elastic Beanstalk를 이용한 배포 자동화
![image](https://github.com/user-attachments/assets/ce3bf1a0-52fa-4e94-98af-6e408950515e)



---

## 시연영상
https://www.youtube.com/watch?v=duv9RsSwdUwd
