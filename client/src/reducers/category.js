

const INITIAL_STATE = {
  list: []
}

export default function category (state = INITIAL_STATE, action) {
  switch (action.type) {
  case 'categroy.save':
    return {
      ...state,
      ...action.payload
    }
  default:
    return state
  }

}
