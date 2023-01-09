import { observer } from 'mobx-react-lite';
import { useContext, useEffect } from 'react';
import { Context } from '.';
import LoginForm from './components/LoginForm';
import { CONSTANTS } from './constants';

const App = () => {
    const { store } = useContext(Context);

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
            <button onClick={() => store.logout()}>LOGOUT</button>
        </div>
    );
};

export default observer(App);
