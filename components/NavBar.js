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
                <a className="navbar-brand" href="#">Navbar</a>
            </Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse justify-content-end" id="navbarNavDropdown">
                <ul className="navbar-nav">
                    <li className={"nav-item " + isActive('/card')}>
                        <Link href="/card">
                            <a className="nav-link" href="#"><i className="fas fa-shopping-cart"></i> Cart</a>
                        </Link>
                    </li>
                    <li className={"nav-item " + isActive('/signin')}>
                        <Link href="/signin">
                            <a className="nav-link" href="#"><i className="fas fa-user"></i> Sign in</a>
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default NavBar;