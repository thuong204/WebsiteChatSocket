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
                const messages = data.data; // Lưu trữ dữ liệu tin nhắn
                const chatBody = document.querySelector('.chat-body.scrollable-list'); // Chọn phần tử nơi hiển thị tin nhắn
                const myId = document.querySelector("[myId]").getAttribute("myId")
                
                // Xóa nội dung cũ trước khi thêm tin nhắn mới
                chatBody.innerHTML = '';
        
                // Lặp qua các tin nhắn và thêm chúng vào chat body
                messages.forEach(message => {
                    const messageElement = document.createElement('div'); // Tạo phần tử div cho mỗi tin nhắn
                    messageElement.classList.add('chat-message', 'd-flex'); // Thêm class để định dạng
        
                    // Kiểm tra xem tin nhắn có phải là tin nhắn gửi đi hay không
                    if (message.sender === myId) { // currentUserId là ID của người dùng hiện tại
                        messageElement.innerHTML = `
                            <div class="reply-item outgoing">
                                <div class="reply-group">
                                    <div class="reply-bubble">
                                        <div class="reply-text">${message.content || ''}</div>
                                    </div>
                                </div>
                            </div>`;
                    } else {
                        messageElement.innerHTML = `
                            <div class="reply-item incoming d-flex">
                                <div class="reply-avatar">
                                    <div class="media">
                                        <img src="URL_AVATAR" width="32" height="32" class="rounded-circle" alt="User Avatar">
                                    </div>
                                </div>
                                <div class="reply-group">
                                    <div class="reply-bubble">
                                        <div class="reply-text">${message.content || ''}</div>
                                    </div>
                                </div>
                            </div>`;
                    }
        
                    chatBody.appendChild(messageElement);
                });
                const roomid = messages[0].room_id
                history.pushState(null, '', `/chat/${roomid}`);

            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });

    })
})