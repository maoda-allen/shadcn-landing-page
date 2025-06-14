import { Separator } from "@/components/ui/separator";
import { ChevronsDown } from "lucide-react";
import Link from "next/link";

export const FooterSection = () => {
  return (
    <footer id="footer" className="container py-24 sm:py-32">
      <div className="p-10 bg-card border border-secondary rounded-2xl">
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-x-12 gap-y-8">
          <div className="col-span-full xl:col-span-2">
            <Link href="/" className="flex font-bold items-center">
              <ChevronsDown className="bg-gradient-to-tr border-secondary from-primary via-primary/70 to-primary rounded-lg w-9 h-9 mr-2 border text-white" />
              生日派对策划
            </Link>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg">联系方式</h3>
            <div>
              <Link href="mailto:support@birthday-party.com" className="opacity-60 hover:opacity-100">
                邮箱支持
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg">服务平台</h3>
            <div>
              <Link href="#" className="opacity-60 hover:opacity-100 cursor-not-allowed" title="即将上线">
                微信小程序
              </Link>
            </div>

            <div>
              <Link href="#" className="opacity-60 hover:opacity-100 cursor-not-allowed" title="即将上线">
                手机APP
              </Link>
            </div>

            <div>
              <Link href="/" className="opacity-60 hover:opacity-100">
                网页版
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg">帮助中心</h3>
            <div>
              <Link href="mailto:support@birthday-party.com" className="opacity-60 hover:opacity-100">
                联系我们
              </Link>
            </div>

            <div>
              <Link href="mailto:feedback@birthday-party.com" className="opacity-60 hover:opacity-100">
                使用反馈
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg">社交媒体</h3>
            <div>
              <span className="opacity-60 cursor-not-allowed" title="即将开通">
                微信公众号
              </span>
            </div>

            <div>
              <span className="opacity-60 cursor-not-allowed" title="即将开通">
                抖音号
              </span>
            </div>

            <div>
              <span className="opacity-60 cursor-not-allowed" title="即将开通">
                小红书
              </span>
            </div>
          </div>
        </div>

        <Separator className="my-6" />
        <section className="">
          <h3 className="">
            &copy; 2024 生日派对策划平台. 专业设计与开发
            <Link
              target="_blank"
              href="mailto:team@birthday-party.com"
              className="text-primary transition-all border-primary hover:border-b-2 ml-1"
            >
              生日派对创意团队
            </Link>
          </h3>
        </section>
      </div>
    </footer>
  );
};
