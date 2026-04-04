import { Mail, Phone, MapPin, Globe, Rss, Send } from "lucide-react";
import BrandLogo from "./BrandLogo";
import { useAppSettings } from "../context/AppSettingsContext";

export default function Footer({ navigate }) {
  const { t } = useAppSettings();
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <BrandLogo size="lg" textClassName="text-white" />
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              {t("footer.description")}
            </p>
            <div className="flex gap-3 mt-5">
              {[Globe, Rss, Send].map((Icon, i) => (
                <button key={i} className="w-9 h-9 bg-slate-800 hover:bg-brand-500 rounded-xl flex items-center justify-center transition-all duration-200">
                  <Icon size={16} className="text-slate-400 hover:text-white" />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-white mb-4">{t("footer.pages")}</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: t("common.home"), key: "home" },
                { label: t("common.students"), key: "students" },
                { label: t("common.register"), key: "register" },
                { label: t("shell.auth.adminLogin"), key: "login" },
              ].map((l) => (
                <li key={l.key}>
                  <button
                    onClick={() => navigate(l.key)}
                    className="text-slate-400 hover:text-brand-300 transition-colors"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-bold text-white mb-4">{t("footer.contact")}</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-slate-400">
                <MapPin size={15} className="text-brand-300 shrink-0" />
                {t("footer.city")}
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <Phone size={15} className="text-brand-300 shrink-0" />
                +998 71 123 45 67
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <Mail size={15} className="text-brand-300 shrink-0" />
                info@edumanage.uz
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} edu manage. {t("common.rightsReserved")}
        </div>
      </div>
    </footer>
  );
}
