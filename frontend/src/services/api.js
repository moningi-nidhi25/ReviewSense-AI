import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

// GET all reviews
export const getReviews = () => api.get("/reviews");

// GET review by ID
export const getReviewById = (id) => api.get(`/reviews/${id}`);

// CREATE review
export const createReview = (reviewData) =>
  api.post("/reviews", reviewData);

// UPDATE review
export const updateReview = (id, reviewData) =>
  api.put(`/reviews/${id}`, reviewData);

// DELETE review
export const deleteReview = (id) =>
  api.delete(`/reviews/${id}`);

// SEARCH reviews
export const searchReviews = (query) =>
  api.get(`/reviews/search?q=${query}`);

export default api;