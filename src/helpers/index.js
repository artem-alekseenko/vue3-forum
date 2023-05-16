export const findById = (array, id) => array.find((item) => item.id === id);

export const upsert = (array, item) => {
  const index = array.findIndex((i) => i.id === item.id);

  if (item.id && index !== -1) {
    Object.assign(array[index], item);
  } else {
    array.push(item);
  }
};

export const makeAppendChildToParent = ({ parent, child }) => ({ parentId, childId }) => {
  const resource = findById(parent, parentId);
  resource[child] = resource[child] || [];
  if (!resource[child].includes(childId)) {
    resource[child].push(childId);
  }
};
