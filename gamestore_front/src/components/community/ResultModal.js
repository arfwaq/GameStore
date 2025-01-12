const ResultModal = ( {title,content, callbackFn} ) => {
  return (
    <div
      className={`fixed top-0 left-0 z-[1055] flex justify-center items-center h-full w-full bg-black bg-opacity-50`}
      onClick={() => {
        if (callbackFn) {
          callbackFn();
        }
      }}
    >
      <div
        className="bg-white p-8 rounded-lg shadow-lg w-1/3 max-w-lg"
        onClick={(e) => e.stopPropagation()}  // 모달 내부 클릭 시 배경 클릭 이벤트 방지
      >
        <div className="text-xl font-bold text-center text-gray-800">{title}</div>
        <div className="mt-4 text-center text-2xl text-gray-700">{content}</div>
        <div className="flex justify-center mt-6">
          <button
            className="px-6 py-2 bg-blue-500 text-white rounded-md text-lg"
            onClick={() => {
              if (callbackFn) {
                callbackFn();
              }
            }}
          >
            Close Modal
          </button>
        </div>
      </div>
    </div>

  );
}

export default ResultModal;