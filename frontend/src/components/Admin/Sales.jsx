import Sidebar from "./Sidebar";

export default function Sales() {
  return (
    <div className="flex">
      <Sidebar></Sidebar>
      <div className="bg-slate-900 grow text-yellow-100">Sales</div>
    </div>
  );
}
