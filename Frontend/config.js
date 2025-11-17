// Frontend/src/config.js
const LOCAL_BASE = import.meta.env.VITE_LOCAL || "http://localhost:3001";
export const BASE_URL = import.meta.env.VITE_AWS_MAIN || LOCAL_BASE;
export const CART_ENDPOINT = import.meta.env.VITE_AWS || `${BASE_URL}/user/cart`;
export const SOCKET_URL = import.meta.env.VITE_AWS_MAIN || LOCAL_BASE;
