


const socket = io()



const scrollList = document.querySelector(".chat-body.scrollable-list");
// Hàm cuộn xuống cuối danh sách
const scrollToBottom = () => {
    scrollList.scrollTop = scrollList.scrollHeight;
};
const form = document.getElementById("form-send")

const upload = new FileUploadWithPreview.FileUploadWithPreview('upload-image', {
    multiple: true,
    maxFileCount: 6
});
if (form) {
    form.addEventListener("submit", (e) => {
        e.preventDefault()
        const content = e.target.elements.content.value
        const images = upload.cachedFileArray || []

        if (content || images.length > 0) {
            socket.emit("CLIENT_SEND_MESSAGE", {
                content: content,
                images: images
            })
            e.target.elements.content.value = ""
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

    let htmlText = data.content ? `<div class="reply-text">${data.content}</div>` : '';

    let htmlContent = `
        <div class="reply-group">
            <div class="reply-bubble">
                ${htmlText}
                ${htmlImages} 
                <div class="reply-tool"></div>
            </div>
        </div>
    `;


    if (data.sender == userId.getAttribute("myId")) {
        div.classList.add("reply-item")
        div.classList.add("outgoing")
        if(data.content || data.images){
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
        if (data.content || data.images) {
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

