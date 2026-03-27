import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import Session from '../models/Session.js';
import crypto from 'crypto';

const ACCESS_TOKEN_TTL = '30m';
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000;

export const signUp = async (req, res) => {
    try {
        const { username, password, email, firstName, lastName } = req.body;
        if (!username || !password || !email || !firstName || !lastName) {
            return res.status(400).json({ message: 'Không thể thiếu username, password, email, firstName và lastName' });
        }

        // ktr username trùng
        const duplicate = await User.findOne({ username });
        if (duplicate) {
            return res.status(409).json({ message: 'username đã tồn tại' });
        }

        // mã hóa password
        const hashedPassword = await bcrypt.hash(password, 10); // salt = 10

        // tạo user
        await User.create({
            username,
            hashedPassword,
            email,
            displayName: `${lastName} ${firstName}`,
        })

        // return
        return res.sendStatus(204);
    } catch (error) {
        console.error('Lỗi khi gọi signUp', error);
        return res.status(500).json({ message: 'Lỗi hệ thống' });
    }

};

export const signIn = async (req, res) => {
    try {
        // lấy input
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Thiếu username, password' });
        }

        // lấy hashedPassword
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Thông tin không chính xác' });
        }

        const passwordCorrect = await bcrypt.compare(password, user.hashedPassword);
        if (!passwordCorrect) {
            return res.status(401).json({ message: 'Thông tin không chính xác' });
        }

        const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_TTL });
        const refreshtoken = crypto.randomBytes(64).toString('hex');

        await Session.create({
            userId: user._id,
            refreshToken: refreshtoken,
            expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
        })

        // trả refresh token về trong cookie
        res.cookie('refreshToken', refreshtoken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none', // BE ,FE deploy riêng
            maxAge: REFRESH_TOKEN_TTL,
        });

        return res.status(200).json({ message: `User ${user.displayName} đã logged in!`, accessToken })

    } catch (error) {
        console.error('Lỗi khi gọi signIn', error);
        return res.status(500).json({ message: 'Lỗi hệ thống' });
    }
}

export const signOut = async (req, res) => {
    try {
        // lấy tooken
        const tooken = req.cookies.refreshToken;
        if (tooken) {
            await Session.deleteOne({ refreshToken: tooken });

            res.clearCookie('refreshToken');
        }
        return res.sendStatus(204)

    } catch (error) {
        console.error('Lỗi khi gọi signOut', error);
        return res.status(500).json({ message: 'Lỗi hệ thống' });
    }
}

// tạo access token mới từ refresh token
export const refreshToken = async (req, res) => {
    try {
        // lấy refreshToken
        const token = req.cookies?.refreshToken;
        if (!token) {
            console.log(req)
            return res.status(401).json({ message: "Token không tồn tại", cookies: req.cookies });
        }

        const session = await Session.findOne({ refreshToken: token });

        if (!session) {
            return res.status(403).json({ message: "Token không hợp lệ hoặc hết hạn" });
        }
        if (session.expiresAt < new Date()) {
            return res.status(403).json({ message: "Token hết hạn" });
        }

        const accessToken = jwt.sign({
            userId: session.userId
        }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_TTL });

        return res.status(200).json({ accessToken });

    } catch (error) {
        console.error('Lỗi khi gọi refreshToken', error);
        return res.status(500).json({ message: 'Lỗi hệ thống' });
    }
}
