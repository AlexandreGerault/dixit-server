const randomString = (size: number) => {
  return Math.random().toString(36).substring(0, size);
};

export { randomString };
