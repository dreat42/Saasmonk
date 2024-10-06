import Link from "next/link";

const NavBar = () => {
  return (
    <div
      style={{ backgroundColor: "rgb(227, 232, 237)" }}
      className="w-full p-4 flex items-center justify-between"
    >
      <h1 className="text-2xl font-bold">MOVIECRITIC</h1>

      <div className="space-x-4">
        <Link
          href={`/add/movie`}
          className="px-4 py-2 border rounded hover:text-white transition"
          style={{
            backgroundColor: "white",
            color: "rgb(101, 88, 245)",
            borderColor: "rgb(101, 88, 245)",
          }}
        >
          Add Movie
        </Link>
        <Link
          href={`/add/review`}
          className="px-4 py-2 text-white border rounded hover:bg-white transition"
          style={{
            backgroundColor: "rgb(101, 88, 245)",
            borderColor: "rgb(101, 88, 245)",
          }}
        >
          Add Review
        </Link>
      </div>
    </div>
  );
};

export default NavBar;
