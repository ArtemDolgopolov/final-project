import { Plus, Trash } from "lucide-react";

export default function EditButton({ handleAdd, handleDelete, show }: any) {
  return (
    <div className="absolute right-[-40px] top-1/2 -translate-y-1/2 flex flex-col gap-2 bg-white shadow-md p-2 rounded-lg border">
      <div onClick={handleAdd} className="p-2 rounded-md hover:bg-gray-100 transition">
        <Plus size={20} />
      </div>
      {!show && <div onClick={handleDelete} className="p-2 rounded-md hover:bg-gray-100 transition">
        <Trash size={20} />
      </div>}
    </div>
  );
}