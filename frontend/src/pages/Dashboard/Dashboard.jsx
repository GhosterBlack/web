import { useEffect, useState } from "react";
import { getUser } from "../../utils/auth";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { getAllProducts, createProduct } from "../../services/productService";

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

    const [spaces, setSpaces] = useState([]);
    const [depths, setDepths] = useState([]);

    function setNumSpaces(number) {
        setSpaces(prevSpaces => {
            const newSpaces = [...prevSpaces];

            for (let i = 0; i < number; i++) {
                if (newSpaces[i] === undefined) {
                    newSpaces[i] = 1;
                }
            }

            return newSpaces.slice(0, number);
        });
    }

    function editarEspacio(index, value) {
        setSpaces(prevSpaces => prevSpaces.map((space, currentIndex) =>
            currentIndex === index ? Number(value) : space
        ));
    }


    function setNumDepths(number) {
        setDepths(prevDepths => {
            const newDepths = [...prevDepths];

            for (let i = 0; i < number; i++) {
                if (newDepths[i] === undefined) {
                    newDepths[i] = 1;
                }
            }

            return newDepths.slice(0, number);
        });
    }

    function editarProfundidad(index, value) {
        setDepths(prevDepths => prevDepths.map((depth, currentIndex) =>
            currentIndex === index ? Number(value) : depth
        ));
    }

    useEffect(() => {
        if (user == null) {
            navigate("/");
            return;
        }
        const loadProducts = async () => {
            try {
                const data = await getAllProducts();
                setProducts(data.data || []);
            } catch (err) {
                console.log(err)
                setError(err || "Ocurrió un error al cargar los productos.");
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);

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
                spaces: spaces,
                depths: depths,
            };
            if (!Array.isArray(productData.spaces) || !Array.isArray(productData.depths)) {
                throw new Error("Espacios y profundidades deben ser arreglos JSON.");
            }

            productData.spaces = JSON.stringify(productData.spaces);
            productData.depths = JSON.stringify(productData.depths);

            productData.id = await createProduct(productData).id;
            if (productData.id) {
                setProducts((current) => [...current, productData]);
                setForm(emptyForm);
                setShowForm(false);
            }
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
            {user.role == "editor" && (
                <button type="button" onClick={() => setShowForm((visible) => !visible)}>
                    {showForm ? "Cancelar" : "Crear producto"}
                </button>
            )}

            {(showForm && user.role=="editor") && (
                <form className="card ghost" onSubmit={handleCreate}>
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
                        Espacios
                        <input
                            type="number"
                            onChange={(event) =>
                                setNumSpaces(parseInt(event.target.value, 10) || 0)
                            }
                        />
                        {spaces.map((v, index) => (
                            <div className="list" key={index}>
                                <span>
                                    {index + 1} ::
                                </span>
                                <input type="number" value={v} onChange={(event) => editarEspacio(index, event.target.value)} />
                            </div>
                        ))}
                    </label> <br />
                    <label>
                        Profundidades
                        <input type="number"
                            onChange={(event) =>
                                setNumDepths(parseInt(event.target.value, 10) || 0)
                            } />
                        {depths.map((v, index) => (
                            <div className="list" key={index}>
                                <span>{index + 1} ::</span>
                                <input type="number" value={v} onChange={(event) => editarProfundidad(index, event.target.value)} />
                            </div>
                        ))}
                    </label>
                    <br /> <br />
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
                        <li className="card" key={product.id ?? index}>
                            <h3>{product.name ?? "Producto"}</h3>
                            {product.key != null && <p>Clave: {product.key}</p>}
                            {product.brand != null && <p>Marca: {product.brand}</p>}
                            {product.key_type != null && <p>Tipo de llave: {product.key_type}</p>}
                            {product.spaces != null && <div>Espacios: <ol> 
                                {JSON.parse(product.spaces).map((space) => <li> {space} </li>)}
                                </ol>
                            </div>
                            }
                            {product.depths != null && <div>Profundidades: <ol>
                                {JSON.parse(product.depths).map(depth => <li> {depth} </li>)}    
                                </ol>
                            </div>}
                        </li>
                    ))}
                </ul>
            )}
        </MainLayout>
    );
}