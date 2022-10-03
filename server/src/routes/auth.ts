import { isEmpty, validate } from "class-validator";
import { Request, Response, Router } from "express";
import User from "../entities/User";
import  bcrypt  from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookie from 'cookie'

const mapErrors = (errors:Object[])=>{
    return errors.reduce((prev:any,err:any)=>{
        prev[err.propery] = Object.entries(err.constraints)[0][1];
        return prev;
    })
}

const register = async (req:Request,res:Response) =>{
    const {email,username,password} = req.body;
    
    try{
        let errors:any = {};

        const emailUser = await User.findOneBy({ email });
        const usernameUser = await User.findOneBy({ username });
        if(emailUser) errors.email = "이미 해당 이메일 주소가 사용중입니다."
        if(usernameUser) errors.username = "이미 사용자 이름이 사용중입니다."

        if(Object.keys(errors).length>0){
            return res.status(400).json(errors);
        }


        const user = new User();
        user.email=email;
        user.username=username;
        user.password=password;

        //엔티티 유효성 체크
        errors = await validate(user);

        if(errors.Length>0) return res.status(400).json(mapErrors(errors));

        //userTable에 저장
        await user.save();
        user.password=null;

        return res.json(user)
    }catch(error){
        console.error(error);
        return res.status(500).json({error})
    }
}

const login = async (req:Request,res:Response) =>{
    const {username,password} = req.body;
    try{
        let errors:any={};

        if(isEmpty(username)) errors.username="사용자 이름은 비워둘수없습니다."
        if(isEmpty(password)) errors.password="비밀번호는 비워둘수없습니다."
        if(Object.keys(errors).length>0){
            return res.status(400).json(errors);
        }

        const user = await User.findOneBy({username})
        if(!user) return res.status(401).json({username:"사용자 이름이 등록되지 않았습니다."});

        const passwordMatches = await bcrypt.compare(password,user.password)

        if(!passwordMatches){
            return res.status(401).json({password:"비밀번호가 잘못되었습니다."});
        }
        //토큰 생성
        const token = jwt.sign({username},process.env.JWT_SCERET)
        
        //쿠키 저장
        res.set("Set-Cooke",cookie.serialize("token",token,{
            httpOnly:true,
            secure:process.env.NODE_ENV==="production",
            sameSite:"strict",
            maxAge:60*60*24*7,
            path:"/"
        }));

        return res.json({user,token});
    }catch(error){
        console.error(error);
        return res.status(500).json(error)
    }

}

const router = Router();
router.post("/register",register);
router.post("/login",login)

export default router;