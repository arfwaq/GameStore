// import React from "react";
//
// const ReadCommuPage = ({ item }) => {
//     // item이 비어있을 경우 기본값 설정
//     const safeItem = item || { name: "Unknown", description: "No description available." };
//
//     return (
//         <div>
//             <h1>{safeItem.name}</h1>
//             <p>{safeItem.description}</p>
//         </div>
//     );
// };
//
// export default ReadCommuPage;


import { createSearchParams, useNavigate, useParams, useSearchParams } from "react-router-dom";
import React from 'react';
import { useCallback } from "react";
import Navbar from "../../../components/Navbar";
import ReadCummuComponent from "../../../components/community/ReadCommuComponent"

const ReadCommuPage = () => {
  const { comId } = useParams();


  return (
    <div className="text-3xl font-extrabold">

      <ReadCummuComponent comId={comId}></ReadCummuComponent>

    </div>
  );
};

export default ReadCommuPage;