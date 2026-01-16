import { Twitter, Instagram } from "lucide-react";

export const FooterLayout = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="text-xl font-bold">PoliCourt</div>
            <p className="mt-2 text-sm">
              Gestión de pistas y eventos deportivos.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Enlaces</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/instalaciones" className="hover:underline">
                  Deportes
                </a>
              </li>
              <li>
                <a href="/eventos" className="hover:underline">
                  Eventos
                </a>
              </li>
              <li>
                <a href="/contacto" className="hover:underline">
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Seguinos</h4>
            <div className="flex space-x-4">
              <a href="#" aria-label="Twitter" className="hover:opacity-80">
                <Twitter />
              </a>
              <a href="#" aria-label="Instagram" className="hover:opacity-80">
                <Instagram />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} PoliCourt. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
