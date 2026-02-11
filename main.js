const NOMBRE_USUARIO = 'RomellGarcia';
const limite = 10;

//perfil de GitHub
const cargarPerfil = async () => {
    const contenedorPerfil = document.getElementById('perfil');
    try {
        const respuesta = await fetch(`https://api.github.com/users/${NOMBRE_USUARIO}`);

        if (!respuesta.ok) {
            throw new Error('Usuario no encontrado');
        }

        const perfil = await respuesta.json();
        contenedorPerfil.innerHTML = `<img src="${perfil.avatar_url}" alt="Avatar" class="avatar">
            <div>
                <h2>${perfil.name || perfil.login}</h2>
                <p>${perfil.bio || 'Sin biografía'}</p>
                <p>${perfil.location || 'Ubicación no especificada'}</p>
                <p><a href="${perfil.html_url}" target="_blank">${perfil.html_url}</a></p>
                <div class="stats-perfil">
                    <span>Repositorios públicos: ${perfil.public_repos}</span>
                    <span>Seguidores: ${perfil.followers}</span>
                    <span>Siguiendo: ${perfil.following}</span>
                </div>
            </div>`;
    } catch (error) {
        contenedorPerfil.innerHTML = `<div class="error">
                <h3>Error al cargar el perfil</h3>
                <p>${error.message}</p>
                <p>Asegúrate de haber configurado tu nombre de usuario en el código.</p></div>`;
    }
};

//cargar repositorios
const cargarRepositorios = async () => {
    const reposDiv = document.getElementById('repositorios');
    
    try {
        // Traer mas repos para tener suficientes despues de filtrar forks
        const response = await fetch(`https://api.github.com/users/${NOMBRE_USUARIO}/repos?sort=updated&per_page=100`);
        
        if (!response.ok) {
            throw new Error('Error al cargar repositorios');
        }
        
        const repos = await response.json();
        
        //filtrar repositorios que NO sean forks
        const repositoriosFiltrados = repos.filter(repo => !repo.fork);
        
        if (repositoriosFiltrados.length === 0) {
            reposDiv.innerHTML = '<p>No hay repositorios públicos propios.</p>';
            return;
        }
        
        reposDiv.innerHTML = '';
        
        // Ordenar por fecha mas reciente primero
        repositoriosFiltrados.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
        
        const reposMostrar = repositoriosFiltrados.slice(0, limite);
        
        reposMostrar.forEach(repo => {
            const repoCard = document.createElement('div');
            repoCard.className = 'repo-card';
            
            // Formatear fecha
            const fechaActualizacion = new Date(repo.updated_at).toLocaleDateString('es-ES');
            
            //URL de GitHub Pages
            const githubPagesUrl = `https://${NOMBRE_USUARIO.toLowerCase()}.github.io/${repo.name}/`;
            
            // Link de GitHub Pages
            let pagesLink = '';
            if (repo.has_pages) {
                pagesLink = `<a href="${githubPagesUrl}" target="_blank" class="pages-link">Ver GitHub Pages</a>`;
            }
            
            
            repoCard.innerHTML = `<h3>${repo.name}</h3>
                <p>${repo.description || 'Sin descripción'}</p>
                <div class="repo-stats">
                    <span>Fecha: ${fechaActualizacion}</span>
                </div>
                <div class="repo-links">
                    <a href="${repo.html_url}" target="_blank" class="repo-link">Ver en GitHub</a>
                    ${pagesLink}
                </div>`;
            reposDiv.appendChild(repoCard);
        });
        
    } catch (error) {
        reposDiv.innerHTML = `<div class="error">
                <h3>Error al cargar repositorios</h3>
                <p>${error.message}</p>
            </div>`;
    }
};

const cargarComunidad = async () => {
    const contenedorComunidad = document.getElementById('comunidad');
    try {
        const respuesta = await fetch(`https://api.github.com/users/${NOMBRE_USUARIO}/followers?per_page=5`);
        const seguidores = await respuesta.json();
        contenedorComunidad.innerHTML = '';
        seguidores.forEach(seguidor => {
            contenedorComunidad.innerHTML += `<img src="${seguidor.avatar_url}" alt="${seguidor.login}" title="${seguidor.login}" width="50">`;
        });
    } catch (error) {
        contenedorComunidad.innerHTML = `<p>Error al cargar seguidores</p>`;
    }
};

//cargar la comunidad
document.addEventListener('DOMContentLoaded', () => {
    cargarPerfil();
    cargarRepositorios();
    cargarComunidad();
});