import { Suspense, lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import AppLayout from '../AppLayout.js';
import PlayerRouter from './PlayerRouter'; // Player 관련 라우터
import Support from '../Pages/navpage/Support';
import Faq from '../Pages/supportpages/Faq';
import Inquire from '../Pages/supportpages/Inquire';
import Qna from '../Pages/supportpages/Qna';
import QnaDetail from '../Pages/supportpages/QnaDetail';
import QnaModify from '../Pages/supportpages/QnaModify';
import FaqCreate from '../Pages/supportpages/FaqCreate';
import FaqLayout from '../layout/FaqLayout.js';
import QnaLayout from '../layout/QnaLayout.js';
import FaqDetail from '../Pages/supportpages/FaqDetail.js';
import communityRouter from './communityRouter';
import MyPage from '../Pages/navpage/MyPage';
import Cart from '../components/Cart'; // community 관련 라우터
import InquireLayout from '../layout/InquireLayout.js';
import GameEquipmentDetail from '../Pages/gameequipments/GameEquipmentDetail.js';
import AllandCategoryEq from '../Pages/navpage/AllandCategoryEq.js';

const Loading = <div>Loading....</div>;

const Home = lazy(() => import('../Pages/Home')); // 홈 페이지
const Category = lazy(() => import('../Pages/navpage/Category')); // 카테고리
const Community = lazy(() => import('../Pages/navpage/Community')); // 커뮤니티
const NewsDetails = lazy(() => import('../Pages/navpage/NewsDetails')); // 뉴스 상세 페이지
const AllComments = lazy(() => import('../components/AllComments')); // AllComments 추가
const News = lazy(() => import('../Pages/navpage/News')); // 뉴스
const PointShop = lazy(() => import('../Pages/navpage/PointShop')); // 포인트 상점
const Promotion = lazy(() => import('../Pages/navpage/Promotion')); // 프로모션
const Shop = lazy(() => import('../Pages/navpage/Shop')); // 상점
const GameDetail = lazy(() => import('../Pages/GameDetail')); // 게임 디테일 페이지 추가
const CommunityIndex = lazy(() =>
  import('../Pages/navpage/community/IndexCommuPage')
);
const AdminPage = lazy(() => import('../components/AdminPage')); // 관리자 페이지 추가
const GameSearch = lazy(() => import('../components/GameSearch')); // 게임 검색 페이지 추가
// const NotFound = lazy(() => import('../Pages/NotFound')); // 404 페이지 추가

const root = createBrowserRouter([
  {
    id: 'root',
    path: '/',
    element: (
      <Suspense fallback={Loading}>
        <AppLayout />
      </Suspense>
    ),
    children: [
      {
        id: 'home',
        index: true,
        element: (
          <Suspense fallback={Loading}>
            <Home />
          </Suspense>
        ),
      },
      {
        id: 'admin',
        path: 'admin',
        element: (
          <Suspense fallback={Loading}>
            <AdminPage />
          </Suspense>
        ),
      },
      {
        id: 'community',
        path: 'community',
        element: (
          <Suspense fallback={Loading}>
            <CommunityIndex />
          </Suspense>
        ),
        children: communityRouter(),
      },
      {
        id: 'category',
        path: 'category',
        element: (
          <Suspense fallback={Loading}>
            <Category />
          </Suspense>
        ),
      },
      {
        id: 'news',
        path: 'news',
        element: (
          <Suspense fallback={Loading}>
            <News />
          </Suspense>
        ),
      },
      {
        id: 'news-details',
        path: 'news/:id',
        element: (
          <Suspense fallback={Loading}>
            <NewsDetails />
          </Suspense>
        ),
      },
      {
        id: 'cart',
        path: 'cart',
        element: (
          <Suspense fallback={Loading}>
            <Cart />
          </Suspense>
        ),
      },
      {
        id: 'search',
        path: 'search',
        element: (
          <Suspense fallback={Loading}>
            <GameSearch />
          </Suspense>
        ),
      },
      {
        id: 'comments',
        path: 'comments/:newsId',
        element: (
          <Suspense fallback={Loading}>
            <AllComments />
          </Suspense>
        ),
      },
      {
        id: 'support',
        path: 'support',
        element: (
          <Suspense fallback={Loading}>
            <Support />
          </Suspense>
        ),
        children: [
          {
            id: 'faq',
            path: 'faq',
            element: <FaqLayout />,
            children: [
              { path: '', element: <Faq /> },
              { path: 'create', element: <FaqCreate /> },
              { path: 'edit/:id', element: <FaqDetail /> },
            ],
          },
          {
            id: 'inquire',
            path: 'inquire',
            element: <InquireLayout />,
            children: [{ path: '', element: <Inquire /> }],
          },
          {
            id: 'qna',
            path: 'qna',
            element: <QnaLayout />,
            children: [
              { path: '', element: <Qna /> },
              { path: ':id', element: <QnaDetail /> },
              { path: 'edit/:id', element: <QnaModify /> },
            ],
          },
        ],
      },
      {
        id: 'equipments',
        path: 'equipments',
        element: (
          <Suspense fallback={Loading}>
            <AllandCategoryEq />
          </Suspense>
        ),
      },
      {
        path: 'equipments/:id', // 특정 장비의 상세 정보를 위한 경로
        element: (
          <Suspense fallback={Loading}>
            <GameEquipmentDetail />
          </Suspense>
        ),
      },
      {
        id: 'mypage',
        path: 'mypage',
        element: (
          <Suspense fallback={Loading}>
            <MyPage />
          </Suspense>
        ),
      },
      {
        id: 'pointshop',
        path: 'pointshop',
        element: (
          <Suspense fallback={Loading}>
            <PointShop />
          </Suspense>
        ),
      },
      {
        id: 'promotion',
        path: 'promotion',
        element: (
          <Suspense fallback={Loading}>
            <Promotion />
          </Suspense>
        ),
      },
      {
        id: 'shop',
        path: 'shop',
        element: (
          <Suspense fallback={Loading}>
            <Shop />
          </Suspense>
        ),
      },
      {
        id: 'games',
        path: 'games/:appId',
        element: (
          <Suspense fallback={Loading}>
            <GameDetail />
          </Suspense>
        ),
      },
      {
        id: 'player',
        path: 'player/*',
        children: PlayerRouter(),
      },
    ],
  },
]);

export default root;
