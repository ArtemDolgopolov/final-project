import { Plus, Trash } from "lucide-react";

interface EditButtonProps {
  handleAdd: () => void;
  handleDelete: () => void;
  show?: boolean;
}

export default function EditButton({ handleAdd, handleDelete, show }: EditButtonProps) {
  return (
    <div className="flex flex-col gap-2 shadow-md p-2 rounded-lg border self-end mr-2 w-[55px]">
      <div onClick={handleAdd} className="p-2 rounded-md hover:bg-gray-100 transition cursor-pointer">
        <Plus size={20} />
      </div>
      {!show && (
        <div onClick={handleDelete} className="p-2 rounded-md hover:bg-gray-100 transition cursor-pointer">
          <Trash size={20} />
        </div>
      )}
    </div>
  );
}