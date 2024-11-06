## Công nghệ

- **Frontend**: React + Vite, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js, JWT Tokens
- **Database**: MongoDB
- **Real-time Communication**: Socket.io
- **Video Call**: WebRTc
- **State Management**: Redux with Redux Toolkit

## Các thư viện cần cài đặt

- **Frontend Dependencies**:
  - `react`, `react-dom`, `react-router-dom`
  - `@reduxjs/toolkit`, `react-redux`
  - `formik`, `yup`, `axios`
  - `emoji-picker-react`, `react-dropzone`, `wavesurfer.js`
  - `react-select`, `react-toastify`, `react-icons`, `react-spinners`
  - `socket.io-client`

- **Frontend Dev Dependencies**:
  - `@vitejs/plugin-react-swc`
  - `typescript`, `@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser`
  - `eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`
  - `postcss`, `autoprefixer`, `tailwindcss`


## Environment Variables
Thêm đoạn code sau vào file .env

```bash
VITE_API_CLIENT_URL=http://localhost:5000/api
VITE_API_SOCKET_URL=http://localhost:5000
VITE_API_CALLS_URL=http://localhost:5000/calls