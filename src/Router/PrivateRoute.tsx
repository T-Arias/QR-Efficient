import { ReactElement } from "react";
import { Navigate, useLocation } from "react-router-dom"

  const PrivateRoute = ({ children }: { children: ReactElement }): ReactElement => {
    const {state} = useLocation();
  return state?.logged ? children : <Navigate to='/login' />;
}

export default PrivateRoute