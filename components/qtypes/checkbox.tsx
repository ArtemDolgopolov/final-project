export default function Checkbox() {
 return (
   <div className="w-full px-6 py-1 mb-6">
    <input
      type="checkbox"
      placeholder="Short Answer"
      className="text-base outline-none font-medium capitalize border-b
      focus:border-b-2 border-gray-200 focus:border-[#29A0B1] py-1 w-full" 
    />
   </div>
 )
}