import React from 'react';
import { Link, useSearchParams  } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import ListCommuComponent from"../../../components/community/ListCommuComponent"

const ListCommuPage = () => {
  const [queryParams] = useSearchParams()
  const page = queryParams.get("page") ? parseInt(queryParams.get("page")) : 1
  const size = queryParams.get("size") ? parseInt(queryParams.get("size")) : 10
  return (
    <div className="p-4 w-full bg-white">
      <div className="text-3xl font-extrabold">
      </div>
      <ListCommuComponent/>
    </div>
  );
};

export default ListCommuPage;
