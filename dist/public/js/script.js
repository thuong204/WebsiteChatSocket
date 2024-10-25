// Lấy phần tử item-detail
const detailItem = document.querySelector('.item-detail a');
const detailItemActive =document.querySelector(".item-detail")
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

