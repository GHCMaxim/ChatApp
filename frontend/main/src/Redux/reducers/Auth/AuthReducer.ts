
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import userService from "./AuthService";
import { toast } from "react-toastify";
import { CommonProperties } from "../msg/MsgReducer";
import { Chat } from "../../ChatTypes";



const getUserFromLocalStorage = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token') as string) : null

export interface UserState extends CommonProperties {
    id: string;
    name: string;
    about: string;
    profile: string;
    socket_id: string; // Thêm socket_id
    email: string; // Thêm email
    chat: any[]; // Mảng hội thoại
    lastMessage: any; // Thông điệp cuối cùng
    unreadCount: number; // Số lượng thông báo chưa đọc
    password?: string | null;
    refreshToken?: string | null;
    role?: string | null;
    isBlocked?: string | null;
    otp?: any;
}


export const upateUser = createAsyncThunk('authSlice/upateUser', async (data: { id: string, value: { name?: string, about?: string, profile?: string } }, thunkAPI) => {
    try {
        const res = await userService.upateUser(data.id, data.value)
        return res

    } catch (error: any) {
        // localStorage.removeItem("token")
        return thunkAPI.rejectWithValue(error?.response?.data)
    }
})
export const uploadProfile = createAsyncThunk('authSlice/uploadProfile', async (data: any, thunkAPI) => {
    try {
        const res = await userService.uploadProfilePicture(data.images, data._id)
        return res
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error?.response?.data)
    }
})
export const logout = createAsyncThunk('authSlice/logoutUser', async (_, thunkAPI) => {
    try {
        const res = await userService.logout()
        return res

    } catch (error: any) {
        localStorage.removeItem("token")
        return thunkAPI.rejectWithValue(error?.response?.data)
    }
})

export const sendOtp = createAsyncThunk('authSlice/sendOtp', async (mobile: string, thunkAPI) => {
    try {
        const res = await userService.sendotp(mobile)
        return res
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error?.response?.data)
    }
})
export const VerifyOtp = createAsyncThunk('authSlice/Verifyotp', async (data: { otp: string[] }, thunkAPI) => {
    try {
        const res = await userService.verifyOtp(data.otp)
        return res

    } catch (error: any) {
        // localStorage.removeItem("token")
        return thunkAPI.rejectWithValue(error?.response?.data)
    }
})

interface AppState {
    screen: boolean,
    user: UserState | null;
    startCall: { userId: any, call: boolean };
    isError: boolean;
    isLoading: boolean;
    isProfileLoading: boolean;
    isSuccess: boolean;
    message: string;
    address: boolean;
    userName: string;
    chats: Chat[];
}

const sampleUsers: UserState[] = Array.from({ length: 10 }, (_, i) => ({
    id: `user${i + 1}`,
    name: `User ${i + 1}`,
    about: "This is a sample user",
    profile: `https://randomuser.me/api/portraits/men/${i + 1}.jpg`,
    password: null, // Hoặc giá trị mặc định
    refreshToken: null, // Hoặc giá trị mặc định
    role: "user", // Hoặc giá trị mặc định
    isBlocked: "0", // Hoặc giá trị mặc định
    otp: null, // Hoặc giá trị mặc định
    socket_id: `socket${i + 1}`, // Thêm socket_id
    email: `user${i + 1}@example.com`, // Thêm email
    chat: [], // Khởi tạo mảng chat rỗng
    lastMessage: null, // Khởi tạo lastMessage với giá trị null
    unreadCount: 0 // Khởi tạo unreadCount với giá trị 0
}));

const sampleChats: Chat[] = Array.from({ length: 5 }, (_, i) => ({
    id: `chat${i + 1}`,
    participants: [`user${i + 1}`, `user${(i + 2) % 10 + 1}`],
    messages: Array.from({ length: 5 }, (_, j) => ({
        id: `message${i + 1}-${j + 1}`,
        senderId: `user${(i + j + 1) % 10 + 1}`,
        content: `Tin nhắn ${j + 1} trong cuộc trò chuyện ${i + 1}`, // Thay đổi từ 'text' thành 'content'
        receiverId: `user${(i + 3) % 10 + 1}`, // Thêm receiverId với một giá trị phù hợp
        timestamp: new Date().toISOString(),
    })),
    lastMessage: {
        id: `message${i + 1}-5`,
        senderId: `user${(i + 5) % 10 + 1}`,
        content: `Tin nhắn cuối cùng trong cuộc trò chuyện ${i + 1}`, // Thay đổi từ 'text' thành 'content'
        receiverId: `user${(i + 3) % 10 + 1}`, // Thêm receiverId
        timestamp: new Date().toISOString(),
    }
}));




const initialState: AppState = {
    screen: false,
    user: sampleUsers[0],  // Lấy user đầu tiên làm mẫu đăng nhập
    startCall: { userId: null, call: false },
    isError: false,
    isLoading: false,
    isProfileLoading: false,
    isSuccess: false,
    message: "",
    address: false,
    userName: "",
    chats: sampleChats
};


const authSlice = createSlice({
    name: 'authSlice',
    initialState,
    reducers: {
        handleUser: (state, action) => {
            state.user = action.payload
        },
        setStartCall: (state, action) => {
            state.startCall = action.payload
        },
    },
    extraReducers: (builder) => {
        builder.addCase(logout.pending, (state) => {
            state.isLoading = true
            state.isSuccess = false
            state.isError = false
        }).addCase(logout.fulfilled, (state, action: PayloadAction<any>) => {
            state.isLoading = false
            state.isSuccess = true
            state.user = null
            state.message = action.payload?.message
            toast.success(state.message, {
                position: 'top-right'
            })
        }).addCase(logout.rejected, (state, action: PayloadAction<any>) => {
            state.isError = true
            state.isLoading = false
            state.user = null
            state.message = action.payload?.message
            toast.error(state.message, {
                position: 'top-right'
            })
        })
        builder.addCase(sendOtp.pending, (state) => {
            state.isLoading = true
        }).addCase(sendOtp.fulfilled, (state, action: PayloadAction<any>) => {
            state.isLoading = false
            state.isSuccess = true
            state.message = action.payload?.message
            toast.success(state.message, {
                position: 'top-left'
            })
        }).addCase(sendOtp.rejected, (state, action: PayloadAction<any>) => {
            state.isLoading = false
            state.isError = true
            state.isSuccess = false
            state.message = action.payload?.message
            toast.error(state.message, {
                position: 'top-left'
            })
        })
        builder.addCase(VerifyOtp.pending, (state) => {
            state.isLoading = true
        }).addCase(VerifyOtp.fulfilled, (state, action: PayloadAction<any>) => {
            state.isLoading = false
            state.isSuccess = true
            state.message = action.payload?.message
            state.user = action.payload.user
            toast.success(state.message, {
                position: 'top-left'
            })
        }).addCase(VerifyOtp.rejected, (state, action: PayloadAction<any>) => {
            state.isLoading = false
            state.isError = true
            state.isSuccess = false
            state.user = null
            state.message = action.payload?.message
            toast.error(state.message, {
                position: 'top-left'
            })
        })
        builder.addCase(upateUser.pending, (state) => {
            state.isLoading = true
        }).addCase(upateUser.fulfilled, (state, action: PayloadAction<any>) => {
            state.isLoading = false
            state.isSuccess = true
            state.user = action.payload
            toast.success("name/ about is updated sucessfully", {
                position: 'top-left'
            })
        }).addCase(upateUser.rejected, (state) => {
            state.isLoading = false
            state.isError = true
            state.isSuccess = false
            toast.error("Unable to update the user", {
                position: 'top-left'
            })
        })
        builder.addCase(uploadProfile.pending, (state) => {
            state.isProfileLoading = true
        }).addCase(uploadProfile.fulfilled, (state, action: PayloadAction<any>) => {
            state.isProfileLoading = false
            state.isSuccess = true
            state.user = action.payload
            toast.success("User profile picture is updated sucessfully", {
                position: 'top-left'
            })
        }).addCase(uploadProfile.rejected, (state) => {
            state.isProfileLoading = false
            state.isError = true
            state.isSuccess = false
            toast.error("Unable to upload the DP", {
                position: 'top-left'
            })
        })
    }

})

export const { handleUser, setStartCall } = authSlice.actions
export default authSlice.reducer