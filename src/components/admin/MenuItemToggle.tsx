"use client";

import { useState } from "react";
import type { MenuItemDTO } from "@/lib/types";
import { CURRENCY } from "@/lib/constants";

interface EditData {
  code: string;
  name: string;
  price: string;
  description: string;
  imagePath: string;
}

interface MenuItemToggleProps {
  item: MenuItemDTO;
  onToggle: (id: number, available: boolean) => void;
  onDelete: (id: number) => Promise<string | null>;
  onEdit: (id: number, data: EditData) => Promise<void>;
  loading: boolean;
}

export default function MenuItemToggle({
  item,
  onToggle,
  onDelete,
  onEdit,
  loading,
}: MenuItemToggleProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState<EditData>({
    code: item.code,
    name: item.name,
    price: String(item.price),
    description: item.description ?? "",
    imagePath: item.imagePath ?? "",
  });

  const handleDelete = async () => {
    setDeleting(true);
    const error = await onDelete(item.id);
    setDeleting(false);
    if (error) {
      setDeleteError(error);
      setConfirmDelete(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    await onEdit(item.id, editData);
    setSaving(false);
    setEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      code: item.code,
      name: item.name,
      price: String(item.price),
      description: item.description ?? "",
      imagePath: item.imagePath ?? "",
    });
    setEditing(false);
  };

  return (
    <div
      className={`bg-white rounded-xl border px-4 py-3 transition-opacity ${
        !item.available ? "opacity-50" : ""
      } ${item.available ? "border-stone-200" : "border-stone-300"}`}
    >
      {editing ? (
        /* ── Inline edit form ── */
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-stone-500">Code</label>
              <input
                className="w-full mt-0.5 text-sm border border-stone-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-400 font-mono uppercase"
                value={editData.code}
                onChange={(e) => setEditData((d) => ({ ...d, code: e.target.value.toUpperCase() }))}
              />
            </div>
            <div>
              <label className="text-xs text-stone-500">Price ({CURRENCY})</label>
              <input
                type="number"
                className="w-full mt-0.5 text-sm border border-stone-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-400"
                value={editData.price}
                onChange={(e) => setEditData((d) => ({ ...d, price: e.target.value }))}
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-stone-500">Name</label>
            <input
              className="w-full mt-0.5 text-sm border border-stone-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={editData.name}
              onChange={(e) => setEditData((d) => ({ ...d, name: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-xs text-stone-500">Description</label>
            <input
              className="w-full mt-0.5 text-sm border border-stone-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={editData.description}
              onChange={(e) => setEditData((d) => ({ ...d, description: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-xs text-stone-500">Image path</label>
            <input
              className="w-full mt-0.5 text-sm border border-stone-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={editData.imagePath}
              placeholder="/images/filename.jpg"
              onChange={(e) => setEditData((d) => ({ ...d, imagePath: e.target.value }))}
            />
          </div>
          <div className="flex gap-2 pt-1">
            <button
              onClick={handleSave}
              disabled={saving}
              className="text-xs px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium disabled:opacity-50 transition-colors"
            >
              {saving ? "Saving…" : "Save"}
            </button>
            <button
              onClick={handleCancel}
              disabled={saving}
              className="text-xs px-3 py-1.5 border border-stone-300 text-stone-600 hover:bg-stone-50 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        /* ── Default view ── */
        <>
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-stone-400">{item.code}</span>
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                    item.category === "FOOD"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-teal-100 text-teal-700"
                  }`}
                >
                  {item.category}
                </span>
              </div>
              <p className="font-medium text-stone-900 mt-0.5">{item.name}</p>
              <p className="text-sm text-stone-500">
                {item.price} {CURRENCY}
              </p>
            </div>

            <button
              onClick={() => onToggle(item.id, !item.available)}
              disabled={loading}
              className={`relative w-12 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400 disabled:cursor-not-allowed shrink-0 ${
                item.available ? "bg-orange-500" : "bg-stone-300"
              }`}
              aria-label={item.available ? "Disable item" : "Enable item"}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  item.available ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div className="mt-2 flex items-center gap-3">
            <button
              onClick={() => { setEditing(true); setConfirmDelete(false); setDeleteError(null); }}
              className="text-xs text-orange-500 hover:text-orange-700 transition-colors"
            >
              Edit
            </button>
            {confirmDelete ? (
              <>
                <span className="text-xs text-stone-500">Remove this item?</span>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="text-xs text-red-500 hover:text-red-700 font-medium disabled:opacity-50"
                >
                  {deleting ? "Removing..." : "Yes, remove"}
                </button>
                <button
                  onClick={() => { setConfirmDelete(false); setDeleteError(null); }}
                  disabled={deleting}
                  className="text-xs text-stone-400 hover:text-stone-600"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => { setConfirmDelete(true); setDeleteError(null); }}
                className="text-xs text-red-400 hover:text-red-600 transition-colors"
              >
                Remove
              </button>
            )}
          </div>

          {deleteError && (
            <p className="text-xs text-red-500 mt-1">{deleteError}</p>
          )}
        </>
      )}
    </div>
  );
}
