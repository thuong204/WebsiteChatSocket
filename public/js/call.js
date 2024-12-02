export const peer = new Peer(); // Tạo peer mới
const socketPeer = io()
let localStream;

peer.on('open', (id) => {
    alert(`Peer ID của bạn: ${id}`);
});



// Lấy camera và microphone
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then((stream) => {
        localStream = stream;

        // Hiển thị video của chính mình
        const localVideo = document.getElementById('local-video');
        localVideo.srcObject = stream;
        localVideo.play();
    })
    .catch((err) => console.error('Không thể truy cập camera:', err));

// Bắt đầu gọi
document.getElementById('call-peer').addEventListener('click', () => {
    const peerId = document.getElementById('peer-id').value;
    if (!peerId) return alert('Hãy nhập ID Peer để gọi.');

    const call = peer.call(peerId, localStream); // Gọi tới Peer khác

    // Nhận stream từ Peer khác
    call.on('stream', (remoteStream) => {
        const remoteVideo = document.getElementById('remote-video');
        remoteVideo.srcObject = remoteStream;
        remoteVideo.play();
    });
});
// Nhận cuộc gọi đến
peer.on('call', (call) => {
    call.answer(localStream); // Trả lời cuộc gọi với MediaStream của mình

    // Nhận stream từ Peer khác
    call.on('stream', (remoteStream) => {
        const remoteVideo = document.getElementById('remote-video');
        remoteVideo.srcObject = remoteStream;
        remoteVideo.play();
    });
});

socketPeer.on("SERVER_CALLVIDEO", (data) => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((stream) => {
            localStream = stream; // Lưu stream của người gọi
            // Hiển thị video của chính mình
            const localVideo = document.getElementById('local-video');
            localVideo.srcObject = stream;
            localVideo.play();
        })
        .catch((err) => console.error('Không thể truy cập camera:', err));
    // Khi nhận cuộc gọi từ người khác, thực hiện cuộc gọi tới người đó
    const call = peer.call(data.peerId, localStream); // Gọi đến peerId của người gọi
    console.log(call)

    if (call) {
        console.log("Cuộc gọi đã thành công.");
    }

    // Nhận stream từ người gọi và hiển thị video của họ
    call.on('stream', (remoteStream) => {
        const remoteVideo = document.getElementById('remote-video');
        remoteVideo.srcObject = remoteStream;
        remoteVideo.play();
    });
});

peer.on('call', (call) => {
    call.answer(localStream); 
    call.on('stream', (remoteStream) => {
        const remoteVideo = document.getElementById('remote-video');
        remoteVideo.srcObject = remoteStream;
        remoteVideo.play();
    });
});

