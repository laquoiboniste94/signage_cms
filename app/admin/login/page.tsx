"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "./login.css";

// プルダウンの選択肢
const ACCOUNTS = [
  { email: "admin", label: "本部" },
  { email: "kyoto-manager", label: "京都店 支配人" },
  { email: "kyoto-retail", label: "京都店 小売 店長" },
  { email: "kyoto-bar", label: "京都店 バー 店長" },
  { email: "kyoto-bistro", label: "京都店 ビストロ 店長" },
  { email: "umeda-manager", label: "梅田店 支配人" },
  { email: "umeda-retail", label: "梅田店 小売 店長" },
  { email: "umeda-bar", label: "梅田店 バー 店長" },
  { email: "umeda-bistro", label: "梅田店 ビストロ 店長" },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const data = await res.json();
      // LocalStorage に保存
      localStorage.setItem("signage_user", JSON.stringify(data.user));
      // 権限に応じてリダイレクト
      if (data.user.role === "admin") {
        router.push("/admin/wines");
      } else {
        router.push("/admin/dashboard");
      }
    } else {
      setError("ログイン失敗");
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>△△ワイン CMS</h1>
        <p className="login-subtitle">管理画面ログイン</p>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>ユーザー</label>
            <select value={email} onChange={(e) => setEmail(e.target.value)}>
              {ACCOUNTS.map((a) => (
                <option key={a.email} value={a.email}>
                  {a.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>パスワード</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="パスワード"
              autoComplete="off"
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="login-button">
            ログイン
          </button>
        </form>

        <p className="login-hint">
          ※ポートフォリオ用。パスワードはユーザー名と同じです。
        </p>
      </div>
    </div>
  );
}