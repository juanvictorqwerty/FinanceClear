import jwt from 'jsonwebtoken';

export const requireAdminAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'No authorization token provided.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Ensure the token belongs to an admin. This assumes the JWT payload has a 'role' field.
        if (decoded.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Forbidden: Admin access required.' });
        }

        next(); // Token is valid and user is an admin, proceed to the controller.
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Unauthorized: Invalid or expired token.' });
    }
};