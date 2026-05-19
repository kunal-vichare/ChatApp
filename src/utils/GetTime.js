export const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${hours}:${minutes}`;
};

export const formatWhatsAppLastSeen = (timestampMs) => {
    const date = new Date(timestampMs);
    const now = new Date();

    // Reset hours to compare calendar days
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const timeString = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });

    if (date >= today) {
        return `last seen today at ${timeString}`;
    } else if (date >= yesterday) {
        return `last seen yesterday at ${timeString}`;
    } else {
        const dateString = date.toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' });
        return `last seen on ${dateString} at ${timeString}`;
    }
}

export const getChatDaySeparator = (currentDate, previousDate) => {
    const today = new Date();

    const isSameDay =
        previousDate &&
        currentDate.getFullYear() === previousDate.getFullYear() &&
        currentDate.getMonth() === previousDate.getMonth() &&
        currentDate.getDate() === previousDate.getDate();

    if (isSameDay) return null;

    const current = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate()
    );

    const todayOnly = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
    );

    const diffDays = Math.floor(
        (todayOnly - current) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';

    if (diffDays < 7) {
        return currentDate.toLocaleDateString('en-US', {
            weekday: 'long',
        });
    }

    return currentDate.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
};