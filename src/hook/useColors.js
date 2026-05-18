import { useSelector } from "react-redux";

const useColors = () => {
    const isDark = useSelector(state => state.theme.dark);
    return {
        bg:          isDark ? '#111b21' : '#ffffff',
        surface:     isDark ? '#202c33' : '#f0f2f5',
        headerBg:    isDark ? '#1f2c34' : '#008069',
        inputBg:     isDark ? '#2a3942' : '#f0f2f5',
        tabBar:      isDark ? '#1f2c34' : '#ffffff',
        bubbleUser:  isDark ? '#005c4b' : '#DCF8C6',
        bubbleOther: isDark ? '#202c33' : '#ffffff',
        text:        isDark ? '#e9edef' : '#000000',
        subText:     isDark ? '#8b959a' : '#667781',
        textGrey:    isDark ? '#8b959a' : '#8b959a',
        time:        isDark ? '#53bdeb' : '#026500',
        border:      isDark ? '#2a3942' : '#e9edef',
        icon:        isDark ? '#aebac1' : '#54656f',
        activeTab:   isDark ? '#00a884' : '#007bff',
        inactiveTab: isDark ? '#aebac1' : '#000000',
        userMsg:     isDark ? '#005c4b' : '#DCF8C6',

        // Static
        primary:     '#ffffff',
        title:       '#1F41BB',
        blue:        '#34b7f1',
        red:         '#e53f43',
        tertiary:    '#0aad93',
        floatingBtn: '#00A884',
        wp:          '#25d366',
    };
};

export default useColors;