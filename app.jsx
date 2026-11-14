const { useState, useEffect } = React;

const DEFAULT_USER = 'xolbotayevasarvinoz7-prog';

// 1) Profil: rasm, ism, bio, tugmalar
function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`https://api.github.com/users/${DEFAULT_USER}`)
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  }, []);

  if (!user) {
    return <p className="text-slate-400">Profil yuklanmoqda...</p>;
  }

  return (
    <div>
      <img
        src={user.avatar_url}
        alt="Profil rasmi"
        className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-sky-400 shadow-lg"
      />
      <h1 className="text-4xl font-extrabold mb-3">{user.name || user.login}</h1>
      <p className="text-slate-400 max-w-xl mx-auto mb-6 text-lg">{user.bio || ''}</p>
      <div className="flex justify-center gap-4">
        <a href="#projects" className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2.5 rounded-lg font-medium transition">
          Loyihalarni ko'rish
        </a>
        <a href={user.html_url} target="_blank" className="border border-slate-600 hover:border-sky-400 px-6 py-2.5 rounded-lg font-medium transition">
          GitHub Profil
        </a>
      </div>
    </div>
  );
}

// 2) Bitta loyiha kartochkasi
function RepoCard({ repo }) {
  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-sky-400 transition flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-bold text-sky-400 truncate">{repo.name}</h3>
          <span className="text-xs bg-slate-700 px-2.5 py-1 rounded text-slate-300">
            {repo.language || 'Kod'}
          </span>
        </div>
        <p className="text-slate-400 text-sm mb-4 line-clamp-2">
          {repo.description || 'Ushbu loyiha uchun tavsif kiritilmagan.'}
        </p>
      </div>
      <div className="flex justify-between items-center pt-4 border-t border-slate-700/50 text-xs text-slate-400">
        <span>★ {repo.stargazers_count} | 🍴 {repo.forks_count}</span>
        <a href={repo.html_url} target="_blank" className="text-sky-400 hover:underline font-medium">
          Kodni ko'rish →
        </a>
      </div>
    </div>
  );
}

// 3) Qidiruv, yuklanish, xatolik va kartochkalar ro'yxati
function RepoList() {
  const [input, setInput] = useState(DEFAULT_USER);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function load(username) {
    if (!username.trim()) {
      setError('Iltimos, GitHub username kiriting!');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        `https://api.github.com/users/${username.trim()}/repos?sort=updated&per_page=6`
      );
      if (!res.ok) {
        throw new Error(res.status === 404 ? 'Foydalanuvchi topilmadi!' : `GitHub API xatosi: ${res.status}`);
      }
      setRepos(await res.json());
    } catch (e) {
      setRepos([]);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(DEFAULT_USER);
  }, []);

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold">GitHub Loyihalar Galereyasi</h2>
          <p className="text-slate-400 text-sm">GitHub API orqali real vaqtda yuklangan repozitoriylar</p>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            aria-label="GitHub username"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && load(input)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm"
          />
          <button
            onClick={() => load(input)}
            className="bg-sky-500 hover:bg-sky-600 px-4 py-2 rounded-lg text-sm font-medium"
          >
            Yuklash
          </button>
        </div>
      </div>

      {loading && <div className="text-center py-8 text-sky-400">Ma'lumotlar yuklanmoqda...</div>}
      {error && <p className="text-red-400 text-center">Xatolik: {error}</p>}
      {!loading && !error && repos.length === 0 && (
        <p className="text-slate-400 text-center">Ochiq loyihalar topilmadi.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {repos.map((repo) => (
          <RepoCard key={repo.id} repo={repo} />
        ))}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('profile-root')).render(<Profile />);
ReactDOM.createRoot(document.getElementById('root')).render(<RepoList />);