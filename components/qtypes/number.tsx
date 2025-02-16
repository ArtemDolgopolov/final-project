export default function NumberQuestion() {
 return (
   <div className="w-full px-6 py-1 mb-6">
    <input
      type="number"
      min="0"
      max="99"
      placeholder="Number"
      className="text-base outline-none font-medium capitalize border-b
      focus:border-b-2 border-gray-200 focus:border-[#29A0B1] py-1 w-full" 
    />
   </div>
 )
}