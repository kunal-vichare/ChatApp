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