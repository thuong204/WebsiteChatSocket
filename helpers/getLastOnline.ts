export const getLastOnlineTime = (lastOnline: Date | string): string => {
    const now = new Date();
    const lastOnlineDate = new Date(lastOnline);
    const diff = now.getTime() - lastOnlineDate.getTime();

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) {
        return `${seconds} giây trước`;
    } else if (minutes < 60) {
        return `${minutes} phút trước`;
    } else if (hours < 24) {
        return `${hours} giờ trước`;
    } else {
        return `${days} ngày trước`;
    }
};