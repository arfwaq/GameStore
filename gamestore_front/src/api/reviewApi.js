import jwtAxios from "../util/jwtUtil";

// named export로 변경
export const getPagedReviewsByGame = async (appId, page = 0, size = 5) => {
  const response = await jwtAxios.get(`/api/reviews/game/${appId}/paged`, {
    params: { page, size },
  });
  return response.data;
};

export const createReview = async (reviewData) => {
  const response = await jwtAxios.post("/api/reviews", reviewData);
  return response.data;
};

export const updateReview = async (reviewId, reviewData) => {
  const response = await jwtAxios.put(`/api/reviews/${reviewId}`, reviewData);
  return response.data;
};

export const getAverageRatingByGame = async (appId) => {
  const response = await jwtAxios.get(`/api/reviews/game/${appId}/average-rating`);
  return response.data;
};

export const deleteReview = async (reviewId) => {
  const response = await jwtAxios.delete(`/api/reviews/${reviewId}`);
  return response.data;
};

export const incrementLikeCount = async (reviewId) => {
  const response = await jwtAxios.patch(`/api/reviews/${reviewId}/like`);
  return response.data;
};

export const incrementDislikeCount = async (reviewId) => {
  const response = await jwtAxios.patch(`/api/reviews/${reviewId}/dislike`);
  return response.data;
};
