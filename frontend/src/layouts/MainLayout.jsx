import { useNavigate } from "react-router-dom"

export default function MainLayout({children}) {
    const navigate = useNavigate();
    function homeOnClick() {
        navigate("/home")
    }

    return (
        <>
            <header>
                <div>
                    <h1>Llaves.dev</h1>
                </div>
                <div>
                    <button className="dashboard" onClick={homeOnClick}>🏠</button>
                </div>
            </header>
            <main>
                {children}
            </main>
            <footer>
                Pagina de gestion de modelos de llaves <br />
                By Ivan Torres
            </footer>
        </>
    )
}