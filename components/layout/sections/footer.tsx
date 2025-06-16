"use client";
import { Separator } from "@/components/ui/separator";
import { ChevronsDown } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/contexts/language-context";

export const FooterSection = () => {
  const { t } = useLanguage();

  return (
    <footer id="footer" className="container py-24 sm:py-32">
      <div className="p-10 bg-card border border-secondary rounded-2xl">
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-x-12 gap-y-8">
          <div className="col-span-full xl:col-span-2">
            <Link href="/" className="flex font-bold items-center">
              <ChevronsDown className="bg-gradient-to-tr border-secondary from-primary via-primary/70 to-primary rounded-lg w-9 h-9 mr-2 border text-white" />
              {t('footer.brand')}
            </Link>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg">{t('footer.contact.title')}</h3>
            <div>
              <Link href="mailto:support@birthday-party.com" className="opacity-60 hover:opacity-100">
                {t('footer.contact.emailSupport')}
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg">{t('footer.platforms.title')}</h3>
            <div>
              <Link href="#" className="opacity-60 hover:opacity-100 cursor-not-allowed" title={t('footer.platforms.comingSoon')}>
                {t('footer.platforms.wechatMini')}
              </Link>
            </div>

            <div>
              <Link href="#" className="opacity-60 hover:opacity-100 cursor-not-allowed" title={t('footer.platforms.comingSoon')}>
                {t('footer.platforms.mobileApp')}
              </Link>
            </div>

            <div>
              <Link href="/" className="opacity-60 hover:opacity-100">
                {t('footer.platforms.webVersion')}
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg">{t('footer.help.title')}</h3>
            <div>
              <Link href="mailto:support@birthday-party.com" className="opacity-60 hover:opacity-100">
                {t('footer.help.contactUs')}
              </Link>
            </div>

            <div>
              <Link href="mailto:feedback@birthday-party.com" className="opacity-60 hover:opacity-100">
                {t('footer.help.feedback')}
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg">{t('footer.social.title')}</h3>
            <div>
              <span className="opacity-60 cursor-not-allowed" title={t('footer.social.comingSoon')}>
                {t('footer.social.facebook')}
              </span>
            </div>

            <div>
              <span className="opacity-60 cursor-not-allowed" title={t('footer.social.comingSoon')}>
                {t('footer.social.tiktok')}
              </span>
            </div>

            <div>
              <span className="opacity-60 cursor-not-allowed" title={t('footer.social.comingSoon')}>
                {t('footer.social.instagram')}
              </span>
            </div>
          </div>
        </div>

        <Separator className="my-6" />
        <section className="">
          <h3 className="">
            {t('footer.copyright')}
            <Link
              target="_blank"
              href="mailto:team@birthday-party.com"
              className="text-primary transition-all border-primary hover:border-b-2 ml-1"
            >
              {t('footer.team')}
            </Link>
          </h3>
        </section>
      </div>
    </footer>
  );
};
