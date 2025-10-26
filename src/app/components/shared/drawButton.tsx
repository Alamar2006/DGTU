import { Button } from "antd"
import { Check } from "lucide-react"

interface DrawButtonProps {
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export const DrawButton: React.FC<DrawButtonProps> = ({
  onClick,
  loading = false,
  disabled = false,
  className = ""
}) => {

  return (
    <Button 
      type="primary"
      size="large"
      onClick={onClick}
      loading={loading}
      disabled={disabled}
      className={`h-14 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border-0 rounded-xl flex items-center justify-center gap-3 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 dark:from-rose-600 dark:to-orange-600 dark:hover:from-rose-700 dark:hover:to-orange-700`}
    >
      <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center backdrop-blur-sm">
        <Check size={16} className="text-white" />
      </div>
      
      <p className="text-white">Показать маршруты</p>
    </Button>
  )
}

