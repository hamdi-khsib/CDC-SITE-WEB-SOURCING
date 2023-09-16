import { useAuthContext } from './useAuthContext'
import { useSuppliersContext } from './useSuppliersContext'

export const useLogout = () => {
  const { dispatch } = useAuthContext()
  const { dispatch: dispatchSuppliers } = useSuppliersContext()

  const logout = async () => {

    const response = await fetch('http://localhost:8000/auth/logout', {
            method: 'POST',
            credentials: 'include', // Ensure cookies are included in the request
        });
    if (response.ok) {
      localStorage.removeItem('user')
      localStorage.removeItem('rememberMe')
      dispatch({ type: 'LOGOUT' })
        dispatchSuppliers({ type: 'SET_WORKOUTS', payload: null })
    } else {
      // dispatch logout action
      console.error('Logout failed');
    }
    
  }

  return { logout }
}