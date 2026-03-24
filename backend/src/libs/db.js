import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODS_CONNECTIONSTRING);
        console.log('Connect DB done!!')
    } catch (error) {
        console.log('Connect DB faild!!', error)
        process.exit(1);
    }
}
