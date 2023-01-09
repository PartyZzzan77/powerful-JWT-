import { makeAutoObservable } from 'mobx';
import AuthService from '../services/AuthService';
import { IUser } from './../models/IUser';

export default class Store {
    user = {} as IUser
    isAuth = false

    constructor() {
        makeAutoObservable(this)
    }

    public setAuth(flag: boolean): void {
        this.isAuth = flag
    }

    public setUser(user: IUser): void {
        this.user = user
    }

    public async login(email: string, password: string) {
        try {
            const response = await AuthService.login(email, password)

            console.log(response);

            localStorage.setItem('token', (response).data.accessToken)
            this.setAuth(true)
            this.setUser(response.data.user)
        } catch (error) {
            console.log(error);
        }
    }

    public async registration(email: string, password: string) {
        try {
            const response = await AuthService.registration(email, password)
            console.log(response);

            localStorage.setItem('token', (await response).data.accessToken)
            this.setAuth(true)
            this.setUser(response.data.user)
        } catch (error) {
            console.log(error);
        }
    }

    public async logout() {
        try {
            await AuthService.logout()

            localStorage.removeItem('token')
            this.setAuth(false)
            this.setUser({} as IUser)
        } catch (error) {
            console.log(error);
        }
    }
}