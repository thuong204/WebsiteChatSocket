// Lấy phần tử item-detail
const detailItem = document.querySelector('.item-detail a');
const detailItemActive = document.querySelector(".item-detail")
const colXl7 = document.querySelector('.chat-content');
const colXl2 = document.querySelector('.detail-content');

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

console.log(fullName)
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

                    // Kiểm tra xem tin nhắn có phải là tin nhắn gửi đi hay không
                    if (message.sender === myId) { // currentUserId là ID của người dùng hiện tại
                        individualMessage = `
                            <div class="reply-item outgoing">
                                <div class="reply-group">
                                    <div class="reply-bubble">
                                        <div class="reply-text">${message.content || ''}</div>
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
                                        <div class="reply-text">${message.content || ''}</div>
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
                fullName.textContent= infoReceiver.fullName

                mediaImageDetail.setAttribute("src", infoReceiver.avatar)
                fullNameDetail.textContent= infoReceiver.fullName



                const roomid = data.data.roomId
                history.pushState(null, '', `/chat/${roomid}`);

            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });

    })
})

