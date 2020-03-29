const io = require("socket.io-client")
import { AuthService } from "../services/authService";
/*
I didn't found any better solution then
*/

export const authService = new AuthService();

() => {
        AuthService.checkAuth().then(() => {
            setCheckedAuth(true);
        };

const profile = {
    username: '17doe',
    email: 'john@doe.com',
    id: 123
  };

const token = jwt.sign()