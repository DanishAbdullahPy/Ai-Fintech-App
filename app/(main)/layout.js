export default function DashboardLayout({ children }) {
    return (
      <div className="dashboard-layout">
        <aside className="sidebar bg-gray-100 p-4">
          <h2 className="text-xl font-bold mb-4">Dashboard Menu</h2>
          
        </aside>
        <main className="content p-4">{children}</main>
      </div>
    );
  }