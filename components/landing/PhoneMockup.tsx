import { cn } from '@/lib/utils';

interface PhoneMockupProps {
  className?: string;
  children?: React.ReactNode;
}

export function PhoneMockup({ className, children }: PhoneMockupProps) {
  return (
    <div
      className={cn(
        'relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-900 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl',
        className
      )}
    >
      <div className="w-[148px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute"></div>
      <div className="h-[32px] w-[3px] bg-gray-800 absolute -start-[17px] top-[72px] rounded-s-lg"></div>
      <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[124px] rounded-s-lg"></div>
      <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[178px] rounded-s-lg"></div>
      <div className="h-[64px] w-[3px] bg-gray-800 absolute -end-[17px] top-[142px] rounded-e-lg"></div>
      <div className="rounded-[2rem] overflow-hidden w-full h-full bg-white dark:bg-gray-800 flex items-center justify-center text-gray-400">
        {children || (
          <div className="flex flex-col items-center gap-2 p-4 text-center">
            <span className="text-sm font-medium">App Screenshot</span>
            <span className="text-xs opacity-70">300 x 600</span>
          </div>
        )}
      </div>
    </div>
  );
}
