import React, { useState } from "react";
import axios from "axios";

const FindID = () => {
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [foundID, setFoundID] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/find-id", {
        nickname,
        password,
      });
      setFoundID(response.data.id);
      setError("");
    } catch (err) {
      setError("일치하는 정보가 없습니다.");
      setFoundID(null);
    }
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h1 className="text-3xl font-bold text-green-600 mb-6">NAVER</h1>
      <p className="text-lg font-semibold mb-6">닉네임과 비밀번호를 입력해주세요.</p>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white border rounded-lg shadow-md p-6"
      >
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">닉네임</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임 입력"
            className="w-full border rounded px-3 py-2 focus:outline-none"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호 입력"
            className="w-full border rounded px-3 py-2 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 text-white rounded py-2 hover:bg-green-600"
        >
          아이디 찾기
        </button>
      </form>

      {foundID && (
        <p className="mt-6 text-lg font-semibold text-green-600">
          찾은 아이디: {foundID}
        </p>
      )}

      {error && <p className="mt-6 text-red-500">{error}</p>}
    </div>
  );
};

export default FindID;
