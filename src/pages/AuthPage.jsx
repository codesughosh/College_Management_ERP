import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Lock, Mail, UserRound } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function AuthPage({ mode = 'login', onAuth }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: 'Admin',
    email: '',
    password: '',
  });

  const isRegister = mode === 'register';

  const submit = (event) => {
    event.preventDefault();
    const user = {
      name: isRegister ? form.name || 'Admin' : 'Admin',
      email: form.email,
      role: 'Admin',
    };
    localStorage.setItem('collegeERPUser', JSON.stringify(user));
    onAuth(user);
    toast.success(isRegister ? 'Demo account created' : 'Signed in');
    navigate('/students');
  };

  return (
    <main className="min-h-screen bg-[#f1f2f4] flex items-center justify-center p-6">
      <section className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-[0_18px_60px_rgba(15,23,42,0.12)] overflow-hidden">
        <div className="bg-[#1b1f21] text-white p-7">
          <div className="h-14 w-14 rounded-full bg-white text-emerald-700 flex items-center justify-center mb-5">
            <GraduationCap size={30} />
          </div>
          <h1 className="text-2xl font-bold">COLLEGE NAME</h1>
          <p className="text-sm text-slate-300 mt-1">ERP Management Suite</p>
        </div>

        <form onSubmit={submit} className="p-7 space-y-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{isRegister ? 'Create demo account' : 'Admin login'}</h2>
            <p className="text-sm text-slate-500 mt-1">Use any email and any password for this demo.</p>
          </div>

          {isRegister && (
            <label className="block">
              <span className="text-xs font-semibold text-slate-500 mb-1.5 block">Name</span>
              <div className="relative">
                <UserRound size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={form.name}
                  onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                  className="w-full h-11 rounded-lg bg-[#f5f5f6] border border-slate-200 pl-10 pr-3 outline-none focus:ring-2 focus:ring-orange-100"
                />
              </div>
            </label>
          )}

          <label className="block">
            <span className="text-xs font-semibold text-slate-500 mb-1.5 block">Email</span>
            <div className="relative">
              <Mail size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                className="w-full h-11 rounded-lg bg-[#f5f5f6] border border-slate-200 pl-10 pr-3 outline-none focus:ring-2 focus:ring-orange-100"
                placeholder="admin@college.edu"
              />
            </div>
          </label>

          <label className="block">
            <span className="text-xs font-semibold text-slate-500 mb-1.5 block">Password</span>
            <div className="relative">
              <Lock size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                value={form.password}
                onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                className="w-full h-11 rounded-lg bg-[#f5f5f6] border border-slate-200 pl-10 pr-3 outline-none focus:ring-2 focus:ring-orange-100"
                placeholder="anything works"
              />
            </div>
          </label>

          <button className="w-full h-11 rounded-full bg-[#fb9a5b] text-white font-bold">
            {isRegister ? 'Register' : 'Login'}
          </button>

          <p className="text-sm text-center text-slate-500">
            {isRegister ? 'Already have a demo account?' : 'Need a demo account?'}{' '}
            <Link className="font-bold text-[#fb8d49]" to={isRegister ? '/login' : '/register'}>
              {isRegister ? 'Login' : 'Register'}
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}
