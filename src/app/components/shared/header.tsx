import { ChevronUp, LayoutGrid} from "lucide-react";
import { ThemeToggle } from "./themeToggle";

interface Props {
    className?: string;
    setIsOpen: () => void
    isOpen: boolean
}

export const Header: React.FC<Props> = ({
    className,
    isOpen,
    setIsOpen
}) => {
    return (
        <header className='border-b sticky top-0 left-0 right-0 z-50 bg-[#f8fafc] dark:bg-[#0f172a] text-black dark:text-white'>
            <div className="mx-auto px-4 flex items-center justify-between py-4">
                
                {/* Left part */} 
                <button className="flex items-center gap-1 cursor-pointer" onClick={setIsOpen}>
                     {isOpen ? '' : <LayoutGrid/>}
                </button>

                {/* Middle */}
                <div>
                    <h1 className="text-xl font-semibold">Интеллектуальный планировщик</h1>
                </div>

                {/* Right part */}
                <div className="flex items-center gap-3 cursor-pointer">
                <ThemeToggle/>
                </div>
            </div>
        </header>
    );
};