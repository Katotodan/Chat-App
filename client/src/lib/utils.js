export const getTime = (time)=>{
    const date = new Date(time)
    const now = new Date()
    const isToday = date.toDateString() === now.toDateString();
    if(isToday){
        // Get hour and minute
        const hour = date.getHours()
        const minute = date.getMinutes()
        return `${hour > 9 ? hour : '0'+hour}:${minute > 9 ? minute : '0' + minute}`
    }
    const yesterday = new Date(now)
    yesterday.setDate(now.getDate() - 1)
    const isYesterday = date.toDateString() === yesterday.toDateString()
    if(isYesterday){
        return "Yesterday"
    }
    
    return date.toLocaleDateString('en-GB');
}