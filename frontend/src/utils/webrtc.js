import { io } from "socket.io-client";

const socket = io(process.env.REACT_APP_SOCKET_URL);

export const createPeerConnection = (remoteStream) => {
    const peerConnection = new RTCPeerConnection({
        iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:stun1.l.google.com:19302" },
            { urls: "stun:stun2.l.google.com:19302" }
        ]
    });

    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            socket.emit("webrtc:ice-candidate", { candidate: event.candidate, to: remoteSocketId });
        }
    };

    peerConnection.ontrack = (event) => {
        remoteStream.addTrack(event.track);
    };

    return peerConnection;
};

export const createOffer = async (peerConnection, localStream, remoteSocketId) => {
    localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream);
    });

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    socket.emit("webrtc:offer", { offer, to: remoteSocketId });
};

export const createAnswer = async (peerConnection, localStream, offer, remoteSocketId) => {
    localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream);
    });

    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    socket.emit("webrtc:answer", { answer, to: remoteSocketId });
};

export const handleAnswer = async (peerConnection, answer) => {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
}

export const handleIceCandidate = async (peerConnection, candidate) => {
    await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
}

export default socket;