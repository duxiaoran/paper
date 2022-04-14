

const INITIAL_STATE = {
  info: {}
}

export default function user (state = INITIAL_STATE, action) {
  switch (action.type) {
  case 'user.save':
    return {
      ...state,
      info: action.payload
    }
  default:
    return state
  }

}
