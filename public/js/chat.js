const socket = io()
let audioBlob;
const scrollList = document.querySelector(".chat-body.scrollable-list");
// Hàm cuộn xuống cuối danh sách
const scrollToBottom = () => {
    scrollList.scrollTop = scrollList.scrollHeight;
};
const form = document.getElementById("form-send")


const upload = new FileUploadWithPreview.FileUploadWithPreview('upload-image', {
    multiple: true,
    maxFileCount: 6,
});


// const inputImage  = document.getElementById("file-upload-with-preview-upload-image")

// inputImage.setAttribute("accept","image/*")
if (form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault()
        const content = e.target.elements.content.value

        const files = upload.cachedFileArray || []
        const images = files.filter(file => file.type.startsWith("image/")) || [];

        const otherFiles = files.filter(file => !file.type.startsWith("image/")).map(file => ({
            buffer: file, // hoặc file.arrayBuffer() nếu bạn cần buffer
            name: file.name // Lưu tên file
        }));

        let audioFile = null;
        if (audioBlob) {
            const buffer = await audioBlob.arrayBuffer();
            audioFile = {
                buffer: buffer,
                name: "recorded_audio.wav", // Đặt tên file ghi âm
                type: "audio/wav" // Định dạng file ghi âm
            };
        }


        if (content || images.length > 0 || otherFiles.length > 0 || audioBlob) {
            socket.emit("CLIENT_SEND_MESSAGE", {
                content: content,
                images: images,
                files: [...otherFiles, audioFile].filter(Boolean)
            })
            audioBlob = ""
            e.target.elements.content.value = ""
            clearMedia();
            upload.resetPreviewPanel(); // clear all selected images
        }
    })
}

socket.on('SERVER_RETURN_MESSAGE', (data) => {
    const userId = document.querySelector("[myId]")
    const message = document.querySelector(".chat-message")
    const div = document.createElement("div")
    const replyMessages = document.querySelectorAll(".reply-item");
    const lastReplyMessage = replyMessages[replyMessages.length - 1];

    // Xu li hinh anh tin nhan file
    let htmlImages = '';
    if (data.images && data.images.length > 0) {
        htmlImages = `<div class="reply-image d-flex">`;
        data.images.forEach(image => {
            htmlImages += `<img src="${image}" width="100" height="100">`;
        });
        htmlImages += `</div>`;
    }

    let htmlFiles = '';
    if (data.files && data.files.length > 0) {
        htmlFiles = `<div class="reply-file">`;
        data.files.forEach(file => {
            htmlFiles += `  <div class="audio-container">
                                <audio class="custom-audio-player" controls>
                                    <source src=${file.link} type="audio/mpeg">
                                </audio>
                                <button class="custom-play-button">
                                    <i class="fa-solid fa-play"></i>
                                </button>
                                <button class="custom-pause-button d-none">
                                    <i class="fa-solid fa-pause"></i>
                                </button>
                                <input class="custom-progress-bar" type="range" min="0" max="100" value="0">
                                <span class="custom-current-time">0:00</span>
                            </div>
`;
        });
        htmlFiles += `</div>`;
    }

    let htmlText = data.content ? `<div class="reply-text">${data.content}</div>` : '';

    let htmlContent = `
        <div class="reply-group">
            <div class="reply-bubble">
                ${htmlText}
                ${htmlImages} 
                ${htmlFiles}
                <div class="reply-tool"></div>
            </div>
        </div>
    `;


    if (data.sender == userId.getAttribute("myId")) {
        div.classList.add("reply-item")
        div.classList.add("outgoing")
        if (data.content || data.images || data.files) {
            div.innerHTML = `
        ${htmlContent}
        `
        }

        if (lastReplyMessage) {
            lastReplyMessage.insertAdjacentElement("afterend", div);
        } else {
            message.appendChild(div);
        }
        scrollToBottom();


    } else {
        div.classList.add("reply-item")
        div.classList.add("incoming")

        let htmlSender = `
            <div class="reply-avatar">
                <div class="media">
                    <img 
                        src= ${data.receiver.avatar}
                        width="32" 
                        height="32" 
                        class="rounded-circle"
                    />
                </div>
            </div>
       `
        if (data.content || data.images || data.files) {
            div.innerHTML = `
        ${htmlSender}
        ${htmlContent}
        `
        }

        if (lastReplyMessage) {
            lastReplyMessage.insertAdjacentElement("afterend", div);
        } else {
            // Nếu không có tin nhắn nào, chèn vào đầu danh sách
            message.appendChild(div);
        }
        scrollToBottom();

    }
    const event = new CustomEvent('audioListUpdated');
    document.dispatchEvent(event);
})
document.addEventListener("DOMContentLoaded", () => {
    // Cuộn xuống dưới cùng khi truy cập vào trang
    scrollToBottom();
})


import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'

const emojiPicker = document.querySelector("emoji-picker")
const tooltip = document.querySelector('.tooltip')
const inputChat = document.querySelector(".input-message")
const button = document.querySelector(".btn-icon-emoji")
console.log(button)
if (button) {
    Popper.createPopper(button, tooltip, {
        placement: 'top', // Position the tooltip above the button
    });
    button.addEventListener("click", () => {
        tooltip.classList.toggle('shown')
    })
}
if (emojiPicker) {
    emojiPicker.addEventListener("emoji-click", (event) => {
        const icon = event.detail.unicode
        inputChat.value = inputChat.value + icon
        const end = inputChat.value.length
        inputChat.setSelectionRange(end, end)
        inputChat.focus()
    })
}


//upload file
// const fileUploadButton = document.querySelector(".files-text");
// const fileInput = document.querySelector(".fileInput");
// const filePreviewContainer = document.querySelector(".file-preview");
// console.log(filePreviewContainer)

// fileUploadButton.addEventListener("click", () => {
//     fileInput.click();
// });

// fileInput.addEventListener("change", (event) => {
//     const files = event.target.files;

//     if (files.length > 0) {
//         const file = files[0];

//         // Kiểm tra loại tệp và loại bỏ ảnh
//         if (file.type.startsWith("image/")) {
//             alert("Chỉ chấp nhận các tệp PDF và tài liệu Word.");
//             fileInput.value = ""; // Reset input
//             filePreviewContainer.innerHTML = ""; // Xóa preview nếu có
//         } else {
//             // Hiển thị tên tệp nếu không phải hình ảnh
//             filePreviewContainer.textContent = `Tên tệp: ${file.name}`;
//             console.log("ok")
//         }
//     }
// });
// ghi âm
document.addEventListener("DOMContentLoaded", () => {
    const audio = document.querySelector(".playback-audio");
    const recordButton = document.querySelector(".record-button");
    const stopButton = document.querySelector(".stop-button");
    const playButton = document.querySelector(".play-button");
    const pauseButton = document.querySelector(".pause-button");
    const exitButton = document.querySelector(".exit-button");
    const progressBar = document.querySelector(".audio-progress-bar");
    const timeInfo = document.querySelector(".time-info")
    const currentTimeLabel = document.querySelector(".current-time");
    const totalTimeLabel = document.querySelector(".total-time");

    let mediaRecorder;
    let audioChunks = [];
    let audioUrl;
    let isRecording = false;
    let isPlaying = false;
    let audioDuration = 0;
    let audioStream;
    let recordingStartTime; // Thêm biến lưu thời gian bắt đầu ghi âm
    let recordingInterval; // Thêm biến lưu interval để cập nhật thời gian

    // Bắt đầu ghi âm
    recordButton.onclick = (e) => {
        e.preventDefault();

        clearAudio();
        startRecording();
        progressBar.classList.remove("d-none");
        timeInfo.classList.remove("d-none");
        recordButton.classList.add("d-none");
        stopButton.classList.remove("d-none");
        exitButton.classList.remove("d-none");
    };

    // Dừng ghi âm
    stopButton.onclick = (e) => {
        e.preventDefault();
        if (mediaRecorder) {
            mediaRecorder.stop();
            stopButton.classList.add("d-none");
            playButton.classList.remove("d-none");
            clearInterval(recordingInterval); // Dừng cập nhật thời gian khi ghi âm dừng
            stopRecording();
        }
    };

    // Phát lại âm thanh
    playButton.onclick = (e) => {
        e.preventDefault();
        audio.play();
        playButton.classList.add("d-none");
        pauseButton.classList.remove("d-none");
        isPlaying = true;
    };

    // Tạm dừng phát lại
    pauseButton.onclick = (e) => {
        e.preventDefault()
        audio.pause();
        pauseButton.classList.add("d-none");
        playButton.classList.remove("d-none");
        isPlaying = false;
    };

    // Thoát và dừng phát lại
    exitButton.onclick = (e) => {
        e.preventDefault();
        clearAudio();
        stopRecording();
        exitButton.classList.add("d-none");
        playButton.classList.add("d-none");
        pauseButton.classList.add("d-none");
        stopButton.classList.add("d-none");
        progressBar.classList.add("d-none");
        timeInfo.classList.add("d-none")
        recordButton.classList.remove("d-none");
    };

    // Lắng nghe sự kiện stop của MediaRecorder
    function startRecording() {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                audioStream = stream;
                mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.ondataavailable = event => {
                    audioChunks.push(event.data);
                };

                mediaRecorder.onstop = () => {
                    audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                    audioUrl = URL.createObjectURL(audioBlob);
                    audio.src = audioUrl;
                    audioChunks = [];
                };

                mediaRecorder.start();
                recordingStartTime = Date.now(); // Lưu thời gian bắt đầu ghi âm

                // Cập nhật current time mỗi 100ms
                recordingInterval = setInterval(updateCurrentTime, 100);
            })
            .catch(error => console.error('Error accessing audio devices: ', error));
    }


    function stopRecording() {
        // Dừng ghi âm
        mediaRecorder.stop();
        isRecording = false;
        console.log('Recording stopped');

        // Dừng stream và tắt mic
        if (audioStream) {
            audioStream.getTracks().forEach(track => {
                track.stop();  // Dừng tất cả các track trong stream, tắt mic
            });
        }
    }

    function clearAudio() {
        // Reset audio source và các thành phần liên quan
        if (audio.src) {
            audio.pause(); // Dừng âm thanh nếu đang phát
            audio.currentTime = 0; // Reset currentTime về 0
        }

        if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.stop(); // Dừng ghi âm nếu đang ghi
        }
        audio.src = '';
        audioChunks = [];
        progressBar.value = 0;
        currentTimeLabel.textContent = "0:00"; // Reset current time về 0
        clearInterval(recordingInterval); // Dừng việc cập nhật thời gian nếu có
    }
    const updateCurrentTime = () => {
        // Tính thời gian trôi qua từ khi bắt đầu ghi âm
        const currentTime = (Date.now() - recordingStartTime) / 1000;
        currentTimeLabel.textContent = formatTime(currentTime); // Cập nhật current time
        progressBar.value = (currentTime / audioDuration) * 100; // Cập nhật thanh tiến trình
    };

    // Định dạng thời gian
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? "0" + secs : secs}`;
    }

    // Khi kéo thanh tiến trình
    progressBar.oninput = () => {
        audio.currentTime = (progressBar.value / 100) * audioDuration;

    };
});

const clearMedia = () => {
    const audio = document.querySelector(".playback-audio");
    const recordButton = document.querySelector(".record-button");
    const stopButton = document.querySelector(".stop-button");
    const playButton = document.querySelector(".play-button");
    const pauseButton = document.querySelector(".pause-button");
    const exitButton = document.querySelector(".exit-button");
    const progressBar = document.querySelector(".audio-progress-bar");
    const timeInfo = document.querySelector(".time-info")
    exitButton.classList.add("d-none");
    playButton.classList.add("d-none");
    pauseButton.classList.add("d-none");
    stopButton.classList.add("d-none");
    progressBar.classList.add("d-none");
    timeInfo.classList.add("d-none")
    recordButton.classList.remove("d-none");
}

// call

let myId; // Kết nối với server

// Kiểm tra xem peer đã được tạo chưa, nếu chưa thì tạo mới

// const peer = new Peer(); // Tạo peer mới

// // Lấy userId từ DOM
// const userIdElement = document.querySelector("[myId]");
// if (userIdElement) {
//     myId = userIdElement.getAttribute("myId");
// }

// // Hiển thị ID Peer của chính mình và đăng ký với server
// peer.on('open', (id) => {
//     alert(`Peer ID của bạn: ${id}`);
//     socket.emit("CLIENT_REGISTER", {
//         userId: myId,
//         peerId: id
//     });
// });

// Nhận cuộc gọi đến

// Lắng nghe sự kiện "CLIENT_CALLVIDEO" từ server


// Bắt sự kiện click để thực hiện cuộc gọi
const itemVideo = document.querySelector(".item-video");
let idUserReceiver = document.querySelector("[userreceiveinfo]");
if (idUserReceiver) {
    idUserReceiver = idUserReceiver.getAttribute("userreceiveinfo");
}
const userId = document.querySelector("[myid]").getAttribute("myid")
let localStream
// Khi người gọi nhấn vào để gọi
if (itemVideo) {
    itemVideo.addEventListener("click", () => {

        // Gửi thông báo đến server về người nhận cuộc gọi
        socket.emit("CLIENT_CALLVIDEO", {
            callerId: userId,
            calleeId: idUserReceiver
        });

        const videoCallWindow = window.open(
            `video/${idUserReceiver}`, // Đường dẫn tới trang video call
            "_blank",          // Mở trong tab hoặc cửa sổ mới
            "width=800,height=600,toolbar=no,location=no"
        );
        // Kiểm tra nếu cửa sổ bị chặn bởi trình duyệt
        if (!videoCallWindow) {
            alert("Cửa sổ bật lên bị chặn. Hãy bật popup trong trình duyệt của bạn.");
        }
        // Lấy media stream từ camera và microphone
    });
}

// Lắng nghe cuộc gọi từ server

// Xử lý khi có cuộc gọi đến


socket.on("SERVER_RETURN_USER_ONLINE", (userId) => {
    const dataUser = document.querySelector(`[data-user="${userId}"]`)
    if (dataUser) {
        const active = dataUser.querySelector(".dot-active.d-none")
        if (active) {
            active.classList.remove("d-none")
        }

    }
})
socket.emit("CLIENT_LOGIN", userId)

socket.on("SERVER_CALLVIDEO", (data) => {
    console.log("Nhận yêu cầu gọi video từ: ", data.callerId);

    Swal.fire({
        title: 'Yêu cầu cuộc gọi video',
        text: `Bạn có muốn nhận cuộc gọi từ ${data.callerId}?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Chấp nhận',
        cancelButtonText: 'Từ chối'
    }).then((result) => {
        if (result.isConfirmed) {
            const videoCallWindow = window.open(
                `video/${data.callerId}`,
                "_blank",
                "width=800,height=600,toolbar=no,location=no"
            );
            socket.emit("CLIENT_ACCEPT_CALL", {
                userId: data.userId,
            });
            if (!videoCallWindow) {
                alert("Cửa sổ bật lên bị chặn. Hãy bật popup trong trình duyệt của bạn.");
            }
        } else {
            socket.emit("CLIENT_REJECT_CALL", {
                userId: data.userId
            });
            console.log("Cuộc gọi bị từ chối");
        }
    });
});





