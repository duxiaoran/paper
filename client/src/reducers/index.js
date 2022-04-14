import { combineReducers } from 'redux'
import counter from './counter'
import user from './user';
import category from './category';

export default combineReducers({
  counter,
  user,
  category
})
