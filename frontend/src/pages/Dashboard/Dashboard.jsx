import { useEffect, useState } from "react";
import { getUser } from "../../utils/auth";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";

export default function Dashboard() {
    const navigate = useNavigate();
    const user = getUser();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const emptyForm = { key: "", name: "", brand: "", key_type: "", spaces: "[]", depths: "[]" };
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);

    const productsUrl = `${import.meta.env.VITE_API_URL || ""}/api/products`;

    useEffect(() => {
        if (user == null) {
            navigate("/");
            return;
        }

        const loadProducts = async () => {
            try {
                const response = await fetch(productsUrl);
                if (!response.ok) throw new Error("No se pudieron cargar los productos.");
                const data = await response.json();
                setProducts(Array.isArray(data) ? data : data.products || data.data || []);
            } catch (err) {
                setError(err.message || "Ocurrió un error al cargar los productos.");
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, [navigate, user, productsUrl]);

    const handleCreate = async (event) => {
        event.preventDefault();
        setSaving(true);
        setError("");
        try {
            const productData = {
                key: form.key,
                name: form.name,
                brand: form.brand,
                key_type: form.key_type,
                spaces: JSON.parse(form.spaces),
                depths: JSON.parse(form.depths),
            };
            if (!Array.isArray(productData.spaces) || !Array.isArray(productData.depths)) {
                throw new Error("Espacios y profundidades deben ser arreglos JSON.");
            }

            const response = await fetch(productsUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(productData),
            });
            if (!response.ok) throw new Error("No se pudo crear el producto.");
            const product = await response.json();
            setProducts((current) => [...current, product]);
            setForm(emptyForm);
            setShowForm(false);
        } catch (err) {
            setError(err.message || "Ocurrió un error al crear el producto.");
        } finally {
            setSaving(false);
        }
    };

    if (user == null) {
        return null;
    }

    return (
        <MainLayout>
            <h2>Productos</h2>
            <button type="button" onClick={() => setShowForm((visible) => !visible)}>
                {showForm ? "Cancelar" : "Crear producto"}
            </button>

            {showForm && (
                <form onSubmit={handleCreate}>
                    <label>
                        Clave
                        <input required value={form.key} onChange={(event) => setForm({ ...form, key: event.target.value })} />
                    </label>
                    <label>
                        Nombre
                        <input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
                    </label>
                    <label>
                        Marca
                        <input required value={form.brand} onChange={(event) => setForm({ ...form, brand: event.target.value })} />
                    </label>
                    <label>
                        Tipo de llave
                        <input required value={form.key_type} onChange={(event) => setForm({ ...form, key_type: event.target.value })} />
                    </label>
                    <label>
                        Espacios (arreglo JSON)
                        <textarea required value={form.spaces} onChange={(event) => setForm({ ...form, spaces: event.target.value })} placeholder='[1, 2, 3]' />
                    </label>
                    <label>
                        Profundidades (arreglo JSON)
                        <textarea required value={form.depths} onChange={(event) => setForm({ ...form, depths: event.target.value })} placeholder='[1, 2, 3]' />
                    </label>
                    <button type="submit" disabled={saving}>{saving ? "Guardando..." : "Guardar producto"}</button>
                </form>
            )}

            {error && <p role="alert">{error}</p>}
            {loading ? (
                <p>Cargando productos...</p>
            ) : products.length === 0 ? (
                <p>No hay productos para mostrar.</p>
            ) : (
                <ul>
                    {products.map((product, index) => (
                        <li key={product.id ?? index}>
                            <h3>{product.name ?? "Producto"}</h3>
                            {product.key != null && <p>Clave: {product.key}</p>}
                            {product.brand != null && <p>Marca: {product.brand}</p>}
                            {product.key_type != null && <p>Tipo de llave: {product.key_type}</p>}
                            {product.spaces != null && <p>Espacios: {JSON.stringify(product.spaces)}</p>}
                            {product.depths != null && <p>Profundidades: {JSON.stringify(product.depths)}</p>}
                        </li>
                    ))}
                </ul>
            )}
        </MainLayout>
    );
}