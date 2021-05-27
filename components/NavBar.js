import Link from 'next/link'
import { useRouter } from 'next/router'
import { useContext } from 'react';
import { DataContext } from '../store/GlobalState'
import Cookie from 'js-cookie'

const NavBar = () => {

    const router = useRouter();
    const { state, dispatch } = useContext(DataContext)
    const { auth } = state

    const isActive = (r) => {
        if (r === router.pathname) {
            return "active"
        } else {
            return ""
        }
    }

    const loggedRouter = () => {
        return (
            <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <img src={auth.user.avatar} alt={auth.user.avatar} width="25" height="25" className="rounded-circle mr-1"></img>
                    {auth.user.name}
                </a>
                <div className="dropdown-menu">
                    <a className="dropdown-item" href="#">Profile</a>
                    <a className="dropdown-item" style={{ cursor: 'pointer'}} onClick={handleLogout}>Logout</a>
                </div>
            </li>
        )
    }

    const handleLogout = () => {
        Cookie.remove('refreshToken', { path: 'api/auth/accessToken' })
        localStorage.removeItem('firstLogin')
        dispatch({ type: 'AUTH', payload: {} })
        dispatch({ type: 'NOTIFY', payload: { success: 'Logged out!' } })
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <Link href="/">
                <a className="navbar-brand" href="#">E-Commerce</a>
            </Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse justify-content-end" id="navbarNavDropdown">
                <ul className="navbar-nav">
                    <li className={"nav-item " + isActive('/cart')}>
                        <Link href="/cart">
                            <a className="nav-link"><i className="fas fa-shopping-cart"></i> Cart</a>
                        </Link>
                    </li>

                    {
                        Object.keys(auth).length === 0
                            ? <li className={"nav-item " + isActive('/signin')}>
                                <Link href="/signin">
                                    <a className="nav-link"><i className="fas fa-user"></i> Sign in</a>
                                </Link>
                            </li>
                            : loggedRouter()
                    }
                </ul>
            </div>
        </nav>
    )
}

export default NavBar;