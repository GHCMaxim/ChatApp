import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Cookies from 'universal-cookie';

const cookies = new Cookies();



// Utility function for date formatting
const formatDate = (dateString) => {
    const inputDate = new Date(dateString);
    const currentDate = new Date();

    // Check if the date is today
    if (
        inputDate.getFullYear() === currentDate.getFullYear() &&
        inputDate.getMonth() === currentDate.getMonth() &&
        inputDate.getDate() === currentDate.getDate()
    ) {
        return inputDate.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        });
    }

    // Check if the date is within the same week
    const oneWeekAgo = new Date(currentDate);
    oneWeekAgo.setDate(currentDate.getDate() - 7);

    if (inputDate >= oneWeekAgo && inputDate < currentDate) {
        return inputDate.toLocaleDateString("en-US", {
            weekday: "short"
        });
    }

    // For dates outside the current week, use the specified format
    const day = inputDate.getDate().toString().padStart(2, '0');
    const month = (inputDate.getMonth() + 1).toString().padStart(2, '0');
    const year = inputDate.getFullYear();

    return `${day}.${month}.${year}`;
};

// Conversation Item Component
const Conversation = React.memo(({
                                     conversation,
                                     changeConversationId,
                                     isActive = false,
                                     onSelectConversation,
                                     user,
                                 }) => {
    const { id, name, Messages } = conversation;
    const latestMessage = Messages[0];

    const handleConversationChange = useCallback(() => {
        changeConversationId(id);
        onSelectConversation(id);
    }, [id, changeConversationId, onSelectConversation]);

    return (
        <li
            className={`
        grid grid-cols-8 grid-rows-2 
        hover:bg-gray-700 
        p-2 rounded-md 
        cursor-pointer 
        ${isActive ? 'bg-gray-800' : ''}
      `}
            onClick={handleConversationChange}
        >
            <div className='rounded-full w-[60px] h-[60px] bg-gray-600 col-span-2 row-start-1 col-start-1 row-end-3 flex items-center justify-center text-white'>
                {name.charAt(0).toUpperCase()}
            </div>
            <div className='col-start-3 row-span-1 col-end-9'>
                <div className='flex w-full justify-between items-center'>
                    <p className='text-white text-xl font-semibold'>{name}</p>
                    <p className='text-gray-400 text-sm'>
                        {formatDate(latestMessage.createdAt)}
                    </p>
                </div>
            </div>
            <div className='col-start-3 row-span-1 col-end-9'>
                <div className='flex w-full justify-between items-center'>
                    <p className='text-gray-400 text-md truncate max-w-[70%]'>
                        {user.id == latestMessage.senderId ? "You: " : ""}
                        {latestMessage.content}
                    </p>
                </div>
            </div>
        </li>
    );
});

// Conversation List Component
const ConversationList = ({ changeConversationId }) => {
    const [conversations, setConversations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeConversationId, setActiveConversationId] = useState(null);

    const user = useMemo(() => cookies.get('user'), []);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const token = cookies.get('token');
                if (!token) {
                    throw new Error('Authentication token is missing');
                }

                const response = await fetch('http://localhost:3000/api/conversations', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to fetch conversations');
                }

                const data = await response.json();

                console.log(data);

                setConversations(data);

                // Automatically select the first conversation if available
                if (data.length > 0) {
                    const firstConvId = data[0].id;
                    setActiveConversationId(firstConvId);
                    changeConversationId(firstConvId);
                }
            } catch (err) {
                setError(err.message);
                console.error('Conversation fetch error:', err);
            } finally {
                setIsLoading(false);
            }
        };

        // Only fetch if user is authenticated
        if (user?.id) {
            fetchConversations();
        }
    }, []);

    // Handler to update active conversation
    const handleSelectConversation = useCallback((conversationId) => {
        setActiveConversationId(conversationId);
    }, []);

    // Render loading or error states
    if (isLoading) {
        return (
            <div className="p-4 text-center text-gray-400">
                Loading conversations...
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 text-center text-red-500">
                {error}
                <button
                    onClick={() => window.location.reload()}
                    className="ml-2 bg-blue-500 text-white px-3 py-1 rounded"
                >
                    Retry
                </button>
            </div>
        );
    }

    // No conversations found
    if (conversations.length === 0) {
        return (
            <div className="p-4 text-center text-gray-400">
                No conversations found
            </div>
        );
    }

    return (
        <div className="p-4 w-full h-fit">
            <ul className='flex flex-col gap-1'>
                {conversations.map((conversation) => (
                    <Conversation
                        key={conversation.id}
                        conversation={conversation}
                        changeConversationId={changeConversationId}
                        isActive={activeConversationId === conversation.id}
                        onSelectConversation={handleSelectConversation}
                        user={user}
                    />
                ))}
            </ul>
        </div>
    );
};

export default ConversationList;