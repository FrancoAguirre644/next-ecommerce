import Head from 'next/head'
import Link from 'next/link'

export const Signin = () => {
    return (
        <>
            <Head>Sign in</Head>
            <div className="row">
                <div className="col-md-6 mx-auto">
                    <form className=" my-4" style={{maxWidth: '500px'}}>
                        <div className="form-group">
                            <label htmlFor="exampleInputEmail1">Email address</label>
                            <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"></input>
                            <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                        </div>
                        <div className="form-group">
                            <label htmlFor="exampleInputPassword1">Password</label>
                            <input type="password" className="form-control" id="exampleInputPassword1"></input>
                        </div>
                        <button type="submit" className="btn btn-dark w-100">Login</button>
                        <p className="my-2">
                            You don't have an account? 
                            <Link href="/register">
                                <a style={{color: 'crimson'}}> Register</a>
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Signin;