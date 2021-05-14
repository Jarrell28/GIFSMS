'user stricrt';

import React from 'react';
import { useAuth0, withAuth0 } from '@auth0/auth0-react';


function LoginButton() {
    const {isAuthenticated, loginWithRedirect} = useAuth0()

    return !isAuthenticated &&(
        <button color='red' onClick={loginWithRedirect}>
            Login Here
        </button>
    )

}

export default withAuth0(LoginButton);