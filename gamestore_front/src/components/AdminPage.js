import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getRefundRequests, approveRefund, rejectRefund } from "../api/refundApi";
import Navbar from "../components/Navbar";
import { decodedJWT } from "../util/jwtUtil";
import "../css/adminpage.css"; // 스타일 파일 추가

const AdminPage = () => {
  const navigate = useNavigate();
  const userRole = useSelector((state) => state.login?.user?.roleNames || null);
  const [refunds, setRefunds] = useState([]);
  const [error, setError] = useState("");

  // JWT 디코딩 및 권한 확인
  useEffect(() => {
    const playerInfo = decodedJWT();

    // 관리자 확인 로직
    const isAdmin =
        playerInfo && playerInfo.roleNames && playerInfo.roleNames.includes("ADMIN");

    if (!isAdmin) {
      alert("관리자 권한이 필요합니다.");
      navigate("/"); // 권한이 없으면 리다이렉트
    } else {
      console.info("Admin access granted:", playerInfo);
    }
  }, [navigate]);

  useEffect(() => {
    if (userRole === "admin") {
      fetchRefunds();
    }
  }, [userRole]);

  // 환불 요청 목록 가져오기
  const fetchRefunds = async () => {
    try {
      const data = await getRefundRequests();
      setRefunds(data);
    } catch (err) {
      setError("환불 요청 목록을 불러오는 데 실패했습니다.");
    }
  };

  useEffect(() => {
    fetchRefunds();
  }, [userRole]);

  // 환불 요청 승인
  const handleApprove = async (refundId) => {
    try {
      await approveRefund(refundId);
      setRefunds(refunds.map(refund =>
          refund.refundId === refundId
              ? { ...refund, status: "APPROVED" }
              : refund
      ));
    } catch (err) {
      setError("환불 요청 승인에 실패했습니다.");
      console.error(err);
    }
  };

  // 환불 요청 거절
  const handleReject = async (refundId) => {
    try {
      await rejectRefund(refundId);
      setRefunds(refunds.map(refund =>
          refund.refundId === refundId
              ? { ...refund, status: "REJECTED" }
              : refund
      ));
    } catch (err) {
      setError("환불 요청 거절에 실패했습니다.");
      console.error(err);
    }
  };

  return (
      <div className="admin-page">
        <Navbar />
        <div className="admin-container">
          <h1 className="admin-title">관리자 페이지</h1>
          {error && <p className="admin-error">{error}</p>}
          <div className="admin-buttons">
            <button
              className="view-payments-button"
              onClick={() => window.open("https://admin.portone.io/payments", "_blank")}
            >
              모든 유저 결제 페이지 보기
            </button>
          </div>

          <table className="admin-table">
            <thead>
            <tr>
              <th>주문 ID</th>
              <th>게임 이름</th>
              <th>요청자 이메일</th>
              <th>상태</th>
              <th>요청 날짜</th>
              <th>조치</th>
            </tr>
            </thead>
            <tbody>
            {refunds.map((refund) => (
              <tr key={refund.refundId}>
                <td>{refund.orderId}</td>
                <td>{refund.gameName}</td>
                <td>{refund.email}</td>
                <td>{refund.status}</td>
                <td>{new Date(refund.requestDate).toLocaleString()}</td>
                <td>
                  {refund.status === "PENDING" && (
                    <>
                      <button
                        className="admin-approve-button"
                        onClick={() => handleApprove(refund.refundId)}
                      >
                        승인
                      </button>
                      <button
                        className="admin-reject-button"
                        onClick={() => handleReject(refund.refundId)}
                      >
                        거절
                      </button>
                    </>
                  )}
                  {refund.status !== "PENDING" && (
                    <span className="admin-status">
                      {refund.status === "APPROVED" ? "승인됨" : "거절됨"}
                    </span>
                  )}
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
  );
};

export default AdminPage;
