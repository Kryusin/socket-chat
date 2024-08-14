const activeUsers = new Map<string, boolean>();

export const userActivate = (key: string) => {
    activeUsers.set(key, true);
};

export const userDeactivate = (key: string) => {
    activeUsers.delete(key);
};

export const userIsActive = (key: string) => {
    return activeUsers.has(key);
};
