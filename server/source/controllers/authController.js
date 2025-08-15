import { registerUser, loginUser, getUserToken } from "../services/authServices.js";

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

export const loginUserController= async(request,front_res)=>{
    const {userEmail, password} = request.body;
    if (!userEmail || !password){
        return front_res.status(400).json({success:false,message:"All fields are required"});
    }
    try{
        const response = await loginUser(userEmail, password);
        return front_res.status(response.success ? 200 : 400).json(response);
    } catch (error){
        console.error('Login controller error:', error);
        return front_res.status(500).json({
            success: false, 
            message: "Login failed. Please try again later."
        });
    }
}
export const getUserFromToken = async (request, front_res) => {
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) {
        return front_res.status(400).json({ success: false, message: "Token not provided" });
    }
    try {
        const response = await getUserToken(token);
        if (response.success) {
            return front_res.status(200).json(response);
        } else {
            return front_res.status(400).json(response);
        }
    } catch (error) {
        console.error('Get user from token error:', error);
        return front_res.status(500).json({ success: false, message: "Login Failed" });
    }
}
