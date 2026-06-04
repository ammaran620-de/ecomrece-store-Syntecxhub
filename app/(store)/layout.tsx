export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen pt-[76px] bg-void">
      {children}
    </div>
  );
}
