import spacex_log from "../assets/images/spacex_logo.svg";

function Header() {
    return (
        <header className="App-header">
            <img src={spacex_log} className="App-logo" alt="logo"/>
            <p className={'App-title'}> StarLink Map Tracker </p>
        </header>
    );
}

export default Header;