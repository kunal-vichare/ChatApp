import VectorIcon from '../utils/VectorIcons'

export const getStatusIcon = (status) => {
    switch(status) {
        case 'sent':
            return (
                <VectorIcon
                    name="checkmark"          
                    type="Ionicons"
                    color='#000000'
                    size={13}
                />
            );
        case 'delivered':
            return (
                <VectorIcon
                    name="checkmark-done"
                    type="Ionicons"
                    color='#000000'
                    size={13}
                />
            );
        case 'read':
            return (
                <VectorIcon
                    name="checkmark-done"
                    type="Ionicons"
                    color='blue'       
                    size={13}
                />
            );
        default:
            return (
                <VectorIcon
                    name="time-outline"
                    type="Ionicons"
                    color='#000000'
                    size={13}
                />
            );
    }
};