export const getSeparateName = (name) => {
    const nameArr = name.split(" ");
    const [first = null, middle = null, ...rest] = nameArr || [];
    console.log("first middle last ---------------->>>> ", first, middle, rest);
    switch(nameArr.length) {
        case 1:

            return {first_name: nameArr[0], middle_name: null, last_name: null};
        case 2:
            return {first_name: nameArr[0], middle_name: nameArr[1], last_name: null};
        case 3:
            return {first_name: nameArr[0], middle_name: nameArr[1], last_name: nameArr[2]};
        default:
            return {first_name: nameArr[0], middle_name: nameArr[2], last_name: nameArr.slice(2, nameArr.length)};
    }
};

export const getFullName = ({first_name, middle_name, last_name}) => {
    return `${first_name}${middle_name ? ` ${middle_name}` : ""}${last_name ? ` ${last_name}` : ""}`;
};