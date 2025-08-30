import * as authService from "../services/authServices.js";

export const registerUser = async (req, res) => {
    // Use standard naming (email, username) for consistency with frontend
    const { email, username, password, matricule } = req.body;

    if (!email || !username || !password) {
        return res.status(400).json({
            success: false,
            message: "Email, username, and password are required."
        });
    }

    // Pass user data directly to the service
    const user = { email, username, password, matricule };

    try {
        const response = await authService.registerUser(user);
        // Use 201 (Created) for successful registration
        return res.status(response.success ? 201 : 400).json(response);
    } catch (error) {
        console.error('Registration controller error:', error);
        return res.status(500).json({
            success: false,
            message: "An internal error occurred during registration."
        });
    }
};

export const loginUser = async (req, res) => {
    const { userEmail, password } = req.body; // Frontend sends userEmail
    if (!userEmail || !password) {
        return res.status(400).json({ success: false, message: "Email and password are required." });
    }
    try {
        const response = await authService.loginUser(userEmail, password);
        if (response.success) {
            return res.status(200).json(response);
        } else {
            // Use 401 (Unauthorized) for failed login attempts
            return res.status(401).json(response);
        }
    } catch (error) {
        console.error('Login controller error:', error);
        return res.status(500).json({
            success: false,
            message: "An internal error occurred during login."
        });
    }
};

export const forgotPassword = async (req, res) => {
    const { userEmail} = req.body; // Frontend sends userEmail
    if (!userEmail) {
        return res.status(400).json({ success: false, message: "Email required." });
    }
    try {
        const response = await authService.forgotPasswordService(userEmail);
        if (response.success) {
            // TODO: Implement email sending functionality
            console.log('Reset link:', response.resetLink);
            return res.status(200).json({ success: true, message: "Password reset link sent to your email." });
        } else {
            return res.status(401).json(response);
        }
    } catch (error) {
        console.error('Forgot password controller error:', error);
        return res.status(500).json({
            success: false,
            message: "An internal error occurred during password reset."
        });
    }
};

export const resetPassword = async (req, res) => {
    const { token,password} = req.body; // Frontend sends userEmail
    if (!password || !token) {
        return res.status(400).json({ success: false, message: "Password and token are required." });
    }
    try {
        const response = await authService.resetPasswordService(token,password);
        if (response.success) {
            // TODO: Implement email sending functionality
            console.log('Reset link:', response.resetLink);
            return res.status(200).json({ success: true, message: "Password reset link sent to your email." });
        } else {
            return res.status(401).json(response);
        }
    } catch (error) {
        console.error('Forgot password controller error:', error);
        return res.status(500).json({
            success: false,
            message: "An internal error occurred during password reset."
        });
    }
};

export const getUserByToken = async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: "Authorization token not provided." });
    }

    try {
        const response = await authService.getUserToken(token);
        return res.status(response.success ? 200 : 401).json(response);
    } catch (error) {
        console.error('Get user from token error:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to validate token."
        });
    }
};
