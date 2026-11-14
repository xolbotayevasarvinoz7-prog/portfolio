// Sahifa ochilganda standart biror dasturchi ma'lumotlarini yuklab turish
window.onload = () => {
    document.getElementById('username-input').value = 'octocat';
    loadGitHubData();
};

async function loadGitHubData() {
    const username = document.getElementById('username-input').value.trim();
    const grid = document.getElementById('repos-grid');
    const loading = document.getElementById('loading');

    if (!username) {
        alert("Iltimos, GitHub username kiriting!");
        return;
    }

    // Oldingi ma'lumotlarni tozalash va yuklanish belgisini  ko'rsatish
    grid.innerHTML = '';
    loading.classList.remove('hidden');

    try {
        // 1. Foydalanuvchi profilini GitHub API dan olish
        const userRes = await fetch(`https://api.github.com/users/${username}`);
        if (!userRes.ok) throw new Error("Foydalanuvchi topilmadi!");
        const userData = await userRes.json();

        // Profil rasmi va havolasini yangilash
        document.getElementById('avatar').src = userData.avatar_url;
        document.getElementById('github-link').href = userData.html_url;
        if (userData.name) {
            document.getElementById('dev-name').textContent = userData.name;
        }
        if (userData.bio) {
            document.getElementById('dev-bio').textContent = userData.bio;
        }

        // 2. Foydalanuvchining loyihalarini (repositories) olish
        const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
        const repos = await reposRes.json();

        loading.classList.add('hidden');

        if (repos.length === 0) {
            grid.innerHTML = '<p class="text-slate-400 col-span-3 text-center">Ochiq loyihalar topilmadi.</p>';
            return;
        }

        // Har bir loyiha uchun chiroyli kartochka yaratish
        repos.forEach(repo => {
            const card = document.createElement('div');
            card.className = 'bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-sky-400 transition flex flex-col justify-between';
            
            card.innerHTML = `
                <div>
                    <div class="flex justify-between items-start mb-3">
                        <h3 class="text-lg font-bold text-sky-400 truncate">${repo.name}</h3>
                        <span class="text-xs bg-slate-700 px-2.5 py-1 rounded text-slate-300">
                            ${repo.language || 'Kod'}
                        </span>
                    </div>
                    <p class="text-slate-400 text-sm mb-4 line-clamp-2">
                        ${repo.description || 'Ushbu loyiha uchun tavsif kiritilmagan.'}
                    </p>
                </div>
                <div class="flex justify-between items-center pt-4 border-t border-slate-700/50 text-xs text-slate-400">
                    <span>⭐ ${repo.stargazers_count} | 🍴 ${repo.forks_count}</span>
                    <a href="${repo.html_url}" target="_blank" class="text-sky-400 hover:underline font-medium">
                        Kodni ko'rish →
                    </a>
                </div>
            `;
            grid.appendChild(card);
        });

    } catch (error) {
        loading.classList.add('hidden');
        grid.innerHTML = `<p class="text-red-400 col-span-3 text-center">Xatolik: ${error.message}</p>`;
    }
}
