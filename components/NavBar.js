import Link from 'next/link'
import {useRouter} from 'next/router'

const NavBar = () => {

    const router = useRouter();

    const isActive = (r) => {
        if(r === router.pathname) {
            return "active"
        } else {
            return ""
        }
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
                    <li className={"nav-item " + isActive('/signin')}>
                        <Link href="/signin">
                            <a className="nav-link"><i className="fas fa-user" ></i> Sign in</a>
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default NavBar;