export default function NavBar() {
  return (
    <div className="flex gap-8 justify-between px-9 py-6">
      <div className="text-align:left font-bold text-2xl">
        <h1><a href="">PawConnect</a></h1>
      </div>
      <div className=" flex justify-end gap-8 items-center text-sm">
        <div className="">
          <a href="">About</a>
        </div>
        <div className="">
          <a href="">Adoption</a>
        </div>
        <div className="">
          <a href="">Care</a>
        </div>
        <div className="">
          <a href="">Community</a>
        </div>
        <div className="">
          <button className="border p-3 rounded-xl bg-blue-400">Adopt</button>
        </div>
        <div className="">
          <button className="border p-3 rounded-xl bg-gray-200">Login</button>
        </div>
      </div>
    </div>
  );
}
