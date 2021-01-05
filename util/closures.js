export const GetObjectId = () => {
  let curId = 1;
  const ids = new Map();

  return function (object) {
    if (!object) {
      curId = 1;
      ids.clear();
      return;
    }

    if (ids.has(object)) {
      // eslint-disable-next-line consistent-return
      return ids.get(object);
    }
    // eslint-disable-next-line no-plusplus
    const id = (curId++).toString();
    ids.set(object, id);
    // eslint-disable-next-line consistent-return
    return id;
  };
};
