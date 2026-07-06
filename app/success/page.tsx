"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { FiCheck } from "react-icons/fi";
import { useLanguage } from "../context/language-context";
import { translations } from "../translations";
import { useCart } from "../context/cart-context";
import { supabase } from "@/lib/supabase";

export default function SuccessPage() {
  return (
    <Suspense fallback={null}>
      <SuccessContent />
    </Suspense>
  );
}

function SuccessContent() {
  const { lang } = useLanguage();
  const t = translations[lang];
  const { updateCartCount } = useCart();
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    // Clear cart
    localStorage.removeItem("cart");
    updateCartCount();

    // Mark order as paid in Supabase
    const id = searchParams.get("order");
    if (id) {
      setOrderId(id);
      supabase
        .from("orders")
        .update({ status: "paid" })
        .eq("id", id)
        .then(({ error }) => {
          if (error) console.error("Failed to update order status:", error);
        });
    }
  }, [updateCartCount, searchParams]);

  return (
    <main className="min-h-[80vh] px-6 py-16 flex items-center justify-center">
      <section className="max-w-xl w-full text-center card rounded-2xl p-10 animate-fade-up">
        <div className="w-20 h-20 rounded-full bg-[var(--accent-soft)] text-[var(--accent)] flex items-center justify-center text-4xl mx-auto mb-6">
          <FiCheck />
        </div>

        <h1 className="font-display text-4xl md:text-5xl mb-4">
          <span className="text-gradient-gold">{t.successTitle}</span>
        </h1>

        <p className="text-[var(--text-secondary)] text-lg mb-4 leading-relaxed">
          {t.successMessage}
        </p>

        {orderId && (
          <p className="text-xs text-[var(--text-muted)] mb-6 font-mono">
            {lang === "he" ? "מס׳ הזמנה" : lang === "ar" ? "رقم الطلب" : "Order ID"}:{" "}
            <span className="text-[var(--accent)]">{orderId.slice(0, 8).toUpperCase()}</span>
          </p>
        )}

        <div className="divider-gold mb-8" />

        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Link href="/" className="btn-outline px-6 py-3 rounded-full">
            {t.backHome}
          </Link>
          <Link href="/products" className="btn-primary px-6 py-3 rounded-full">
            {t.continueShopping}
          </Link>
        </div>
      </section>
    </main>
  );
}
