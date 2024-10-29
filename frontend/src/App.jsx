import { Auth } from './components';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const authToken = cookies.get('token');

function App() {
    if (!authToken) {
        return <Auth />;
    }

    return (
        <>
            {/* TODO: DashBoard or something*/}

            <h3>You&#39;re logged in!</h3>
            <button className={'btn btn-error text-white'}
                onClick={() => {
                    cookies.remove('token');
                    cookies.remove('user');
                    window.location.reload();
                }}>
                Logout
            </button>
        </>
    )
}

export default App
