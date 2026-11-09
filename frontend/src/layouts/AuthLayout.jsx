import { useNavigate } from "react-router-dom";

export default function AuthLayout({ children, enlace }) {
    const navigate = useNavigate();
    function linkToRegister() {
        navigate("/register")
    }

    function linkToLogin() {
        navigate("/")
    }

    return (
        <>
            <header>
                <h1>
                    Llaves.dev
                </h1>
            </header>
            <main>
                <div className="auth card">
                    {children}
                    <br /><br />
                    <p className="enlace" onClick={enlace ? linkToRegister : linkToLogin}>
                        {enlace ? "Registrarse" : "Iniciar sesion"}
                    </p>
                </div>
            </main>
            <footer>
                <p>
                    Sistema de almacenamiento de tipos de llaves 
                </p>
                <br />
            </footer>
        </>
    );
}