import { CartDrawer } from "@/components/store/CartDrawer";
import { Header } from "@/components/store/Header";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen">
      <Header />
      {children}
      <CartDrawer />
    </div>
  );
}
