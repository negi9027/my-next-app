export default function AdminFooter() {
  return (
    <footer className="admin-footer bg-light border-top py-2">
      <div className="container-fluid small text-muted">
        Karma Ayurveda Admin • {new Date().getFullYear()} • Built with Next.js
      </div>
    </footer>
  );
}
