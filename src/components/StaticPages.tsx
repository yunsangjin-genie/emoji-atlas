import React from 'react';
import { Language, RouteState } from '../types';
import { translations } from '../locales/translations';
import { ArrowLeft, ShieldCheck, Mail, Info, FileText } from 'lucide-react';

interface StaticPageProps {
  type: 'about' | 'contact' | 'privacy' | 'terms';
  currentLang: Language;
  onNavigate: (route: Partial<RouteState>) => void;
}

export const StaticPages: React.FC<StaticPageProps> = ({ type, currentLang, onNavigate }) => {
  const t = translations[currentLang];
  const isKo = currentLang === 'ko';

  const contentMap: Record<
    string,
    { title: string; icon: React.ReactNode; body: React.ReactNode }
  > = {
    about: {
      title: t.navAbout,
      icon: <Info className="w-6 h-6 text-amber-500" />,
      body: isKo ? (
        <div className="space-y-4 text-neutral-700 dark:text-neutral-300 text-sm sm:text-base leading-relaxed">
          <p>
            <strong>{t.brandName}</strong>는 사용자가 원하는 이모지, 특수문자, 텍스트 이모티콘(카오모지)을 가장 빠르고 직관적으로 검색하고 복사할 수 있도록 설계된 글로벌 이모지 플랫폼입니다.
          </p>
          <p>
            전 세계 유니코드(Unicode®) 표준을 준수하며, 운영체제 고유의 네이티브 폰트 글리프를 사용하여 가볍고 빠른 로딩 성능을 제공합니다.
          </p>
          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700">
            <h3 className="font-bold text-neutral-900 dark:text-white mb-2">핵심 가치</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>초고속 1초 복사 (클릭 즉시 클립보드 복사)</li>
              <li>다국어 스마트 검색 및 유니코드 상세 정보 제공</li>
              <li>회원가입/서버 데이터베이스 없이 프라이버시 보호</li>
              <li>모바일 및 데스크톱 완벽 반응형 인터페이스</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="space-y-4 text-neutral-700 dark:text-neutral-300 text-sm sm:text-base leading-relaxed">
          <p>
            <strong>{t.brandName}</strong> is a global emoji platform designed to find and copy emojis, special symbols, and kaomoji text emoticons quickly and intuitively.
          </p>
          <p>
            Complying with worldwide Unicode® standards, it utilizes native font glyphs to provide lightweight and blazing-fast loading speeds.
          </p>
          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700">
            <h3 className="font-bold text-neutral-900 dark:text-white mb-2">Core Values</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Instant 1-click clipboard copy</li>
              <li>Multi-language smart search & detailed Unicode info</li>
              <li>Privacy-focused without accounts or database tracking</li>
              <li>Responsive interface crafted for mobile and desktop</li>
            </ul>
          </div>
        </div>
      ),
    },
    contact: {
      title: t.navContact,
      icon: <Mail className="w-6 h-6 text-amber-500" />,
      body: isKo ? (
        <div className="space-y-4 text-neutral-700 dark:text-neutral-300 text-sm sm:text-base leading-relaxed">
          <p>
            {t.brandName} 서비스 이용 중 발견된 버그, 유니코드 표시 오류, 추가하고 싶은 특수문자나 카오모지 제안은 아래 공식 채널을 통해 언제든 연락해 주시기 바랍니다.
          </p>
          <div className="p-5 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-neutral-900 dark:text-white">공식 이메일:</span>
              <span className="font-mono text-amber-600 dark:text-amber-400">contact@modoo.co</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-neutral-900 dark:text-white">웹사이트:</span>
              <span className="font-mono text-neutral-600 dark:text-neutral-400">https://emoji.modoo.co</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4 text-neutral-700 dark:text-neutral-300 text-sm sm:text-base leading-relaxed">
          <p>
            If you encounter bugs, display issues, or wish to suggest new emojis, symbols, or kaomoji on {t.brandName}, please feel free to reach out to us.
          </p>
          <div className="p-5 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-neutral-900 dark:text-white">Official Email:</span>
              <span className="font-mono text-amber-600 dark:text-amber-400">contact@modoo.co</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-neutral-900 dark:text-white">Website:</span>
              <span className="font-mono text-neutral-600 dark:text-neutral-400">https://emoji.modoo.co</span>
            </div>
          </div>
        </div>
      ),
    },
    privacy: {
      title: t.navPrivacy,
      icon: <ShieldCheck className="w-6 h-6 text-amber-500" />,
      body: isKo ? (
        <div className="space-y-4 text-neutral-700 dark:text-neutral-300 text-sm sm:text-base leading-relaxed">
          <p>
            {t.brandName}는 사용자의 개인정보를 최우선으로 존중하며, 별도의 회원가입이나 계정 로그인 절차를 요구하지 않습니다.
          </p>
          <h3 className="font-bold text-neutral-900 dark:text-white text-base mt-4">1. 수집하는 개인정보</h3>
          <p>
            본 서비스는 서버 데이터베이스에 사용자의 개인 식별 정보를 저장하지 않습니다. 최근 복사한 이모지 및 다크모드/언어 설정값은 오직 사용자의 브라우저 로컬 저장소(localStorage)에만 보관되며 사용자가 원할 때 언제든 직접 삭제할 수 있습니다.
          </p>
          <h3 className="font-bold text-neutral-900 dark:text-white text-base mt-4">2. 쿠키 및 제3자 광고</h3>
          <p>
            본 웹사이트는 Google AdSense 등의 광고 네트워크를 사용할 수 있습니다. 광고 서비스 제공업체는 사용자의 방문 기록을 바탕으로 맞춤형 광고를 제공하기 위해 쿠키를 활용할 수 있습니다. 사용자는 브라우저 설정을 통해 쿠키 저장을 거부할 수 있습니다.
          </p>
        </div>
      ) : (
        <div className="space-y-4 text-neutral-700 dark:text-neutral-300 text-sm sm:text-base leading-relaxed">
          <p>
            {t.brandName} respects your privacy and requires no registration or user login.
          </p>
          <h3 className="font-bold text-neutral-900 dark:text-white text-base mt-4">1. Personal Information</h3>
          <p>
            We do not store personally identifiable data on any server database. Your recently copied emojis, theme preferences, and language selection are stored solely in your browser's localStorage.
          </p>
          <h3 className="font-bold text-neutral-900 dark:text-white text-base mt-4">2. Cookies & Advertising</h3>
          <p>
            This website may display ads via Google AdSense or other advertising networks. Ad partners may use cookies to serve personalized ads based on browsing history. You may decline cookies through your browser settings.
          </p>
        </div>
      ),
    },
    terms: {
      title: t.navTerms,
      icon: <FileText className="w-6 h-6 text-amber-500" />,
      body: isKo ? (
        <div className="space-y-4 text-neutral-700 dark:text-neutral-300 text-sm sm:text-base leading-relaxed">
          <p>
            본 이용약관은 {t.brandName}(emoji.modoo.co) 서비스의 이용 조건 및 절차에 관한 기본적인 사항을 규정합니다.
          </p>
          <h3 className="font-bold text-neutral-900 dark:text-white text-base mt-4">1. 서비스의 제공</h3>
          <p>
            {t.brandName}는 유니코드 기반의 이모지, 특수문자, 텍스트 기호의 검색 및 복사 기능을 무료로 제공합니다.
          </p>
          <h3 className="font-bold text-neutral-900 dark:text-white text-base mt-4">2. 지식재산권</h3>
          <p>
            유니코드 표준 명칭 및 코드는 Unicode Consortium에 저작권이 있으며, 각 플랫폼별 이모지 그래픽은 Apple, Google, Microsoft 등 각 해당 기업의 권리입니다. {t.brandName}는 웹 표준 텍스트 글리프를 활용합니다.
          </p>
        </div>
      ) : (
        <div className="space-y-4 text-neutral-700 dark:text-neutral-300 text-sm sm:text-base leading-relaxed">
          <p>
            These terms govern the use and operation of {t.brandName} (emoji.modoo.co).
          </p>
          <h3 className="font-bold text-neutral-900 dark:text-white text-base mt-4">1. Services</h3>
          <p>
            {t.brandName} provides free emoji search, symbols, and kaomoji copy tools based on Unicode standards.
          </p>
          <h3 className="font-bold text-neutral-900 dark:text-white text-base mt-4">2. Intellectual Property</h3>
          <p>
            Unicode character names and codes are copyrighted by the Unicode Consortium. Emoji graphic artwork belongs to respective platform owners (Apple, Google, Microsoft, etc.). {t.brandName} renders native system fonts.
          </p>
        </div>
      ),
    },
  };

  const page = contentMap[type] || contentMap.about;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8 sm:py-12">
      <button
        onClick={() => onNavigate({ view: 'home' })}
        className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white mb-6 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t.backToHome}</span>
      </button>

      <div className="bg-white dark:bg-neutral-800 rounded-3xl p-6 sm:p-10 border border-neutral-200 dark:border-neutral-700 shadow-xs">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-neutral-100 dark:border-neutral-700/60">
          {page.icon}
          <h1 className="text-xl sm:text-3xl font-black text-neutral-900 dark:text-white">
            {page.title}
          </h1>
        </div>

        {page.body}
      </div>
    </div>
  );
};
