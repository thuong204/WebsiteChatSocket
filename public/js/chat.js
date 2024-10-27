const socket = io()

const scrollList = document.querySelector(".chat-body.scrollable-list");

// Hàm cuộn xuống cuối danh sách
const scrollToBottom = () => {
    scrollList.scrollTop = scrollList.scrollHeight;
};
const form = document.getElementById("form-send")


if (form) {
    form.addEventListener("submit", (e) => {
        e.preventDefault()
        const content = e.target.elements.content.value
        if (content) {
            socket.emit("CLIENT_SEND_MESSAGE", {
                content:content
            })
            e.target.elements.content.value = ""
        }
    })
}

socket.on('SERVER_RETURN_MESSAGE', (data) => {
    const userId = document.querySelector("[myId]")
    const message = document.querySelector(".chat-message")
    const div = document.createElement("div")
    const replyMessages = document.querySelectorAll(".reply-item");
    const lastReplyMessage = replyMessages[replyMessages.length - 1];
    let htmlFullName = "";
    let htmlContent = "";
    let htmlImages = "";
    console.log(data.sender)
    console.log(userId.getAttribute("myId"))
    if (data.sender == userId.getAttribute("myId")) {
        div.classList.add("reply-item")
        div.classList.add("outgoing")
        if (data.content) {
            htmlContent = ` <div class="reply-group">
                                <div class="reply-bubble">
                                    <div class="reply-text"> ${data.content}  </div>                   
                                    <div class="reply-tool">
         
                                    </div>
                                </div>
                            </div>`
        }
        div.innerHTML = `
        ${htmlContent}
        `
        if (lastReplyMessage) {
            lastReplyMessage.insertAdjacentElement("afterend", div);
        } else {
            // Nếu không có tin nhắn nào, chèn vào đầu danh sách
            message.appendChild(div);
        }
        scrollToBottom();
    } else {
        div.classList.add("reply-item")
        div.classList.add("incoming")
        if (data.content) {
            htmlContent = ` 
                            <div class="reply-avatar">
                                <div class="media">
                                    <img src="${data.receiver.avatar}" width="32" height="32" class="rounded-circle">
                                </div>
                            </div>
                            <div class="reply-group">
                                <div class="reply-bubble">
                                    <div class="reply-text"> ${data.content}  </div>                   
                                    <div class="reply-tool">
                                    </div>
                                </div>
                            </div>`
        }
        div.innerHTML = `
        ${htmlContent}
        `
        if (lastReplyMessage) {
            lastReplyMessage.insertAdjacentElement("afterend", div);
        } else {
            // Nếu không có tin nhắn nào, chèn vào đầu danh sách
            message.appendChild(div);
        }
        scrollToBottom();

    }
})
document.addEventListener("DOMContentLoaded", () => {
    // Cuộn xuống dưới cùng khi truy cập vào trang
    scrollToBottom();
})
