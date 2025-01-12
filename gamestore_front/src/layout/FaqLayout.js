import { Outlet } from 'react-router-dom';

const FaqLayout = () => {
  return (
    <div>
      <header>
        <nav></nav>
      </header>
      <main>
        <Outlet /> {/* 하위 라우트를 렌더링 */}
      </main>
    </div>
  );
};

export default FaqLayout;
