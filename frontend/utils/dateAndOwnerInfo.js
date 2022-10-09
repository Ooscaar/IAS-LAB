export function dateAndOwnerInfo(date, owner) {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    let dateString = `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
    let hour = date.getHours();
    if (hour < 10) hour = "0" + hour.toString();
    let minutes = date.getMinutes()
    if (minutes < 10) minutes = "0" + minutes.toString();

    let hourString = `${hour}:${minutes}`;
    let info = `${hourString} ${dateString} - ${owner}`;

    return info;
}