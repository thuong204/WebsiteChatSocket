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



const btnSearch = document.querySelector("[btn-search-friend]")
const valueSearch  = document.querySelector("[find-friend-all]")
const friendHeader  = document.querySelector("[friend-header]")

const friendList  = document.createElement("div")
friendList.classList.add("friend-suggestions")
const suggestion = document.querySelector(".suggestion-cards")


if(btnSearch){
    btnSearch.addEventListener("click",async (event) =>{
        try {
            // Gửi yêu cầu API
            const response = await fetch(`/friends/search-api?keyword=${valueSearch.value}`);
            const friends = await response.json();
            console.log(friends)

            
            let html =``
            friends.data.forEach(friend =>{
                html += `     
                    <div class="card">
                        <img src= ${friend.avatar} alt="Profile Picture">
                        <div class="info">
                            <p>${friend.fullName}</p>
                            <div class="buttons">
                                <button class="add-friend btn-primary btn" id="btn-add-friend">Thêm bạn bè</button>
                                <button class="cancel-friend btn-secondary d-none btn" id="btn-cancel-friend">Hủy yêu cầu</button>
                                <button class="remove-friend btn-secondary btn" id="btn-delete-friend">Gỡ</button>
                            </div>
                        </div>
                    </div>

                `
            })

            suggestion.innerHTML=""
            suggestion.innerHTML = html
            friendList.appendChild(suggestion)
            friendHeader.append(friendList)

            // Xóa danh sách cũ
            // friendList.innerHTML = "";

            // // Hiển thị kết quả tìm kiếm
            // friends.forEach((friend) => {
            //     const li = document.createElement("li");
            //     li.textContent = friend.name; // Giả sử mỗi friend có thuộc tính name
            //     friendList.appendChild(li);
            // });
        } catch (err) {
            console.error("Error fetching friends:", err);
        }



    })
}

// const userId  = document.querySelector("[myid]").getAttribute("myid")
// socket.emit("CLIENT_LOGIN",userId)
