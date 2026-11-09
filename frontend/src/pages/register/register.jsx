import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../services/authService";
import AuthLayout from "../../layouts/AuthLayout";

export default function Register() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        role: "viewer"
    });

    const [loading, setLoading] =
        useState(false);

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            await register(form);

            alert(
                "Usuario registrado correctamente"
            );

            navigate("/");

        } catch(error) {

            alert(
                error.response?.data?.message ||
                "Error al registrar usuario"
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <AuthLayout enlace={false}>

            <h1>Registro</h1>

            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    name="username"
                    placeholder="Nombre de usuario"
                    value={form.username}
                    onChange={handleChange}
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Correo"
                    value={form.email}
                    onChange={handleChange}
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    value={form.password}
                    onChange={handleChange}
                />

                <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                >
                    <option value="viewer">
                        Viewer
                    </option>

                    <option value="editor">
                        Editor
                    </option>
                </select>

                <button
                    type="submit"
                    disabled={loading}
                >
                    {
                        loading
                        ? "Registrando..."
                        : "Crear cuenta"
                    }
                </button>

            </form>

        </AuthLayout>

    );
}
