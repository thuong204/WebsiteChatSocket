// Lấy phần tử item-detail
const detailItem = document.querySelector('.item-detail a');
const detailItemActive = document.querySelector(".item-detail")
const colXl7 = document.querySelector('.chat-content');
const colXl2 = document.querySelector('.detail-content');

const scrollList = document.querySelector(".chat-body.scrollable-list");
// Hàm cuộn xuống cuối danh sách
const scrollToBottom = () => {
    scrollList.scrollTop = scrollList.scrollHeight;
};
scrollToBottom()

// Cờ để theo dõi trạng thái
let isExpanded = false;
const inputMessage = document.querySelector('.input-message'); // Lấy trường nhập liệu

// Sự kiện click
detailItem.addEventListener('click', (e) => {
    e.preventDefault(); // Ngăn chặn hành động mặc định của link

    if (isExpanded) {
        // Nếu đang mở rộng, trở lại kích thước ban đầu
        colXl7.classList.remove('col-xl-9');
        colXl7.classList.add('col-xl-6');
        detailItemActive.classList.add("active")
        inputMessage.style.width = '430px';
        colXl2.style.display = 'block';
        isExpanded = false;
    } else {
        // Mở rộng col-xl-7 thành col-xl-9
        colXl7.classList.remove('col-xl-6');
        colXl7.classList.add('col-xl-9');
        detailItemActive.classList.remove("active")
        inputMessage.style.width = '780px';
        colXl2.style.display = 'none'; // Ẩn col-xl-2
        isExpanded = true;
    }
});


const listUserChats = document.querySelectorAll("[data-user]")
const mediaImage = document.querySelector(".media-group-chat .media-img img")
const fullName = document.querySelector(".user-info h6.fullname-chat")
const mediaImageDetail = document.querySelector(".media-group .media img")
const fullNameDetail = document.querySelector(".media-group .media-col h6.fullname-chat")
listUserChats.forEach(item => {
    item.addEventListener("click", () => {
        const idReceiver = item.getAttribute("data-user")
        fetch(`/chat/receiver/${idReceiver}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); // Giả sử server trả về dữ liệu JSON
            })
            .then(data => {
                const messages = data.data.messages; // Lưu trữ dữ liệu tin nhắn
                const infoReceiver = data.data.infoReceiver;
                const chatBody = document.querySelector('.chat-body.scrollable-list'); // Chọn phần tử nơi hiển thị tin nhắn
                const myId = document.querySelector("[myId]").getAttribute("myId");

                // Xóa nội dung cũ trước khi thêm tin nhắn mới
                chatBody.innerHTML = '';

                // Tạo một phần tử chat-message để chứa tất cả các tin nhắn

                const messageElement = document.createElement('div');
                messageElement.classList.add('chat-message', 'd-flex'); // Thêm class để định dạng

                messages.forEach(message => {
                    let individualMessage;

                    let htmlImages = '';
                    if (message.images && message.images.length > 0) {
                        htmlImages = `<div class="reply-image d-flex">`;
                        message.images.forEach(image => {
                            htmlImages += `<img src="${image}" width="100" height="100">`;
                        });
                        htmlImages += `</div>`;
                    }

                    let htmlFiles = '';
                    if (message.files && message.files.length > 0) {
                        htmlFiles = `<div class="reply-file">`;
                        message.files.forEach(file => {
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
                                            </div>`;
                        });
                        htmlFiles += `</div>`;
                    }

                    let htmlText = message.content ? `<div class="reply-text">${message.content}</div>` : '';

                    // Kiểm tra xem tin nhắn có phải là tin nhắn gửi đi hay không
                    if (message.sender === myId) { // currentUserId là ID của người dùng hiện tại
                        individualMessage = `
                            <div class="reply-item outgoing">
                                <div class="reply-group">
                                    <div class="reply-bubble">
                                        ${htmlText}
                                        ${htmlImages}
                                        ${htmlFiles}
                                    </div>
                                </div>
                            </div>`;
                    } else {
                        individualMessage = `
                            <div class="reply-item incoming">
                                <div class="reply-avatar">
                                    <div class="media">
                                        <img src="${infoReceiver.avatar ? infoReceiver.avatar : 'https://res.cloudinary.com/dwk6tmsmh/image/upload/v1730012457/wcyuwuirlhgthg9jqhcx.png'}" width="32" height="32" class="rounded-circle" alt="User Avatar">
                                    </div>
                                </div>
                                <div class="reply-group">
                                    <div class="reply-bubble">
                                    ${htmlText}
                                    ${htmlImages}
                                    ${htmlFiles}
                                    </div>
                                </div>
                            </div>`;
                    }

                    // Thêm tin nhắn vào messageElement
                    messageElement.innerHTML += individualMessage; // Sử dụng += để thêm tin nhắn mới vào nội dung hiện tại
                });

                // Thêm phần tử chat-message vào chatBody
                chatBody.appendChild(messageElement);

                const itemActive = document.querySelector(".aside-item-chat.active")

                itemActive.classList.remove("active")
                item.classList.add("active")


                mediaImage.setAttribute("src", infoReceiver.avatar)
                fullName.textContent = infoReceiver.fullName

                mediaImageDetail.setAttribute("src", infoReceiver.avatar)
                fullNameDetail.textContent = infoReceiver.fullName

                scrollToBottom()

                const event = new CustomEvent('audioListUpdated');
                document.dispatchEvent(event);

                const roomid = data.data.roomId
                history.pushState(null, '', `/chat/${roomid}`);

            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });

    })
})


const initializeAudioPlayers = () => {
    let audioContainers = document.querySelectorAll(".audio-container");

    audioContainers.forEach(container => {
        const audio = container.querySelector(".custom-audio-player");
        const playButton = container.querySelector(".custom-play-button");
        const pauseButton = container.querySelector(".custom-pause-button");
        const progressBar = container.querySelector(".custom-progress-bar");
        const currentTimeLabel = container.querySelector(".custom-current-time");

        // Phát âm thanh
        playButton.addEventListener("click", () => {
            audio.play();
            playButton.classList.add("d-none"); // Ẩn nút play
            pauseButton.classList.remove("d-none"); // Hiển thị nút pause
        });

        // Tạm dừng âm thanh
        pauseButton.addEventListener("click", () => {
            audio.pause();
            pauseButton.classList.add("d-none"); // Ẩn nút pause
            playButton.classList.remove("d-none"); // Hiển thị nút play
        });

        // Cập nhật currentTime khi audio phát
        audio.addEventListener("timeupdate", () => {
            const progress = (audio.currentTime / audio.duration) * 100;
            progressBar.value = progress; // Cập nhật thanh tiến trình ngay lập tức
            currentTimeLabel.textContent = formatTime(audio.currentTime); // Cập nhật thời gian hiện tại
        });

        // Khi âm thanh kết thúc, chuyển nút pause thành nút play
        audio.addEventListener("ended", () => {
            pauseButton.classList.add("d-none"); // Ẩn nút pause
            playButton.classList.remove("d-none"); // Hiển thị nút play
        });

        // Định dạng thời gian (phút:giây)
        const formatTime = (seconds) => {
            const minutes = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${minutes}:${secs < 10 ? "0" + secs : secs}`; // Trả về thời gian theo định dạng MM:SS
        };

        // Điều chỉnh thanh tiến trình khi người dùng kéo
        progressBar.addEventListener("input", () => {
            audio.currentTime = (progressBar.value / 100) * audio.duration; // Điều chỉnh currentTime theo thanh tiến trình
        });
    });
};

initializeAudioPlayers();

document.addEventListener('audioListUpdated', function() {
    initializeAudioPlayers();
})
// Gọi hàm để khởi tạo tất cả các audio players




