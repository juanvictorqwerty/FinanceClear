import { registerUser } from "../services/authServices.js";

export const registerUsersController= async(request, front_res)=>{ 
    const {userEmail, userName, password,matricule} = request.body; //registration info the user sent
    
    if(!userEmail || !userName || !password){
        return front_res.status(400).json({
            success: false, 
            message: "All fields are required"
        });
    }

    const user = {
        userEmail: userEmail,
        userName: userName,
        password: password,
        matricule: matricule
    };

    try {
        const response = await registerUser(user);
        return front_res.status(response.success ? 200 : 400).json(response);
    } catch (error) {
        console.error('Registration controller error:', error);
        return front_res.status(500).json({
            success: false, 
            message: "Registration failed. Please try again later."
        });
    }
}
