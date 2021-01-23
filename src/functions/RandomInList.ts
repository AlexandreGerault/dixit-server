const randomInList = <T>(items: T[]) => items[Math.floor(Math.random() * items.length)];

export { randomInList };
