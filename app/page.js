"use client";
import { useState, useEffect, useRef } from "react";

const STORAGE_KEY = "mi-lista-tareas";

export default function Lista() {
  const [items, setItems] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setItems(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const addItem = () => {
    const text = inputValue.trim();
    if (!text) return;
    setItems((prev) => [...prev, { id: Date.now(), text, done: false }]);
    setInputValue("");
    inputRef.current?.focus();
  };

  const toggleItem = (id) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const deleteItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const deleteDone = () => {
    setItems((prev) => prev.filter((item) => !item.done));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") addItem();
  };

  const pending = items.filter((i) => !i.done);
  const done = items.filter((i) => i.done);

  return (
    <div style={styles.bg}>
      <div style={styles.card}>
        <div style={styles.header}>
          <span style={styles.emoji}>📋</span>
          <h1 style={styles.title}>Mi Lista</h1>
          {items.length > 0 && (
            <span style={styles.badge}>{pending.length}/{items.length}</span>
          )}
          {done.length > 0 && (
            <button onClick={deleteDone} style={styles.clearBtn} title="Borrar completadas">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
              </svg>
            </button>
          )}
        </div>

        <div style={styles.inputRow}>
          <input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Añadir tarea o nota…"
            style={styles.input}
          />
          <button onClick={addItem} style={styles.addBtn} title="Añadir">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div style={styles.empty}>
            <span style={{ fontSize: 40 }}>✨</span>
            <p style={styles.emptyText}>Tu lista está vacía.<br />¡Añade algo!</p>
          </div>
        ) : (
          <div style={styles.list}>
            {pending.map((item) => (
              <ItemRow key={item.id} item={item} onToggle={toggleItem} onDelete={deleteItem} />
            ))}
            {done.length > 0 && (
              <>
                <div style={styles.separator}>
                  <span style={styles.separatorLine} />
                  <span style={styles.separatorLabel}>Hecho ({done.length})</span>
                  <span style={styles.separatorLine} />
                </div>
                {done.map((item) => (
                  <ItemRow key={item.id} item={item} onToggle={toggleItem} onDelete={deleteItem} />
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ItemRow({ item, onToggle, onDelete }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{ ...styles.row, background: hovered ? "rgba(255,255,255,0.04)" : "transparent", opacity: item.done ? 0.55 : 1 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        onClick={() => onToggle(item.id)}
        style={{ ...styles.checkbox, background: item.done ? "#e05a5a" : "transparent", borderColor: item.done ? "#e05a5a" : "#555" }}
        title={item.done ? "Marcar como pendiente" : "Marcar como hecho"}
      >
        {item.done && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </button>
      <span style={{ ...styles.itemText, textDecoration: item.done ? "line-through" : "none", color: item.done ? "#777" : "#e8e8e8" }}>
        {item.text}
      </span>
      <button onClick={() => onDelete(item.id)} style={{ ...styles.deleteBtn, opacity: hovered ? 1 : 0 }} title="Borrar">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
          <path d="M10 11v6M14 11v6" />
          <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
        </svg>
      </button>
    </div>
  );
}

const styles = {
  bg: { minHeight: "100vh", background: "#111", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "32px 16px", fontFamily: "'Georgia', serif" },
  card: { background: "#1a1a1a", borderRadius: 20, width: "100%", maxWidth: 420, padding: "24px 20px", boxShadow: "0 8px 40px rgba(0,0,0,0.5)", border: "1px solid #2a2a2a" },
  header: { display: "flex", alignItems: "center", gap: 10, marginBottom: 22 },
  emoji: { fontSize: 22 },
  title: { color: "#f0f0f0", fontSize: 22, fontWeight: "bold", margin: 0, letterSpacing: "0.02em", flex: 1 },
  badge: { background: "#2c2c2c", color: "#aaa", borderRadius: 99, fontSize: 12, padding: "3px 10px", fontFamily: "monospace" },
  clearBtn: { background: "#2c1a1a", border: "1px solid #5a2a2a", borderRadius: 8, color: "#e05a5a", cursor: "pointer", width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.15s" },
  inputRow: { display: "flex", gap: 8, marginBottom: 20 },
  input: { flex: 1, background: "#252525", border: "1px solid #333", borderRadius: 10, color: "#eee", fontSize: 15, padding: "10px 14px", outline: "none", fontFamily: "'Georgia', serif" },
  addBtn: { background: "#e05a5a", border: "none", borderRadius: 10, color: "white", cursor: "pointer", width: 42, height: 42, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.15s" },
  list: { display: "flex", flexDirection: "column", gap: 2 },
  row: { display: "flex", alignItems: "center", gap: 12, padding: "10px 8px", borderRadius: 10, transition: "background 0.15s, opacity 0.2s", cursor: "default" },
  checkbox: { width: 26, height: 26, borderRadius: 7, border: "2px solid #555", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.15s, border-color 0.15s" },
  itemText: { flex: 1, fontSize: 16, lineHeight: 1.4, transition: "color 0.2s", wordBreak: "break-word" },
  deleteBtn: { background: "transparent", border: "none", color: "#e05a5a", cursor: "pointer", padding: 4, borderRadius: 6, display: "flex", alignItems: "center", transition: "opacity 0.15s", flexShrink: 0 },
  empty: { display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "40px 0" },
  emptyText: { color: "#555", fontSize: 15, textAlign: "center", margin: 0, lineHeight: 1.6 },
  separator: { display: "flex", alignItems: "center", gap: 10, margin: "12px 0 8px" },
  separatorLine: { flex: 1, height: 1, background: "#2e2e2e", display: "block" },
  separatorLabel: { color: "#555", fontSize: 12, whiteSpace: "nowrap", fontFamily: "monospace" },
};
