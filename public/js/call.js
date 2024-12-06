const peer = new Peer(); // Tạo peer mới
let localStream;
let peerId;

// Khởi tạo localStream ngay khi mở trang
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then((stream) => {
        localStream = stream;
        // Hiển thị video của chính mình
        const localVideo = document.getElementById('local-video');
        localVideo.srcObject = stream;
        localVideo.oncanplay = () => localVideo.play();
    })
    .catch((err) => {
        console.error('Không thể truy cập camera:', err);
        alert('Không thể truy cập camera, vui lòng kiểm tra lại quyền truy cập.');
    });

peer.on('open', (id) => {
    peerId = id; // Lưu peerId vào biến peerId toàn cục
    const myid = document.querySelector("[myId]").getAttribute("myId");
    socket.emit("CLIENT_SAVE_PEER", {
        peerId: id,
        userId: myid
    });

    socket.on("SERVER_RETURN_MAKE_CALL", (data) => {
        if (id == data.peerIdReceiver) {
            if (localStream) {
                console.log(data.peerIdReceiver)
                console.log(data.peerIdCall)
                const call = peer.call(data.peerIdCall, localStream); // Gọi với localStream
                call.on('stream', (remoteStream) => {
                    const remoteVideo = document.getElementById('remote-video');
                    remoteVideo.srcObject = remoteStream;
                    remoteVideo.oncanplay = () => remoteVideo.play();
                });
            } else {
                console.error('Local stream chưa được khởi tạo');
            }
        }
    });


    socket.on("USER_RETURN_DISCONNECTED_PEER", (userCall) => {

        Swal.fire({
            title: 'Cuộc gọi đã kết thúc',
            text: `Cuộc gọi với người dùng ${userCall.fullName} đã kết thúc.`,
            icon: 'info',
            confirmButtonText: 'Đóng'
        });
    });

    // Lắng nghe cuộc gọi đến
    peer.on('call', (call) => {
        if (localStream) {
            call.answer(localStream); // Trả lời với localStream
            // Nhận stream từ Peer khác
            call.on('stream', (remoteStream) => {
                const remoteVideo = document.getElementById('remote-video');
                remoteVideo.srcObject = remoteStream;
                remoteVideo.oncanplay = () => remoteVideo.play();
            });
        } else {
            console.error('Local stream chưa được khởi tạo');
            alert('Local stream chưa được khởi tạo. Vui lòng kiểm tra lại camera/microphone.');
        }
    });

    // Xử lý sự kiện khi peer bị đóng kết nối
    peer.on('close', () => {
        socket.emit("USER_DISCONNECTED", { peerId: peerId }); // Sử dụng peerId đã gán
    });


    const btnFinish = document.querySelector("[btn-finish]")
    btnFinish.addEventListener("click", () => {
        peer.destroy()
        socket.emit("USER_DISCONNECTED_PEER", id);
    })

    // Xử lý sự kiện khi peer bị ngắt kết nối
    peer.on('disconnected', () => {
        socket.emit("USER_DISCONNECTED_PEER", id); 
        window.close(); 
    });
});

// Khi đóng cửa sổ hoặc thoát ứng dụng, ngắt kết nối Peer
window.addEventListener('beforeunload', () => {
    if (peer && peer.open) {
        peer.destroy();  // Ngắt kết nối Peer
    }
});
