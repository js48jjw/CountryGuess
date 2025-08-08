import React, { useEffect, useState } from "react";
import { buildFlagUrl } from "../lib/countryData";

interface FlagImageProps {
  iso2: string;
}

// 확장자/대소문자 폴더 차이를 고려하여 순차적으로 로드 시도
const FlagImage: React.FC<FlagImageProps> = ({ iso2 }) => {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let unmounted = false;
    const primary = [
      ...buildFlagUrl(iso2, "nation"),
      ...buildFlagUrl(iso2, "Nation"),
    ];
    const fallbacks = [
      // 폴백: 미국 → 영국 순으로 보장
      ...buildFlagUrl("US", "nation"),
      ...buildFlagUrl("US", "Nation"),
      ...buildFlagUrl("GB", "nation"),
      ...buildFlagUrl("GB", "Nation"),
    ];

    (async () => {
      for (const url of primary) {
        try {
          const res = await fetch(url, { method: "HEAD" });
          if (res.ok) {
            if (!unmounted) setSrc(url);
            return;
          }
        } catch {}
      }
      for (const url of fallbacks) {
        try {
          const res = await fetch(url, { method: "HEAD" });
          if (res.ok) {
            if (!unmounted) setSrc(url);
            return;
          }
        } catch {}
      }
      if (!unmounted) setSrc(null);
    })();

    return () => {
      unmounted = true;
    };
  }, [iso2]);

  if (!src) return (
    <div className="w-[280px] h-[180px] sm:w-[360px] sm:h-[220px] bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-500">
      국기 이미지를 찾을 수 없습니다
    </div>
  );

  return (
    <img
      src={src}
      alt={`${iso2} flag`}
      className="w-[280px] h-[180px] sm:w-[360px] sm:h-[220px] object-contain rounded-lg shadow"
    />
  );
};

export default FlagImage;


