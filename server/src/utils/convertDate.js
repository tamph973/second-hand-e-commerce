const convertDate = (isoString) => {
    // Chuyển đổi chuỗi ISO sang đối tượng Date
    let date = new Date(isoString);

    // Chuyển đổi sang múi giờ GMT+7 (UTC+7)
    let options = {
        timeZone: 'Asia/Bangkok',
        hour12: false, // Hiển thị giờ dạng 24h
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    };

    // Format giờ phút giây
    let timePart = new Intl.DateTimeFormat('en-GB', options).format(date).split(', ')[1];

    // Format ngày tháng năm
    let datePart = new Intl.DateTimeFormat('vi-VN', {
        timeZone: 'Asia/Bangkok',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(date);

    return `${timePart} ${datePart} (GMT+7)`;
};

export default convertDate;
