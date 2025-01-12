import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import React, { useCallback } from "react";
import "././css/IndexCommuPage.css";

const IndexCommuPage = () => {
  const navigate = useNavigate();

  const handleClickList = useCallback(() => {
    navigate({ pathname: "list" });
  }, [navigate]);

  const handleClickAdd = useCallback(() => {
    navigate({ pathname: "add" });
  }, [navigate]);

  return (
      <>
        <div>
          <Navbar />
        </div>
        <div className="buttons-container">
          <div
              className="button list-button"
              onClick={handleClickList}
          >
            LIST
          </div>
          <div
              className="button add-button"
              onClick={handleClickAdd}
          >
            ADD
          </div>
        </div>
        <div className="outlet-container">
          <Outlet />
        </div>
      </>
  );
};

export default IndexCommuPage;
