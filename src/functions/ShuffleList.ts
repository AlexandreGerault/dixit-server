const shuffleList = (list: any[]) =>
  list.forEach((element, index) => {
    const id = Math.floor(Math.random() * (list.length - index));
    list[index] = list[id];
    list[id] = element;
  });

export { shuffleList };
