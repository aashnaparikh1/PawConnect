export default function NavBar() {
  return (
    <div className="flex gap-8 justify-between">
      <div className="text-align:left font-bold text-2xl">
        <h1>PawConnect</h1>
      </div>
      <div className=" flex justify-end gap-5 items-center">
        <div className="">
          <p>About</p>
        </div>
        <div className="">
          <p>Adoption</p>
        </div>
        <div className="">
          <p>Care</p>
        </div>
        <div className="">
          <p>Community</p>
        </div>
        <div className="">
          <p>Adopt</p>
        </div>
        <div className="">
          <p>Login</p>
        </div>
      </div>
    </div>
  );
}
