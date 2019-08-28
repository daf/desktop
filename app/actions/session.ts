import { CALL_API, ApiActionThunk } from '../store/api'
import { Session } from '../models/session'

export function fetchSession (): ApiActionThunk {
  return async (dispatch) => {
    const action = {
      type: 'session',
      [CALL_API]: {
        endpoint: 'me',
        method: 'GET',
        map: (data: Record<string, any>): Session => {
          return data as Session
        }
      }
    }
    return dispatch(action)
  }
}

export function signup (username: string, email: string, password: string): ApiActionThunk {
  return async (dispatch) => {
    const action = {
      type: 'signup',
      [CALL_API]: {
        endpoint: 'registry/profile/new',
        method: 'POST',
        body: {
          username,
          email,
          password
        }
      }
    }
    return dispatch(action)
  }
}

export function signin (username: string, password: string): ApiActionThunk {
  return async (dispatch) => {
    const action = {
      type: 'signin',
      [CALL_API]: {
        endpoint: 'registry/profile/prove',
        method: 'POST',
        body: {
          username,
          password
        }
      }
    }
    return dispatch(action)
  }
}
