import { Link } from "react-router";
import { Image, MapPin } from "lucide-react";

interface MobileViewSwitchProps {
  target: "map" | "cards";
}

export default function MobileViewSwitch({
  target,
}: MobileViewSwitchProps) {
  const isMapTarget = target === "map";

  return (
    <Link
      to={isMapTarget ? "/map" : "/allhikes"}
      className="
        fixed
        bottom-7
        left-1/2
        flex
        -translate-x-1/2
        items-center
        gap-2
        rounded-full
        bg-[#FFF8F3]
        px-6
        py-3
        text-sm
        font-semibold
        text-[#673C33]
        shadow-md
        md:hidden
      "
    >
      {isMapTarget ? (
        <MapPin size={18} strokeWidth={1.8} />
      ) : (
        <Image size={18} strokeWidth={1.8} />
      )}

      {isMapTarget ? "SHOW MAP" : "SHOW CARDS"}
    </Link>
  );
}