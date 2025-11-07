// Gestion de l'authentification et de la session
(function() {
    'use strict';

    // Vérifier si l'utilisateur est connecté
    function isLoggedIn() {
        const user = localStorage.getItem('sportAreaUser');
        return user !== null;
    }

    // Obtenir les informations de l'utilisateur
    function getUser() {
        const user = localStorage.getItem('sportAreaUser');
        if (user) {
            return JSON.parse(user);
        }
        return null;
    }

    // Déconnexion
    function logout() {
        localStorage.removeItem('sportAreaUser');
        updateNavigation();
        window.location.href = './index.html';
    }

    // Mettre à jour la navigation selon l'état de connexion
    function updateNavigation() {
        const loginLink = document.querySelector('.nav-btn-login');
        if (!loginLink) return;

        if (isLoggedIn()) {
            const user = getUser();
            loginLink.innerHTML = `<i class="far fa-user"></i> ${user.name || 'Mon compte'}`;
            loginLink.href = '#';
            loginLink.onclick = function(e) {
                e.preventDefault();
                showUserMenu();
            };
        } else {
            loginLink.innerHTML = '<i class="far fa-user"></i> Se connecter';
            loginLink.href = './login.html';
            loginLink.onclick = null;
        }
    }

    // Afficher le menu utilisateur
    function showUserMenu() {
        // Créer le menu déroulant
        let menu = document.getElementById('userMenu');
        if (menu) {
            menu.remove();
        }

        menu = document.createElement('div');
        menu.id = 'userMenu';
        menu.style.cssText = `
            position: fixed;
            top: 70px;
            right: 20px;
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            padding: 10px 0;
            min-width: 200px;
            z-index: 1001;
        `;

        const user = getUser();
        menu.innerHTML = `
            <div style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb;">
                <div style="font-weight: 600; color: #1f2937;">${user.name || 'Utilisateur'}</div>
                <div style="font-size: 0.85rem; color: #6b7280; margin-top: 4px;">${user.email}</div>
            </div>
            <a href="#" id="logoutBtn" style="display: block; padding: 12px 16px; color: #dc2626; text-decoration: none; transition: background 0.2s;">
                <i class="fas fa-sign-out-alt"></i> Se déconnecter
            </a>
        `;

        document.body.appendChild(menu);

        // Gérer la déconnexion
        document.getElementById('logoutBtn').addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });

        // Fermer le menu en cliquant ailleurs
        setTimeout(() => {
            document.addEventListener('click', function closeMenu(e) {
                if (!menu.contains(e.target) && e.target !== document.querySelector('.nav-btn-login')) {
                    menu.remove();
                    document.removeEventListener('click', closeMenu);
                }
            });
        }, 100);
    }

    // Initialiser au chargement de la page
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateNavigation);
    } else {
        updateNavigation();
    }

    // Exposer les fonctions globalement si nécessaire
    window.auth = {
        isLoggedIn: isLoggedIn,
        getUser: getUser,
        logout: logout
    };
})();

