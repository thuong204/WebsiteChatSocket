// Xử lý sự kiện thêm bạn bè
const listAddFriends = document.querySelectorAll("[btn-add-friend]");
listAddFriends.forEach(item => {
    item.addEventListener("click", () => {
        const userId = item.closest(".card").getAttribute("data-user")

        if (!userId) {
            console.error("Không tìm thấy userId");
            return;
        }

        item.classList.add("d-none");
        item.parentElement.querySelector("[btn-cancel-friend]").classList.remove("d-none");
        item.parentElement.querySelector("[btn-delete-friend]").classList.add("d-none");

        if (typeof socket !== "undefined") {
            socket.emit("CLIENT_ADD_FRIEND", userId);
            console.log("Đã gửi yêu cầu kết bạn");
        } else {
            console.error("Socket không được định nghĩa.");
        }
    });
});



// Xử lý sự kiện hủy yêu cầu kết bạn
const listCancelFriends = document.querySelectorAll("[btn-cancel-friend]");
listCancelFriends.forEach(item => {
    item.addEventListener("click", () => {
        const userId = item.closest(".card").getAttribute("data-user")

        if (!userId) {
            console.error("Không tìm thấy userId");
            return;
        }

        if (typeof socket !== "undefined") {
            socket.emit("CLIENT_CANCEL_FRIEND", userId);
            console.log("hủy yêu cầu")
        } else {
            console.error("Socket không được định nghĩa.");
        }

        item.classList.add("d-none");
        item.parentElement.querySelector("[btn-add-friend]").classList.remove("d-none");
        item.parentElement.querySelector("[btn-delete-friend]").classList.remove("d-none");


    });
});


//chap nhan ket ban
const listAcceptFriends = document.querySelectorAll("[btn-accept-friend]");
listAcceptFriends.forEach(item => {
    item.addEventListener("click", () => {
        const userId = item.closest(".card").getAttribute("data-user")

        if (!userId) {
            console.error("Không tìm thấy userId");
            return;
        }

        if (typeof socket !== "undefined") {
            socket.emit("CLIENT_ACCEPT_FRIEND", userId);
            console.log("chấp nhận yêu cầu kết bạn")
        } else {
            console.error("Socket không được định nghĩa.");
        }

        item.classList.add("d-none");
        item.parentElement.querySelector("[btn-friend]").classList.remove("d-none");
        item.parentElement.querySelector("[btn-cancel-friend]").classList.add("d-none");
        

    });
});



// const userId  = document.querySelector("[myid]").getAttribute("myid")
// socket.emit("CLIENT_LOGIN",userId)
