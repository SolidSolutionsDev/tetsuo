let lastUniqueID = -1;

export const uniqueID = (prefix?: string) => {
    lastUniqueID++;
    return prefix ? prefix + lastUniqueID.toString() : lastUniqueID.toString();
};
