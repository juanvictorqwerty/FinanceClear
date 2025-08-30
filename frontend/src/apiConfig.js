// The correct URL is automatically loaded from .env.development or .env.production
// based on the script you run (npm start vs npm run build).
const API_URL = process.env.REACT_APP_API_URL;

export default API_URL;