import React from 'react';
import { RouteComponentProps, navigate, Redirect, Link } from '@reach/router';
import useAuth from '../context/auth';
import { IErrors } from '../types';
import { register } from '../api/AuthAPI';
import ListErrors from './common/ListErrors';

export default function Register(_: RouteComponentProps) {
  const [form, setForm] = React.useState({
    username: '',
    email: '',
    password: '',
  });

  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<IErrors | null>(null);
  const {
    state: { user },
    dispatch,
  } = useAuth();

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setLoading(true);
    const { username, email, password } = form;
    try {
      const user = await register({ username, email, password });
      dispatch({ type: 'LOAD_USER', user });
      navigate('/');
    } catch (error) {
      console.error(error);
      setLoading(false);
      if (error.status === 422) {
        setErrors(error.data.errors);
      }
    }
  };

  if (user) {
    return <Redirect to="/" noThrow />;
  }

  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Sign up</h1>
            <p className="text-xs-center">
              <Link to="/login">Have an account?</Link>
            </p>
            {errors && <ListErrors errors={errors} />}
            <form onSubmit={handleSubmit}>
              <fieldset className="form-group">
                <input
                  name="username"
                  className="form-control form-control-lg"
                  type="text"
                  value={form.username}
                  placeholder="Your Name"
                  onChange={handleChange}
                />
              </fieldset>
              <fieldset className="form-group">
                <input
                  name="email"
                  className="form-control form-control-lg"
                  type="email"
                  value={form.email}
                  placeholder="Email"
                  onChange={handleChange}
                />
              </fieldset>
              <fieldset className="form-group">
                <input
                  name="password"
                  className="form-control form-control-lg"
                  type="password"
                  value={form.password}
                  placeholder="Password"
                  onChange={handleChange}
                />
              </fieldset>
              <button
                className="btn btn-lg btn-primary pull-xs-right"
                disabled={loading}
              >
                Sign Up
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}