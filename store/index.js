import Model from './model';

const vrFocusStore = new Model({
  initialState: {
    isFocus: false,
  },
  actions: {
    onChange(bool) {
      return { isFocus: bool };
    },
  },
});

export { vrFocusStore };
