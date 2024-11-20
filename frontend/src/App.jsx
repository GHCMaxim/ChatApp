import {Auth, ChatWindow, LeftPanel} from './components';
import Cookies from 'universal-cookie';
import {useState} from "react";

const cookies = new Cookies();

const authToken = cookies.get('token');

function App() {
    if (!authToken) {
        return <Auth />;
    }

    const [conversationId, setConversationId] = useState();

    const changeConversationId = (value) => {
        setConversationId(value);
        console.log(conversationId);
    }

    return (
        <>
            {/* TODO: DashBoard or something*/}

            <div className="flex bg-nav-bg  h-screen">
                <LeftPanel changeConversationId={changeConversationId} />
                <ChatWindow conversationId={conversationId} />
            </div>
        </>
    )
}

export default App
