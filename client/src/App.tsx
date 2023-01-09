import { observer } from 'mobx-react-lite';
import { useContext, useEffect, useState } from 'react';
import { Context } from '.';
import LoginForm from './components/LoginForm';
import { CONSTANTS } from './constants';
import { IUser } from './models/IUser';
import { UserService } from './services/UserService';

const App = () => {
    const [users, setUsers] = useState<IUser[]>([]);
    const { store } = useContext(Context);

    const getAllUsers = async () => {
        try {
            const response = await UserService.fetchUsers();
            setUsers(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (localStorage.getItem('token')) {
            store.checkAuth();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (store.isLoading) {
        return <div>LOADING...</div>;
    }

    if (!store.isAuth) {
        return <LoginForm />;
    }

    return (
        <div className='App'>
            <h1>
                {store.isAuth
                    ? `${CONSTANTS.AUTH} ${store.user.email}`
                    : CONSTANTS.NOT_AUTH}
            </h1>
            <h2
                style={{
                    color: store.user.isActivated ? 'green' : 'red',
                }}
            >
                {store.user.isActivated
                    ? CONSTANTS.ACCOUNT_VERIFIED
                    : CONSTANTS.ACCOUNT_NOT_VERIFIED}
            </h2>
            <button onClick={() => store.logout()}>{CONSTANTS.LOGOUT}</button>
            <button onClick={getAllUsers}>{CONSTANTS.GET_USERS}</button>
            {users.map((user) => (
                <div key={user.id}>{user.email}</div>
            ))}
        </div>
    );
};

export default observer(App);
