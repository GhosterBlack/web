import { useState } from "react";
import { login } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";

export default function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            const response = await login(
                email,
                password
            );
            localStorage.setItem(
                "token",
                response.data.user_token
            );

            navigate("/dashboard");

            alert("Login correcto");

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Error al iniciar sesión"
            );

        } finally {

            setLoading(false);

        }

    };

    return (
        <AuthLayout enlace={true}>
            <h1>Iniciar sesión</h1>

            <form onSubmit={handleSubmit}>

                <input
                    type="email"
                    placeholder="Correo"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                />

                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                />

                <button
                    type="submit"
                    disabled={loading}
                >
                    {
                        loading
                            ? "Ingresando..."
                            : "Entrar"
                    }
                </button>

            </form>

        </AuthLayout>

    );
}
