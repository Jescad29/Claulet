document.addEventListener("DOMContentLoaded", () => {
    const formLogin = document.querySelector('#login-form');
    
    if (formLogin) {
        formLogin.addEventListener("submit", async (e) => {
            e.preventDefault();

            const datosLogin = Object.fromEntries(new FormData(formLogin).entries());

            try {
                const res = await axios.post("/claulet/login/iniciar-sesion", datosLogin);

                if (res.data.ok) {
                    const rol = res.data.rol;
                    if (rol === 'admin') {
                        window.location.href = '/claulet/admin';
                    } else if (rol === 'organizador') {
                        window.location.href = '/ok-organizador';
                    } else if (rol === 'anfitrion') {
                        window.location.href = '/ok-anfitrion';
                    } else {
                        alert('Rol no encontrado')
                    }

                } else {
                    alert(res.data.msg || "Credenciales inválidas");
                }
            } catch (err) {
                const mensaje = err.response?.data?.msg || "Error al acceder";
                alert(mensaje);
                console.error("Error al acceder", err.response?.data || err)
                
            }
        })
    }
})