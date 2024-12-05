import { io } from "socket.io-client";

export const socket = io(import.meta.env.VITE_SOCKET_URL);

export const createPeerConnection = (remoteStream, conversationId) => {
  const peerConnection = new RTCPeerConnection({
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
      { urls: "stun:stun2.l.google.com:19302" },
    ],
  });

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit("webrtc:ice-candidate", {
        candidate: event.candidate,
        to: conversationId,
      });
    }
  };

  peerConnection.ontrack = (event) => {
    remoteStream.addTrack(event.track);
  };

  return peerConnection;
};

export const createOffer = async (
  peerConnection,
  localStream,
  conversationId // or conversationId
) => {
  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream);
  });

  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);

  socket.emit("webrtc:offer", { offer, to: conversationId }); // or conversationId
};
export const createAnswer = async (
  peerConnection,
  localStream,
  offer,
  conversationId
) => {
  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream);
  });

  await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);

  socket.emit("webrtc:answer", { answer, to: conversationId });
};

export const handleAnswer = async (peerConnection, answer) => {
  await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
};

export const handleIceCandidate = async (peerConnection, candidate) => {
  await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
};

socket.on("connect", () => {
  console.log("Connected to signaling server");
});

socket.on("webrtc:offer", async ({ offer, from }) => {
  console.log("Received offer:", offer);
  // Handle the offer
});

socket.on("webrtc:answer", async ({ answer, from }) => {
  console.log("Received answer:", answer);
  // Handle the answer
});

socket.on("webrtc:ice-candidate", async ({ candidate, from }) => {
  console.log("Received ICE candidate:", candidate);
  // Handle the ICE candidate
});

export default socket;
