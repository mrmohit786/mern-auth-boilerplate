import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { authenticate, isAuth } from 'helpers/auth';
import LoginForm from 'components/FormikForm/LoginForm';
import { Redirect } from 'react-router-dom';
import request from 'utils/request';
import GoogleLogin from 'react-google-login';
// import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'; // for use custom styling

const Login = ({ history }) => {
  const [isLoading, setLoading] = useState(false);

  const handleFacebookLogin = async (userId, accessToken) => {
    const res = await request({
      url: `/facebookLogin`,
      method: 'POST',
      data: {
        accessToken,
        userId,
      },
    }).catch(err => {
      toast.error(err?.data?.error || err);
      setLoading(false);
    });

    if (res) {
      authenticateLogin(res);
    }
  };

  const handleGoogleLogin = async idToken => {
    const res = await request({
      url: `/googleLogin`,
      method: 'POST',
      data: {
        idToken,
      },
    }).catch(err => {
      toast.error(err?.data?.error || err);
      setLoading(false);
    });

    if (res) {
      authenticateLogin(res);
    }
  };

  const authenticateLogin = response => {
    authenticate(response, () => {
      isAuth() && isAuth().role === 'admin'
        ? history.push('/admin')
        : history.push('/private');
    });
  };

  const responseGoogle = res => {
    if (!res.error) {
      handleGoogleLogin(res.tokenId, res.googleId);
    } else {
      toast.error(
        'Having trouble in Google sign in, Please register from website.'
      );
    }
  };

  const responseFacebook = res => {
    console.log(res);
    if (res.accessToken) {
      handleFacebookLogin(res.userID, res.accessToken);
    } else {
      toast.error(
        'Having trouble in Facebook sign in, Please register from website.'
      );
    }
  };

  const handleSubmit = async formData => {
    setLoading(true);
    const res = await request({
      url: `/login`,
      method: 'POST',
      data: {
        email: formData.email,
        password: formData.password,
      },
    }).catch(err => {
      toast.error(err?.data?.error || err);
      setLoading(false);
    });

    if (res) {
      toast.success(`Welcome back, ${res.data.user.name}`);
      setLoading(false);
      authenticate(res, () => {
        isAuth() && isAuth().role === 'admin'
          ? history.push('/admin')
          : history.push('/private');
      });
    }
  };
  return (
    <div>
      {isAuth() ? <Redirect to='/' /> : null}
      <LoginForm isLoading={isLoading} submit={data => handleSubmit(data)} />
      <button onClick={() => history.push('/users/password/forget')}>
        Forgotten password?
      </button>
      <p>
        New to application,{' '}
        <strong onClick={() => history.push('/register')}>
          Register Here!
        </strong>
      </p>
      <p>Or</p>
      <GoogleLogin
        clientId={`${process.env.REACT_APP_GOOGLE_CLIENT}`}
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        cookiePolicy={'single_host_origin'}
        render={renderProps => (
          <button onClick={renderProps.onClick} disabled={renderProps.disabled}>
            Sign In with Google
          </button>
        )}
      />
      {/* <FacebookLogin
        appId={process.env.REACT_APP_FACEBOOK_CLIENT}
        callback={responseFacebook}
        render={renderProps => (
          <button onClick={renderProps.onClick} disabled={renderProps.disabled}>
            Sign In with Facebook
          </button>
        )}
      /> */}
    </div>
  );
};

export default Login;
